import {Routes, Route} from 'react-router-dom'
import IsDeepfake from './Components/IsDeepfake/IsDeepfake'
import Home from './Components/Home/Home'


const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='isdeepfake' element={<IsDeepfake/>} />
      </Routes>
    </div>
  )
}
export default App