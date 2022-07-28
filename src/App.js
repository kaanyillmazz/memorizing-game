import './App.css';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {decreaseLives} from "./features/lives/livesSlice";


let idArray = [];

let correctAudio = new Audio("./assets/sounds/correct.mp3");
let victoryAudio = new Audio("./assets/sounds/victory.mp3");

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

    let remainingToFind;
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
        createElements(myDim);
        setDimensions(myDim);

        remainingToFind = Math.floor(myDim*myDim/2)

    }


    //create id's for individual img components so we can reach them by searching later
    function idMaker(imgName) {
        let str = imgName + "i0";
        if (idArray.indexOf(str) === -1) {
            idArray.push(str);
            return str;
        } else {
            let str1 = imgName + "i1";
            idArray.push(str1);
            return str1;
        }
    }

    let clickCount = 0;
    let imgToSearch;
    let lastIndex;
    let lastEvent;
    let livesLocal = 10;

    const myLogic = (event, imgName, index) => {
        if (clickCount === 0) {
            event.target.classList.add("animateMe");
            event.target.classList.add("selected");
            setTimeout(() => {
                event.target.classList.remove("selected")
            }, 1000);
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
                correctAudio.play();
                event.target.style = "pointer-events:none"
                lastEvent.target.style = "pointer-events:none"
                remainingToFind--;
                if(remainingToFind === 0) {
                    victoryAudio.play();
                    alert("you won!");
                }
            } else {
                if (livesLocal === 1) {
                    alert("you lost!");
                    for (let i = 0; i < idArray.length; i++) {
                        document.getElementById(idArray[i]).classList.add("disabled");
                    }
                }
                dispatch(decreaseLives());
                livesLocal--;
                clickCount = 0;
                lastEvent.target.classList.remove("animateMe");
                setTimeout((() => {
                    event.target.classList.remove("animateMe");
                }), 1000)
            }
        }
        lastEvent = event;
    }


    let allImages = new Array(64);
    for (let i = 0; i < 64; i++) {
        allImages[i] = Math.floor(i / 2);
        let str = "p";
        allImages[i] = str + allImages[i];
    }


    let imagesInGame;


    function createElements(dimensions) {
        imagesInGame = new Array(dimensions * dimensions);
        for (let i = 0; i < imagesInGame.length; i++) {
            imagesInGame[i] = allImages[i];
        }
        imagesInGame.sort(() => (Math.random() > .5) ? 1 : -1);
        setCompToSend(imagesInGame.map((imgName, index) => (
            <div className="picHolder">
                <img className="noTouching" id={idMaker(imgName)}
                     onClick={(event) => { myLogic(event, imgName, index)}}
                     src={`/assets/images/${imgName}.png`}/>
            </div>
        )));
    }

    function gridAttributesString() {
        let str = `repeat(${dimensions}, minmax(0,1fr))`;
        return str;
    }


    function startGame() {
        for (let i = 0; i < idArray.length; i++) {
            document.getElementById(idArray[i]).classList.add("disabled");
        }
        setTimeout(() => {
                for (let i = 0; i < idArray.length; i++) {
                    document.getElementById(idArray[i]).classList.remove("disabled");
                    document.getElementById(idArray[i]).classList.remove("noTouching");
                }
            }, 5000
        );
    }

    function peek() {
        for (let i = 0; i < idArray.length; i++) {
            document.getElementById(idArray[i]).classList.add("disabled");
        }
        setTimeout(() => {
                for (let i = 0; i < idArray.length; i++) {
                    document.getElementById(idArray[i]).classList.remove("disabled");
                }
            }, 1000
        );
    }


    return (
        <div className="myApp">
            {myForm}
            <div className="container"
                 style={{
                     gridTemplateColumns: `${gridAttributesString()}`,
                     gridTemplateRows: `${gridAttributesString()}`
                 }}>
                {compToSend}
            </div>
            <button onClick={startGame}>start</button>
            <button onClick={peek}>peek!</button>
            <label>lives left: {lives}</label>
        </div>

    );
}


export default App;
