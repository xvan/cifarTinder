import React, { useState, useMemo, useRef, useEffect  } from 'react'
import TinderCard from 'react-tinder-card'
import Canvas from './Canvas'
import Crypto from 'crypto-js'
import Icon from './Icon.js'

function Advanced () {
  
  

  function rand(items) {
    // "~~" for a closest "int"
    return items[~~(items.length * Math.random())];
  }

  const categorySpanish = ["avión", "automóvil", "pájaro", "gato", "ciervo", "perro", "rana", "caballo", "barco", "camión"];
  const categoryArray = ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"];
  const categoryMap = {"airplane" : 0, "automobile" : 1, "bird" : 2, "cat" :3, "deer" : 4, "dog" : 5, "frog" : 6, "horse" : 7, "ship": 8, "truck" : 9}


  function getCategory(output){
    for (let i = 0; i < output.length; i++) {
      if(output[i]) return categorySpanish[i];
    }
  }

  const swipeDirections = ['down','left','right']
  
  const generateHash = (a) => Crypto.MD5(JSON.stringify(a)).toString(Crypto.enc.Hex)

  const [db, setDb] = useState([]
      //samples.map((data, index) =>  ({...data, hash : generateHash(data.input)}))      
    )

  const [transition, setTransition] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correct, setCorrect] = useState(false)
  const [lost, setLost] = useState(false)

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)


  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function addCard(){
    console.log("current_lenght " + db.length)    
    
    var postdata = { category:	rand(categoryArray), type:	"training"};
    var header = {"Content-Type": "application/json"};

    
    fetch('/category.training.get', {
      method: "POST",
      headers: header,
      body: JSON.stringify(postdata),
    })
    .then((res) => res.json())
    .then( (data) => 
        {
          childRefs.push(React.createRef())
          setDb( current => [ ...current, {...data, hash : generateHash(data.input)}])             
          console.log(db.length);
          console.log(db.map((a,b) => a.hash ))
          //addCard();
        },
        (error) => {console.log(error)} )
  }

  useEffect(() => { 
    if (db.length < 5 ) addCard();
   }, [db]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }


const endAnimation = () =>{
  console.log("end Animation") ; 
  setCorrect(false);
  setTransition(false);
}

//   const canGoBack = currentIndex < db.length - 1

//   const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  async function swiped (direction, nameToDelete, index){
    console.log("swiped" + index)
    updateCurrentIndex(index + 1)
    return new Promise(addCard);
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    //currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    setTransition(true)      
    console.log(childRefs);
    console.log(currentIndex);
      if( db[currentIndex].output[categoryMap[dir]]){
        setCorrect(true);
        console.log("correct");
        await childRefs[currentIndex].current.swipe(rand(swipeDirections)) // Swipe the card!    
      }
      else{
        console.log("incorrect");
        setLost(true);
      }      
  }

  function refreshPage() {
    //window.location.reload(false);
    setDb([]);
    setTransition(false);
    setCurrentIndex(0);
    setCorrect(false);
    setLost(false);    
  }

  return (
    <div>
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      <Icon/>

      <div className='titlebox'>
        { lost ? 
          <h1 key={`Score${currentIndex}`}><a className='refreshCircle' href="" onClick={refreshPage}>↻</a></h1>
          : currentIndex == 0
            ? <h1 key="BigTitle">CIFAR10</h1>
            : <h1 key={`Score${currentIndex}`} className='circleNumber'>{currentIndex}</h1>}
      </div>

      <div className='cardContainer'>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className={`swipe ${lost ? "lostBorder" : "commonBorder" }`}
            key={character.hash}
            preventSwipe={['up','down','left','right']}            
            onSwipe={(dir) => swiped(dir, character.hash, index)}            
            onCardLeftScreen={() => outOfFrame(character.hash, index)}
          >
            <Canvas data={character}/>
            {/* <div
              style={{ backgroundImage: 'url(' + character.url + ')' }}
              className='card'
            >
              
            </div> */}
          </TinderCard>
        )).reverse()}
      </div>
      {/* <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => getImage()}>Get Image!</button>
      </div> */}
      
      

      
      <div className='botonera'>
      <div className='iconButtons'>      
        <button altname="airplane" disabled={transition} onClick={() => swipe('airplane')}>✈️</button>
        <button altname="automobile" disabled={transition} onClick={() => swipe('automobile')}>🚗</button>
        <button altname="bird" disabled={transition} onClick={() => swipe('bird')}>🐦</button>
        <button altname="cat" disabled={transition} onClick={() => swipe('cat')}>🐱</button>
        <button altname="deer" disabled={transition} onClick={() => swipe('deer')}>🦌</button>
      </div>
      <div className='iconButtons'>
        <button altname="dog" disabled={transition} onClick={() => swipe('dog')}>🐶</button>
        <button altname="frog" disabled={transition} onClick={() => swipe('frog')}>🐸</button>
        <button altname="horse" disabled={transition} onClick={() => swipe('horse')}>🐴</button>
        <button altname="ship" disabled={transition} onClick={() => swipe('ship')}>🚢</button>
        <button altname="truck" disabled={transition} onClick={() => swipe('truck')}>🚛</button>
      </div>
      </div>
      <div className='titlebox'>
      { correct ?  <h2 key="thisIsCorrect" className='infoText' onAnimationEnd={endAnimation}>Correcto!!!</h2>  
      : lost ?  <h2 key="thisIsCorrect" className='infoText lostBox' >{`Perdiste!!! era ${getCategory(db[currentIndex].output)}. Puntaje ${currentIndex}`}</h2>  
      : <h2 key="placeholder" className='placeholder'>placeholder</h2> }
      </div>
      {/* { lost ?  <h2 key="playAgain" className='infoText lostBox' ><href onClick={refreshPage}>¿Jugar de Nuevo?</href></h2>  : <h2 key="placeholder" className='placeholder'>placeholder</h2> } */}

      {/* {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>        
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )} */}
    </div>
  )
  /* ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"] */
  // 🦌✈️🐦🕊️🐈🐱🐶🐕🐸🐴🐎⛵🚢🛳️🚢🚛🚚
}

export default Advanced
