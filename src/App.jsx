import {Routes, Route} from 'react-router-dom'
import IsDeepfake from './Components/IsDeepfake/IsDeepfake'
import Home from './Components/Home/Home'
import { AnimatePresence } from 'framer-motion'


const App = () => {
  return (
    <div className="app">
      <AnimatePresence>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='isdeepfake' element={<IsDeepfake/>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
export default App