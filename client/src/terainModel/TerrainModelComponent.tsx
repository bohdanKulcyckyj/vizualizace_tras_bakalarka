//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { Model } from './model';
import { useMainContext } from '../context/MainContext';

function TerrainModelComponent({ options } : any) {
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
    if (!model) {
      console.log(viewHelperCanvasWrapperRef.current);
      console.log(northArrowCanvasWrapperRef.current);
      console.log(canvasRef.current);

      const newModel = new Model(
        canvasRef.current,
        viewHelperCanvasWrapperRef.current,
        northArrowCanvasWrapperRef.current,
        options
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
