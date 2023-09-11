import React, { useState, useMemo, useRef, useEffect  } from 'react'
import TinderCard from 'react-tinder-card'
import samples from './samples.json'
import Canvas from './Canvas'
import Crypto from 'crypto-js'

function Advanced () {
  
  
  const generateHash = (a) => Crypto.MD5(JSON.stringify(a)).toString(Crypto.enc.Hex)

  const [db, setDb] = useState([]
      //samples.map((data, index) =>  ({...data, hash : generateHash(data.input)}))      
    )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastDirection, setLastDirection] = useState()
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
    
    var postdata = { category:	"airplane", type:	"training"};
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

//   const canGoBack = currentIndex < db.length - 1

//   const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  async function swiped (direction, nameToDelete, index){
    console.log("swiped" + index)
    setLastDirection(direction)
    updateCurrentIndex(index + 1)
    return new Promise(addCard);
  }

  // const outOfFrame = (name, idx) => {
  //   console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
  //   // handle the case in which go back is pressed before card goes outOfFrame
  //   currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
  //   // TODO: when quickly swipe and restore multiple times the same card,
  //   // it happens multiple outOfFrame events are queued and the card disappear
  //   // during latest swipes. Only the last outOfFrame event should be considered valid
  // }

  const swipe = async (dir) => {    
    console.log(childRefs);
    console.log(currentIndex);
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!    
  }

//   // increase current index and show card
//   const goBack = async () => {
//     if (!canGoBack) return
//     const newIndex = currentIndex + 1
//     updateCurrentIndex(newIndex)
//     await childRefs[newIndex].current.restoreCard()
//   }


//   const getImage = async () => {

//     var postdata = { category:	"airplane", type:	"training"};
//     var header = {"Content-Type": "application/json"};

//     fetch('/category.training.get', {
//       method: "POST",
//       headers: header,
//       body: JSON.stringify(postdata),
//     })
//     .then((res) => res.json())
//     .then( (data) => {console.log(data)}, (error) => {console.log(error)} )
// }

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
      <h1>title</h1>      
      <h1>React Tinder Card</h1>      
      <div className='cardContainer'>
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.hash}
            preventSwipe={['up','down','left','right']}            
            onSwipe={(dir) => swiped(dir, character.hash, index)}
            //onCardLeftScreen={() => outOfFrame(character.hash, index)}
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
      <div className='iconButtons'>      
        <button altname="airplane" onClick={() => swipe('left')}>✈️</button>
        <button altname="automobile">🚗</button>
        <button altname="bird">🐦</button>
        <button altname="cat">🐱</button>
        <button altname="deer">🦌</button>
      </div>
      <div className='iconButtons'>
        <button altname="dog">🐶</button>
        <button altname="frog">🐸</button>
        <button altname="horse">🐴</button>
        <button altname="ship">🚢</button>
        <button altname="truck">🚛</button>
      </div>
      <div className='buttons'></div>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>        
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  )
  /* ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"] */
  // 🦌✈️🐦🕊️🐈🐱🐶🐕🐸🐴🐎⛵🚢🛳️🚢🚛🚚
}

export default Advanced
