//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Model } from './model';
import { useParams, useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';
import { getTokenFromCookie } from '../utils/jwt';
import { BASE_URL, MAP_DETAIL } from '../api/endpoints';

function TerrainModelComponent({ options } : any) {
  const { mapid } = useParams();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const viewHelperCanvasWrapperRef = useRef(null);
  const northArrowCanvasWrapperRef = useRef(null);
  const [model, setModel] = useState(null);
  const mainContext = useMainContext();

  useEffect(() => {
    if(mainContext) {
      mainContext.setIsLoading(true);
      setTimeout(() => {
        mainContext.setIsLoading(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const setup = async () => {
      console.log(viewHelperCanvasWrapperRef.current);
      console.log(northArrowCanvasWrapperRef.current);
      console.log(canvasRef.current);

      let token = getTokenFromCookie()
      const requestConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
      let res, resData;
      if(mapid) {
        try {
          res = await axios.get(MAP_DETAIL + mapid, requestConfig)
          console.log(res)
          resData = res.data
          resData.mapModel.trailGpxUrl = resData.mapModel.trailGpxUrl ? BASE_URL + resData.mapModel.trailGpxUrl : null
          console.log(resData.mapModel.trailGpxUrl)
          console.log(resData)
        } catch(e) {
          //navigate("/404");
          console.error(e)
        }
      }
      console.log("OPTIONS: ", options ?? resData.mapModel)
      const newModel = new Model(
        canvasRef.current,
        viewHelperCanvasWrapperRef.current,
        northArrowCanvasWrapperRef.current,
        options ?? resData.mapModel
      );
      setModel(newModel);
      newModel.animate();
      //const controls = new CameraControls(newModel.camera, canvasRef.current);
      const controls = newModel.controls;
      //newModel.setControls(controls);

      window.addEventListener('keydown', (e) => {

        const keyRotateSpeed = 0.5;
        const keyRotateAngle = keyRotateSpeed * Math.PI / 180;
  
  
        if (e.shiftKey) {
  
          switch (e.keyCode) {
            case 37:  // LEFT
              controls.rotate(-keyRotateAngle, 0);
              break;
            case 38:  // UP
              controls.rotate(0, keyRotateAngle);
              break;
            case 39:  // RIGHT
              controls.rotate(keyRotateAngle, 0);
              break;
            case 40:  // DOWN
              controls.rotate(0, -keyRotateAngle);
              break;
            case 82:  // Shift + R
              controls.reset();
              break;
            default:
              return;
          }
  
        }
        else if (e.ctrlKey) {
          switch (e.keyCode) {
            case 37:  // Ctrl + LEFT
              newModel.cameraRotate(keyRotateAngle, 0);
              break;
            case 38:  // Ctrl + UP
              newModel.cameraRotate(0, keyRotateAngle);
              break;
            case 39:  // Ctrl + RIGHT
              newModel.cameraRotate(-keyRotateAngle, 0);
              break;
            case 40:  // Ctrl + DOWN
              newModel.cameraRotate(0, -keyRotateAngle);
              break;
            default:
              return;
          }
        }
        else {
          const keyPanSpeed = 0.2;
  
          switch (e.keyCode) {
            case 37:  // LEFT
              controls.truck(-keyPanSpeed, 0, true);    // horizontally left
              break;
            case 38:  // UP
              controls.forward(keyPanSpeed, true);    // horizontally forward
              break;
            case 39:  // RIGHT
              controls.truck(keyPanSpeed, 0, true);
              break;
            case 40:  // DOWN
              controls.forward(-keyPanSpeed, true);
              break;
            default:
              return;
          }
        }
      });

      const resize = () => {
        newModel.resize(
          wrapperRef.current.offsetWidth,
          wrapperRef.current.offsetHeight
        );
      };

      const resizeObserver = new ResizeObserver((entries) => {
        resize();
      });
      resizeObserver.observe(wrapperRef.current);

      // Následující kód pro sledování změn konfigurace můžete přesunout sem
      const animateTrail = mainContext.animateTrail;
      const enableShadow = mainContext.enableShadow;
      const enableSun = mainContext.enableSun;

      newModel.setAnimateTrail(animateTrail);
      newModel.setEnableShadow(enableShadow);
      newModel.setEnableSun(enableSun);
    }
    if (!model) {
      setup();
    }
  }, [model, options, mainContext]);

  return (
    <div className="model-wrapper" ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        width="1500"
        height="700"
        //onClick={click}
        //onMouseMove={move}
        //onMouseDown={down}
      ></canvas>
      <div
        ref={viewHelperCanvasWrapperRef}
        className="axis-control"
        style={{ width: '128px', height: '128px' }}
      ></div>
      <div
        ref={northArrowCanvasWrapperRef}
        className="north-arrow-control"
        style={{ width: '128px', height: '128px' }}
      ></div>
    </div>
  );
}

export default TerrainModelComponent;
