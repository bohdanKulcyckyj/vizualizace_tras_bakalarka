//@ts-nocheck
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { axiosWithAuth, setHeadersConfig } from "../utils/axiosWithAuth";
import { Model } from "../terainModel/model";
import { useParams, useNavigate } from "react-router-dom";
import { useMainContext } from "../context/MainContext";
import apiEndpoints from "../constants/apiEndpoints";
import Toolbar from "./toolbar/Toolbar";
import { IMapObjectOptions, PIN_TYPE, PIN_COLORS } from "../interfaces/dashboard/Map";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaMapMarkerAlt, FaImage } from "react-icons/fa";
import { IconContext } from "react-icons";
import { ComponentMode } from "../interfaces/dashboard/ComponentProps";
import routes from "../constants/routes";

const TerrainModelComponent = ({ mode, options }: any) => {
  const { modelid } = useParams();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const viewHelperCanvasWrapperRef = useRef(null);
  const northArrowCanvasWrapperRef = useRef(null);
  const [model, setModel] = useState(null);
  const [gpxTrailName, setGpxTrailName] = useState("");
  const [pointWithLabel, setPointWithLabel] = useState<boolean>(false);
  const [newPointOptions, setNewPointOptions] = useState<IMapObjectOptions>(null);
  const mainContext = useMainContext();

  const fileChangeHangler = async (event): void => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      requestConfig = setHeadersConfig({"Content-Type": "multipart/form-data"})
      const formData = new FormData();
      formData.append("file", uploadedFile);

      try {
        const res = await axios.post(apiEndpoints.uploadMedia, formData, requestConfig);
        setGpxTrailName(uploadedFile.name);
        model.drawTrail(res.data.uri);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMapClick = (e: MouseEvent): void => {
    model.click(e, newPointOptions)
    setNewPointOptions(null)
  };

  const confirm = () => {
    axiosWithAuth.post(apiEndpoints.editMap(modelid), model.options)
    .then(res => {
      if(res.data.map) {
        navigate(routes.mapPreview(modelid))
      }
    })
  };

  const cancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (mainContext) {
      mainContext.setIsLoading(true);
      setTimeout(() => {
        mainContext.setIsLoading(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    let newModel = null;

    const setup = async () => {
      let res, resData;
      if (modelid) {
        try {
          res = await axiosWithAuth.get(apiEndpoints.getMapDetail(modelid));
          console.log(res);
          resData = res.data;
          resData.mapModel.trailGpxUrl = resData.mapModel.trailGpxUrl ?? null;
        } catch (e) {
          navigate("/404");
          console.error(e);
        }
      }
      console.log("OPTIONS: ", options ?? resData.mapModel);
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
        const keyRotateAngle = (keyRotateSpeed * Math.PI) / 180;

        if (e.shiftKey) {
          switch (e.keyCode) {
            case 37: // LEFT
              controls.rotate(-keyRotateAngle, 0);
              break;
            case 38: // UP
              controls.rotate(0, keyRotateAngle);
              break;
            case 39: // RIGHT
              controls.rotate(keyRotateAngle, 0);
              break;
            case 40: // DOWN
              controls.rotate(0, -keyRotateAngle);
              break;
            case 82: // Shift + R
              controls.reset();
              break;
            default:
              return;
          }
        } else if (e.ctrlKey) {
          switch (e.keyCode) {
            case 37: // Ctrl + LEFT
              newModel.cameraRotate(keyRotateAngle, 0);
              break;
            case 38: // Ctrl + UP
              newModel.cameraRotate(0, keyRotateAngle);
              break;
            case 39: // Ctrl + RIGHT
              newModel.cameraRotate(-keyRotateAngle, 0);
              break;
            case 40: // Ctrl + DOWN
              newModel.cameraRotate(0, -keyRotateAngle);
              break;
            default:
              return;
          }
        } else {
          const keyPanSpeed = 0.2;

          switch (e.keyCode) {
            case 37: // LEFT
              controls.truck(-keyPanSpeed, 0, true); // horizontally left
              break;
            case 38: // UP
              controls.forward(keyPanSpeed, true); // horizontally forward
              break;
            case 39: // RIGHT
              controls.truck(keyPanSpeed, 0, true);
              break;
            case 40: // DOWN
              controls.forward(-keyPanSpeed, true);
              break;
            default:
              return;
          }
        }
      };

      window.addEventListener("keydown", (e) => keyEventHandler(e));

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
    };

    if (!model) {
      setup();
    }

    return () => {
      console.log("COMPONENT UNMOUNTED");
      window.removeEventListener("keydown", (e) => keyEventHandler(e));
      if (newModel) {
        newModel.destroy();
      }
    };
  }, [modelid]);

  return (
    <>
      {mode === ComponentMode.EDIT && (
        <Toolbar>
          <div className="form flex flex-col justify-between h-full">
            <div>
              <div className="mb-6">
                <div className="mb-2">
                  <label htmlFor="pgx">GPX trail</label>
                </div>
                <div className="form__input--file mb-2">
                  <label>
                    {gpxTrailName ? (
                      <div className="flex justify-center items-center overflow-hidden">
                        <span className="mx-2 oveflow-hidden">
                          {gpxTrailName}
                        </span>
                      </div>
                    ) : (
                      <IconContext.Provider
                        value={{
                          color: "#2EEBC9",
                          size: "30px",
                          className: "upload-icon",
                        }}
                      >
                        <span>
                          <MdOutlineFileUpload />
                        </span>
                      </IconContext.Provider>
                    )}
                    <input
                      name="gpx"
                      type="file"
                      placeholder="gpx"
                      onChange={(e) => fileChangeHangler(e)}
                    />
                  </label>
                </div>
              </div>
              <div>
                <p className="uppercase mb-2">Add Pin to map</p>
                <div className="pins-container mb-2">
                  {Object.values(PIN_COLORS).map((_value, _index) => (
                  <div
                    key={_index}
                    className="cursor-pointer"
                    onClick={() =>
                      setNewPointOptions({
                        ...newPointOptions,
                        pinType: PIN_TYPE.PIN_SIGN,
                        color: _value.toString()
                      })
                    }>
                    <IconContext.Provider
                      value={{
                        color: `${_value.toString()}`,
                        size: "30px",
                        className: "pin-icon",
                      }}
                    >
                      <span>
                        <FaMapMarkerAlt />
                      </span>
                    </IconContext.Provider>
                  </div>))}
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      setNewPointOptions({
                        ...newPointOptions,
                        pinType: PIN_TYPE.PIN_IMAGE,
                      })
                    }
                  >
                    <IconContext.Provider
                      value={{
                        color: "white",
                        size: "30px",
                        className: "pin-icon",
                      }}
                    >
                      <span>
                        <FaImage />
                      </span>
                    </IconContext.Provider>
                  </div>
                </div>
                {pointWithLabel && (
                  <div>
                    <label htmlFor="point-label"></label>
                    <input className="w-full" name="point-label" type="text" value={newPointOptions?.label ?? ''} onChange={(e) => {
                      setNewPointOptions({...newPointOptions, label: e.target.value})
                    }} />
                  </div>
                )}
                <label className={`form__checkbox transition-all ${pointWithLabel ? "mt-2" : "mt-0"}`}>
                  <input
                    onClick={() => setPointWithLabel(!pointWithLabel)}
                    type="checkbox"
                    name="with-label"
                    id="with-label"
                    value={pointWithLabel}
                  />
                  <p className="checkbox-label">With Label</p>
                </label>
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
        </Toolbar>
      )}
      <div className={`${mode === ComponentMode.EDIT ? "ml-[20px]" : ""}`}>
        <div
          className={`model-wrapper ${
            mode !== ComponentMode.PREVEIW ? "fullscreen-with-nav" : "h-screen"
          }`}
          ref={wrapperRef}
        >
          <canvas
            ref={canvasRef}
            width="1900"
            height="700"
            onClick={(e) => handleMapClick(e)}
            //onMouseMove={move}
            //onMouseDown={down}
          ></canvas>
          <div
            ref={viewHelperCanvasWrapperRef}
            className="axis-control"
            style={{ width: "128px", height: "128px" }}
          ></div>
          <div
            ref={northArrowCanvasWrapperRef}
            className="north-arrow-control"
            style={{ width: "128px", height: "128px" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default TerrainModelComponent;