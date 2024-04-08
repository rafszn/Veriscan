import { useState } from "react"
import axios from 'axios'
import {motion } from 'framer-motion'
import { ArrowBackIosRounded } from "@mui/icons-material"
import { Link} from 'react-router-dom'
import { BeatLoader} from 'react-spinners'
import './isdeepfake.scss'

const IsDeepfake = () => {

  const [dataUrl, setDataUrl ]= useState(null)
  const [isLoading, setIsLoading ]= useState(false)
  const [predictions, setPredictions ]= useState('')
  const [msg, setMsg ]= useState('hello')



  function readImageFile (file){
    return new Promise((resolve, reject)=>{
      const fileReader = new FileReader()
      fileReader.onload = ()=> resolve(fileReader.result)
      fileReader.onerror = ()=> reject(fileReader.error)
      fileReader.readAsDataURL(file)
    })
  }

  async function HANDLECHANGE (e){
    setPredictions(null)
    const file = e.target.files[0]
    const result = await readImageFile(file)
    setDataUrl(result)
    
    try {
      setIsLoading(true)
      setMsg('Loading Image')
      const formData = new FormData();
      formData.append('file', file);
      setMsg('Analyzing image data')
      const response = await axios.post('http://localhost:8880/deepfake', formData)
      setMsg('Making Predictions')
      console.log(response.data[0])
      setPredictions(response.data[0])
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <motion.div className="deepfake">
      <header>
        <Link to='/'>  
          <ArrowBackIosRounded/>
        </Link>
        <h2>Veriscan</h2>
        <ArrowBackIosRounded style={{opacity:0}}/>
      </header>

      <div className="textContainer">
        <p>Choose an Image:</p>
        <input type="file" onChange={HANDLECHANGE}/>
        <button>
          Predict
        </button>
      </div>


      {isLoading && (
      <motion.div className="loader"
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:.5}}
      >
        <BeatLoader 
          color="blue"
          size=".5rem"
        /> 
        <motion.p
        initial={{opacity:0, translateY:60}}
        animate={{opacity:1, translateY:0}}
        transition={{duration:.5, delay:0.2}}
        >
          {msg}
        </motion.p>
      </motion.div>)}

      {/* {predictions && <img src={dataUrl} alt="" />} */}
      {predictions && (
      <div className="imageContainer">

        <div className="imgC">
          <motion.img src={dataUrl} alt=""
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{duration:.5}}
          />
        </div>
        <div className="predictionBox">
          <div className="predictions">
            <h3>
              PREDICTION DATA
            </h3>

            <div className="data">
              <h1> Image Type: <span style={{color:predictions.class === 'Deepfake' ? 'red' : 'green'}}>{predictions.class.toUpperCase()}</span></h1>
              <h2>Confidence Level: <span>{Math.floor(predictions.score * 100).toFixed(1)}% Accuracy</span></h2>
            </div>
          </div>

        </div>
      </div>)}
    </motion.div>
  )
}
export default IsDeepfake
