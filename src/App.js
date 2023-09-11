import React, { useState } from 'react'
import './App.css'
import Advanced from './Advanced'
import Canvas from './Canvas'



function App () {
  const [showAdvanced, setShowAdvanced] = useState(true)

  return (
    <div className='app'>
      <Advanced />      
      {/* <Canvas data={sampleData}/> */}
    </div>
  )
}

export default App
