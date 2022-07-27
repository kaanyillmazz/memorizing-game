import './App.css';
import {useRef, useState} from "react";

function App() {

    const [compToSend, setCompToSend] = useState(null);
    const [dimensions, setDimensions] = useState(4);

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
        console.log(dimensions);
    }


    let idArray = [];
    //create id's for individual img components so we can reach them by searching later
    function idMaker (imgName){
            let str = imgName+"i0";
        if (idArray.indexOf(str) === -1) {
            console.log("undef");
            idArray.push(str);
            return str;
        } else {
            let str1 = imgName+"i1";
            idArray.push(str1);
            console.log("twas here");
            return str1;
        }
    }

    let clickCount = 0;
    let imgToSearch;
    let lastIndex;
    let lastEvent;
    const myLogic = (event, imgName, index) => {


        if (clickCount === 0) {
            event.target.classList.add("animateMe");
            imgToSearch = imgName;
            lastIndex = index;
            clickCount = 1;
        } else if (clickCount === 1) {
            event.target.classList.add("animateMe");
            if (lastIndex === index) {
                clickCount = 0;
                alert("aynisini secme");
                return;
            }
            if (imgName === imgToSearch) {
                clickCount = 0;
                let str =imgName+"i0";
                event.target.style="pointer-events:none"
                lastEvent.target.style="pointer-events:none"
                let str1 = imgName+"i1";

            } else {
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
    console.log(imagesArray);


    let myImgArr;


    function createArr(dimensions) {
        myImgArr = new Array(dimensions * dimensions);
        for (let i = 0; i < myImgArr.length; i++) {
            myImgArr[i] = imagesArray[i];
        }
        myImgArr.sort(() => (Math.random() > .5) ? 1 : -1);
        setCompToSend(myImgArr.map((imgName, index) => (
            <div className="picHolder"><img id={idMaker(imgName)} onClick={(event) => {
                myLogic(event, imgName, index)
            }} src={`/assets/images/${imgName}.png`}/></div>
        )));
        console.log(myImgArr);
    }


    function stringToSend() {
        let str = `repeat(${dimensions}, minmax(0,1fr))`;
        console.log(str);
        return str;

    }

    return (
        <div className="myApp">
            {myForm}
            <div className="container"
                 style={{gridTemplateColumns: `${stringToSend()}`, gridTemplateRows: `${stringToSend()}`}}>
                {compToSend}
            </div>
        </div>

    );
}


export default App;
