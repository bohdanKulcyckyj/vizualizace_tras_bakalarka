//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Model } from './model';
import { useParams, useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';
import { getTokenFromCookie } from '../utils/jwt';
import { BASE_URL, MAP_DETAIL, UPLOAD_MEDIA } from '../api/endpoints';
import Toolbar from '../components/toolbar/Toolbar';
import { IMapObjectOptions, PIN_TYPE } from '../interfaces/MapInterfaces';
import { getEventListeners } from 'events';

const TerrainModelComponent = ({ type, options } : any) => {
  const { modelid } = useParams();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const viewHelperCanvasWrapperRef = useRef(null);
  const northArrowCanvasWrapperRef = useRef(null);
  const [model, setModel] = useState(null);
  const [gpxTrailUrl, setGpxTrailUrl] = useState(null);
  const [pointWithLabel, setPointWithLabel] = useState<boolean>(false);
  const [pointLabel, setPointLabel] = useState<string>('My Point');
  const [returningObj, setReturningObj] = useState<any>(null)
  const [newPointOptions, setNewPointOptions] = useState<IMapObjectOptions>({pinType: PIN_TYPE.PIN_GREEN, label: "My Point"})
  const mainContext = useMainContext();

  const fileChangeHangler = async (event) => {
    const uploadedFile = event.target.files[0]
    if(uploadedFile) {
      let token = getTokenFromCookie();
      const requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const res = await axios.post(UPLOAD_MEDIA, formData, requestConfig);
        setGpxTrailUrl(res.data.uri)
        model.drawTrail(res.data.uri)
      }
      catch(e) {
        console.error(e);
      }
    }
  }

  const handleMapClick = (e: MouseEvent): void => {
    setReturningObj(model.click(e, newPointOptions))
    console.log("event se spustil")
  }

  const confirm = () => {
    console.log("confirm")
    console.log(model.options)
  }

  const cancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    if(mainContext) {
      mainContext.setIsLoading(true);
      setTimeout(() => {
        mainContext.setIsLoading(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    let newModel = null;

    const setup = async () => {
      //console.log(viewHelperCanvasWrapperRef.current);
      //console.log(northArrowCanvasWrapperRef.current);
      //console.log(canvasRef.current);

      let token = getTokenFromCookie()
      const requestConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
      let res, resData;
      if(modelid) {
        try {
          res = await axios.get(MAP_DETAIL + modelid, requestConfig)
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
      newModel = new Model(
        canvasRef.current,
        viewHelperCanvasWrapperRef.current,
        northArrowCanvasWrapperRef.current,
        options ?? resData.mapModel
      );
      newModel.animate();
      setModel(newModel);
      //const controls = new CameraControls(newModel.camera, canvasRef.current);
      const controls = newModel.controls;
      //newModel.setControls(controls);

      const keyEventHandler = (e) => {
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
      }

      window.addEventListener('keydown', (e) => keyEventHandler(e));

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

      const animateTrail = mainContext.animateTrail;
      const enableShadow = mainContext.enableShadow;
      const enableSun = mainContext.enableSun;

      newModel.setAnimateTrail(animateTrail);
      newModel.setEnableShadow(enableShadow);
      newModel.setEnableSun(enableSun);
      setModel(newModel);
    }

    if (!model) {
      setup();
    }

    return () => {
      console.log("COMPONENT UNMOUNTED")
      window.removeEventListener('keydown', (e) => keyEventHandler(e));
      if(newModel) {
        newModel.destroy();
      }
    }
  }, [modelid]);

  useEffect(() => {
    if(model && canvasRef.current && type === "edit") {
      canvasRef.current.removeEventListener("click", handleMapClick);

      setTimeout(() => {
        canvasRef.current.addEventListener("click", handleMapClick);
      }, 10)
    }

    return () => {
      if(canvasRef.current) {
        canvasRef.current.removeEventListener("click", handleMapClick)
      }
    }
  }, [model, canvasRef, newPointOptions])

  return (
    <>
      {type === "edit" && <Toolbar>
        <div className="flex flex-col justify-between h-full">
          <div>
            <div>
              <label htmlFor="gpx">GPX path</label>
              <input name="gpx" type="file" placeholder="gpx" onChange={(e) => fileChangeHangler(e)} />
            </div>
            <div>
              <p>Map Pins</p>
              <div>
                <label htmlFor="with-label">With Label</label>
                <input onClick={() => setPointWithLabel(!pointWithLabel)} type="checkbox" name="with-label" id="with-label" value={pointWithLabel} />
              </div>
              {pointWithLabel && <div>
                <label htmlFor="point-label"></label>
                <input name="point-label" type="text"  />
              </div>}
              <div className="flex flex-col mt-2">
                <div className="cursor-pointer" onClick={() => setNewPointOptions(newPointOptions => ({...newPointOptions, pinType: PIN_TYPE.PIN_GREEN, label: pointWithLabel ? pointLabel : ""}))}>Pin1</div>
                <div className="cursor-pointer" onClick={() => setNewPointOptions(newPointOptions => ({...newPointOptions, pinType: PIN_TYPE.PIN_IMAGE, label: pointWithLabel ? pointLabel : ""}))}>Image</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6">
            <button onClick={confirm} className="primary-button">
              Save
            </button>
            <button onClick={cancel} className="secondary-button">
              Back
            </button>
          </div>
        </div>
      </Toolbar>}
    <div className={`${type === "edit" ? "ml-[20px]" : ""}`}>
      <div className={`model-wrapper ${type !== "preview" ? 'fullscreen-with-nav' : 'h-screen'}`} ref={wrapperRef}>
        <canvas
          ref={canvasRef}
          width="1900"
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
      </div>
    </>
  );
}

export default TerrainModelComponent;
