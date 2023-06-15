import React, { useEffect, useRef, useState } from "react";
import *  as cocoSsd from "@tensorflow-models/coco-ssd";//to load the model
import * as tf from "@tensorflow/tfjs";// to load the model in tensorFlow
import Webcam from "react-webcam";
const MyObjectDectection = () => {
  const [model, setModel] = useState();
  const [videoWidth, setVideoWidth] = useState(600);
  const [videoHeight, setVideoHeight] = useState(500);
  const webcamRef = useRef(null);
  const webcamScreen = {
    height: 500,
    width: 600,
    facingMode: "environment",
  };
  useEffect(()=>{
    const loadModel = async()=>{
        try{
            const loadedModel = await cocoSsd.load();//to load the model
            setModel(loadedModel);
            console.log("Success");
        }catch (err) {
            console.log(err,"\n Erro In Loading model");
        }
    }
    tf.ready().then(()=>{
        loadModel();
    })//loading the model here
  })
  const predectionFunction =async ()=>{
    const myCanvas = document.getElementById("canvas");// to create a space that shows the data
    const ctx=myCanvas.getContext("2d");
    ctx.clearRect(
      0,0,
      webcamRef.current.video.videoHeight,
      webcamRef.current.video.videoWidth
    );
    const Predections = await model.detect(document.getElementById("webCamImg"))
    if (Predections.length > 0) {
      console.log("Model Predections\n",Predections);
      for (let n = 0; n < Predections.length; n++) {
        if (Predections[n].score > 0.8) {
          let boxLeft = Predections[n].bbox[0]//left cordinate
          let boxTop = Predections[n].bbox[1]//top cordinate
          let boxWidth = Predections[n].bbox[2]//width of the box
          let boxHeigth = Predections[n].bbox[3]-boxTop;//height of the box
          ctx.beginPath();
          ctx.font="28px Arial";
          ctx.fillStyel="red";
          ctx.fillText(
            Predections[n].class + ": " + Math.round(parseFloat(Predections[n].score)*100)+"%",
            boxLeft,
            boxTop
          );
          ctx.rect(boxLeft,boxTop,boxWidth,boxHeigth);
          ctx.strokeStyle="#FF0000";
          ctx.lineWidth=3;
          ctx.stroke();
        }
      }
    }
    setTimeout(() =>predectionFunction(),500);
  }
  return (
    <React.Fragment>
      <div style={{ backgroundColor: "black" }}>
        <Webcam
        id="webCamImg"
          audio={false}
          ref={webcamRef}
          screenshotQuality={1}
          screenshotFormat="image/jpeg"
          videoConstraints={webcamScreen}
        />
      </div>
      <div>
      <button onClick={()=>{
        predectionFunction()
      }}>Start Predection</button>
      </div>
      <div style={{position:"absolute",zIndex:9999,top:0}}>
        <canvas 
        id="canvas"
        width={videoHeight}
        height={videoHeight}
        style={{backgroundColor:"transparent"}}
        />
      </div>
    </React.Fragment>
  );
};

export default MyObjectDectection;
