import './App.css';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {decreaseLives} from "./features/lives/livesSlice";


let idArray = [];
function App() {
    const [compToSend, setCompToSend] = useState(null);
    const [dimensions, setDimensions] = useState(4);
    const dispatch = useDispatch();
    const lives = useSelector((state) => state.lives.livesCount);

    let myForm = (
        <div className="getDimDiv">
            <label htmlFor="input">Enter Dimensions between 4 and 8:</label>
            <input type="number"
                   onKeyDown={event => {
                       if (event.key === "Enter") {
                           event.preventDefault();
                           mySetDimensions(event);
                       }
                   }}>
            </input>
        </div>);


    //set dimensions we got from user and create our array storing images
    const mySetDimensions = (event) => {
        if (event.target.value < 4) {
            alert("value cannot be under 4");
            return;
        } else if (event.target.value > 8) {
            alert("value cannot be more than 8");
            return;
        }
        let myDim = event.target.value;
        createArr(myDim);
        setDimensions(myDim);
    }




    //create id's for individual img components so we can reach them by searching later
    function idMaker (imgName){
            let str = imgName+"i0";
        if (idArray.indexOf(str) === -1) {
            idArray.push(str);
            return str;
        } else {
            let str1 = imgName+"i1";
            idArray.push(str1);
            return str1;
        }
    }

    let clickCount = 0;
    let imgToSearch;
    let lastIndex;
    let lastEvent;


let livesStatic = 10;
    const myLogic = (event, imgName, index) => {
        if (clickCount === 0) {
            event.target.classList.add("animateMe");
            event.target.classList.add("selected");
            setTimeout(()=>{event.target.classList.remove("selected")}, 1000);
            imgToSearch = imgName;
            lastIndex = index;
            clickCount = 1;
        } else if (clickCount === 1) {
            event.target.classList.add("animateMe");
            if (lastIndex === index) {
                alert("don't choose the same one!");
                return;
            }
            if (imgName === imgToSearch) {
                clickCount = 0;
                event.target.style="pointer-events:none"
                lastEvent.target.style="pointer-events:none"

            } else {
                if(livesStatic === 1) {
                    alert("you lost!");
                    for(let i = 0; i < idArray.length; i++) {
                        document.getElementById(idArray[i]).classList.add("disabled");
                    }
                }
                dispatch(decreaseLives());
                livesStatic--;
                console.log(lives);
                clickCount = 0;
                lastEvent.target.classList.remove("animateMe");
                setTimeout((()=>{ event.target.classList.remove("animateMe");}), 1000)
            }
        }
        lastEvent = event;
    }


    let imagesArray = new Array(64);
    for (let i = 0; i < 64; i++) {
        imagesArray[i] = Math.floor(i / 2);
        let str = "p";
        imagesArray[i] = str + imagesArray[i];
    }


    let myImgArr;


    function createArr(dimensions) {
        myImgArr = new Array(dimensions * dimensions);
        for (let i = 0; i < myImgArr.length; i++) {
            myImgArr[i] = imagesArray[i];
        }
        myImgArr.sort(() => (Math.random() > .5) ? 1 : -1);
        setCompToSend(myImgArr.map((imgName, index) => (
            <div className="picHolder"><img className="noTouching" id={idMaker(imgName)} onClick={(event) => {
                myLogic(event, imgName, index)
            }} src={`/assets/images/${imgName}.png`}/></div>
        )));
    }

    function stringToSend() {
        let str = `repeat(${dimensions}, minmax(0,1fr))`;
        return str;

    }



    function startGame () {
        for(let i = 0; i < idArray.length; i++) {
            document.getElementById(idArray[i]).classList.add("disabled");
        }
        setTimeout( ()=>{for(let i = 0; i < idArray.length; i++) {
                document.getElementById(idArray[i]).classList.remove("disabled");
                document.getElementById(idArray[i]).classList.remove("noTouching");
            }}, 5000
        );
    }

    function peek () {
        for(let i = 0; i < idArray.length; i++) {
            document.getElementById(idArray[i]).classList.add("disabled");
        }
        setTimeout( ()=>{for(let i = 0; i < idArray.length; i++) {
                document.getElementById(idArray[i]).classList.remove("disabled");
            }}, 1000
        );
    }


    return (
        <div className="myApp">
            {myForm}
            <div className="container"
                 style={{gridTemplateColumns: `${stringToSend()}`, gridTemplateRows: `${stringToSend()}`}}>
                {compToSend}
            </div>
            <button onClick={startGame}>start</button>
            <button onClick={peek}>peek!</button>
            <label>lives left: {lives}</label>
        </div>

    );
}


export default App;
