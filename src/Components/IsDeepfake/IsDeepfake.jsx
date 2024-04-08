import { useState } from "react"
import axios from 'axios'

const IsDeepfake = () => {

  const [dataUrl, setDataUrl ]= useState(null)


  function readImageFile (file){
    return new Promise((resolve, reject)=>{
      const fileReader = new FileReader()
      fileReader.onload = ()=> resolve(fileReader.result)
      fileReader.onerror = ()=> reject(fileReader.error)
      fileReader.readAsDataURL(file)
    })
  }

  async function HANDLECHANGE (e){
    const file = e.target.files[0]
    const result = await readImageFile(file)
    setDataUrl(result)
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:8880/deepfake', formData)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <input type="file" onChange={HANDLECHANGE}/>

      <hr />

      {dataUrl && <img src={dataUrl} alt="" />}
    </div>
  )
}
export default IsDeepfake
