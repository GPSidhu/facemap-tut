/*
Install dependencies
Import dependencies
Setup webcam and canvas
Define references to those
Load face landmark detection
Detect function
Load triangulation
Setup triangle path
Setup point drawing
Add drawMesh to detect function
*/

import React, { useRef, useEffect } from 'react';
import * as tf from "@tensorflow/tfjs";
// import * as facemesh from "@tensorflow-models/facemesh";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import {drawMesh} from './utilities';

import logo from './logo.svg';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load facemesh
  const runFaceMesh = async () => {
    // OLD MODEL
    // const net = await facemesh.load({
    //   inputResolution: { width: 640, height: 480 },
    //   scale: 0.8,
    // });
    // NEW MODEL
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    setInterval(() => {
      detect(net);
    }, 5);
  }

  // Detect function
  const detect = async (net) => {
    if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get video props
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width/height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width/height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // OLD MODEL
      //       const face = await net.estimateFaces(video);
      // NEW MODEL
      const face = await net.estimateFaces({input:video});
      console.log(face);

      // Get canvas context from drawing
      const ctx = canvasRef.current.getContext("2d");
      // drawMesh(face, ctx);
      requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  }

  useEffect(()=>{runFaceMesh()}, []);
  // runFaceMesh();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: 640,
              height: 480
            }} />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }} />
      </header>
    </div>
  );
}

export default App;
