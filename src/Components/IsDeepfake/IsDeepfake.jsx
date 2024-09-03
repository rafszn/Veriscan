import { useState } from "react"
import axios from 'axios'
import {motion , AnimatePresence} from 'framer-motion'
import { ArrowBackIosRounded, ErrorOutlineRounded,WysiwygRounded, CloudDownloadRounded} from "@mui/icons-material"
import { Link} from 'react-router-dom'
import { BeatLoader} from 'react-spinners'
import { usePDF } from 'react-to-pdf';

import './isdeepfake.scss'

const IsDeepfake = () => {

  const [dataUrl, setDataUrl ]= useState(null)
  const [file, setFile ]= useState(null)
  const [isLoading, setIsLoading ]= useState(false)
  const [predictions, setPredictions ]= useState('')
  const [msg, setMsg ]= useState('')
  const [error, setError ]= useState(false)
  const [isShown, setIsShown ]= useState(false)
  const [array, setArray ]= useState([])
  const [isOpen, setIsOpen ]= useState(false)

  const { toPDF, targetRef } = usePDF({filename: 'image records.pdf', page:{
    margin: 25
  }});

  function readImageFile (file){
    return new Promise((resolve, reject)=>{
      const fileReader = new FileReader()
      fileReader.onload = ()=> resolve(fileReader.result)
      fileReader.onerror = ()=> reject(fileReader.error)
      fileReader.readAsDataURL(file)
    })
  }

  async function HANDLECHANGE(e){
    setError(false)
    setPredictions(null)
    setMsg(null)
    const filee = e.target.files[0]
    setFile(filee)
    const result = await readImageFile(filee)
    setDataUrl(result)

  }

  async function HANDLEUPLOAD (){

    if(!file){
      return
    }
    if(file.type === 'image/png' || file.type === 'image/webp' ){
      return
    }
    
    try {
      setIsLoading(true)
      setMsg('Loading Image')
      const formData = new FormData();
      formData.append('file', file);
      setMsg('Analyzing image data')
      const response = await axios.post('https://veriscan-n.vercel.app/deepfake', formData)

      const [name ]= file.name.split('.')
      const obj = { 
        fileImage: dataUrl,
        fileType: file.type,
        prediction: response.data[0].class,
        accuracy: response.data[0].score * 100
      }
      setArray([...array, obj])
      setPredictions(response.data[0])
      // console.log(array)
      setIsLoading(false)

    } catch (error) {
      console.log(error.response.data.message)
      setIsLoading(false)
      setError(true)
    }
  }

  return (
    <div>

      <motion.div className="deepfake"
      initial={{opacity:0, x:100}}
      animate={{opacity:1, x:0}}
      transition={{duration:.3}}
      exit={{opacity:0, x:100}}>
        <header>
          <Link to='/'>  
            <ArrowBackIosRounded/>
          </Link>
          <h2>Veriscan</h2>
          <ArrowBackIosRounded style={{opacity:0}}/>
        </header>

        <div className="disclaimer">
          <ErrorOutlineRounded style={{color:'red'}} onClick={()=> setIsShown(!isShown)}/>

        <AnimatePresence>
          {isShown && (
            <div>
              <motion.p
              key='disc'
              initial={{opacity:0, translateY:-60}}
              animate={{opacity:1, translateY:0}}
              transition={{duration:.3}}
              exit={{opacity:0, translateY:-60}}>
                This app does not support video files. Additionally, while we strive for accuracy, our results are based on limited datasets and algorithms and may not be 100% foolproof. We appreciate your understanding and feedback as we continue to improve our service.
              </motion.p>
            </div>
          )}
        </AnimatePresence>
        </div>

        <div className="textContainer">
          <p>Choose an Image:</p>
          <i className="params">
            does not support .png and .webp files
          </i>
          <input type="file" onChange={HANDLECHANGE}/>
          {/* <input type="text" placeholder="provide an image url"onChange={HANDLECHANGE}/> */}
          <button onClick={HANDLEUPLOAD} disabled={isLoading}>
            Scan Image Data
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

        {error && (<>
        <div className="p">
          <motion.p
          initial={{opacity:0, translateY:60}}
          animate={{opacity:1, translateY:0}}
          transition={{duration:.5, delay:0.2}}
          >cant upload .png or .webp files, please try again</motion.p>
        </div>
        </>)}


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

        {array && array.length > 0 && <motion.div className="mt"
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:.5}}>
          <abbr title="show recent image records">
            <WysiwygRounded onClick={()=> setIsOpen(!isOpen)}/>
          </abbr>    
        </motion.div>}
      
        <AnimatePresence>
          {array && array.length > 0 && isOpen && (<motion.div ref={targetRef} className="records"
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{duration:.5}}
          exit={{opacity:0}}>
            
            <p>IMAGE RECORDS</p>

            {array.map((result, i)=>{
              return (
              <div key={i}>
                <div className="record">
                  <i>{i+1}.</i>
                  <img src={result.fileImage} alt="" />
                  <p>file type: <span>{result.fileType}</span></p>
                  <p>prediction: <span style={{color: result.prediction === 'Deepfake' ? 'red' : 'green'}}>{result.prediction.toUpperCase()}</span></p>
                  <p>accuracy: <span>{Math.round(result.accuracy)}%</span></p> 

                </div>
                <hr /> 
              </div>
              )
            })}

            <motion.div whileHover={{scale:.9}}>
              <CloudDownloadRounded onClick={() => toPDF()} className="mt"/>
            </motion.div>
            
          </motion.div>)}
        </AnimatePresence>

      </motion.div>
    </div>
  )
}
export default IsDeepfake
