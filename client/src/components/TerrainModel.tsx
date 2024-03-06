//@ts-nocheck
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { axiosWithAuth, setHeadersConfig } from '../utils/axiosWithAuth';
import { Model } from '../terainModel/model';
import { useParams, useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';
import apiEndpoints from '../constants/apiEndpoints';
import Toolbar from './toolbar/Toolbar';
import {
  IMapObjectOptions,
  PIN_TYPE,
  PIN_COLORS,
  IMapConfiguration,
} from '../interfaces/dashboard/Map';
import { MdOutlineFileUpload } from 'react-icons/md';
import { FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { SlDirection } from 'react-icons/sl';
import { IconContext } from 'react-icons';
import { ComponentMode } from '../interfaces/dashboard/ComponentProps';
import Popup from './popup/Popup';
import { v4 as uuidv4 } from 'uuid';
import PinPopup from './popup/PinPopup';
import PinPreviewPopup from './popup/PinPreviewPopup';
import { Gallery } from './Gallery';
import { Group, Object3D, Object3DEventMap } from 'three';
import MapTourControllers from './MapTourControllers';

const TerrainModelComponent = ({ mode, options }: any) => {
  const { modelid } = useParams();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const viewHelperCanvasWrapperRef = useRef(null);
  const northArrowCanvasWrapperRef = useRef(null);
  const [model, setModel] = useState(null);
  const [editingMapData, setEditingMapData] = useState<IMapConfiguration>(null);
  const [gpxTrailName, setGpxTrailName] = useState('');
  const [newPointOptions, setNewPointOptions] =
    useState<IMapObjectOptions>(null);
  const mainContext = useMainContext();
  const [isPinPopupOpened, setIsPinPopupOpened] = useState<boolean>(false);
  const [previewImageIndex, setPreviewImageIndex] = useState<number>(-1);

  const fileChangeHangler = async (event): void => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const requestConfig = setHeadersConfig({
        'Content-Type': 'multipart/form-data',
      });
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const res = await axios.post(
          apiEndpoints.uploadMedia,
          formData,
          requestConfig
        );

        setGpxTrailName(uploadedFile.name);
        model.drawTrail(res.data.file);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMapClick = (e: MouseEvent): void => {
    const clickedObjects = model.clickedObjects(e);

    if (!newPointOptions || !newPointOptions?.pinType) {
      let currObject = null;
      for (let i = 0; i < clickedObjects.length; i++) {
        let tmp = clickedObjects[i];
        let parent = tmp.object?.parent;

        while (parent instanceof Group) {
          if (
            Object.hasOwn(parent, 'isClickable') &&
            Object.hasOwn(parent, 'pinId')
          ) {
            currObject = parent;
            break;
          }
          parent = parent.parent;
        }

        if (
          Object.hasOwn(tmp.object, 'isClickable') &&
          Object.hasOwn(tmp.object, 'pinId')
        ) {
          currObject = tmp.object;
          break;
        }
      }
      console.log(currObject);
      if (currObject) {
        const selectedObjectData = model?.options?.mapObjects?.find(
          (_item) => _item.id === currObject.pinId
        );
        if (selectedObjectData) {
          setNewPointOptions({ ...selectedObjectData, event: e });
          setIsPinPopupOpened(true);
        }
      }
    } else {
      if (clickedObjects.length > 0) {
        if (!newPointOptions || !newPointOptions?.pinType) return;
        setNewPointOptions((newPointOptions) => ({
          ...newPointOptions,
          event: e,
        }));
        setIsPinPopupOpened(true);
        console.log(newPointOptions);
      }
    }
  };

  const handleNewPin = (): void => {
    if (!Object.hasOwn(newPointOptions, 'event') || !newPointOptions?.event)
      return;

    if (
      model.options.mapObjects.find((_item) => _item.id === newPointOptions.id)
    ) {
      const { x, y, z, ...rest } = newPointOptions;

      model.removeObjectFromMap(newPointOptions.id);
      model.addObjectToMap(x, y, z, rest);
    } else {
      const { event, ...restOptions } = newPointOptions;
      model.click(event, restOptions);
    }

    setNewPointOptions(null);
    setIsPinPopupOpened(false);
  };

  const confirm = () => {
    const newMapConfiguration = {
      ...editingMapData,
      mapModel: model.options,
    };

    axiosWithAuth
      .post(apiEndpoints.editMap(modelid), newMapConfiguration)
      .then((res) => {
        if (res.data.map) {
          navigate(-1);
        }
      });
  };

  const handleOnTrailPointReached = (point: IMapObjectOptions): void => {
    setNewPointOptions(point)
    setIsPinPopupOpened(true)
  }

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
          resData = res.data;
          console.log(resData.map);
          console.log(resData.mapPoints);
          setEditingMapData(resData.map);
          resData.map.mapModel.trailGpxUrl =
            resData.map.mapModel.trailGpxUrl ?? null;
        } catch (e) {
          navigate('/404');
          console.error(e);
        }
      }
      console.log('OPTIONS: ', options ?? resData.map.mapModel);
      newModel = new Model(
        canvasRef.current,
        viewHelperCanvasWrapperRef.current,
        northArrowCanvasWrapperRef.current,
        options ?? resData.map.mapModel
      );
      if (resData.mapPoints) {
        newModel.displayNearFeatures(JSON.parse(resData.mapPoints));
      }
      newModel.animate();
      newModel.onTrailPointReachedCallback = handleOnTrailPointReached
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

      if(animateTrail) {
        newModel.playTrailAnimation();
      }
      newModel.setEnableShadow(enableShadow);
      newModel.setEnableSun(enableSun);
      setModel(newModel);
    };

    if (!model) {
      setup();
    }

    return () => {
      console.log('COMPONENT UNMOUNTED');
      window.removeEventListener('keydown', (e) => keyEventHandler(e));
      if (newModel) {
        newModel.destroy();
      }
    };
  }, [modelid]);

  return (
    <>
      {mode === ComponentMode.PREVEIW && (
        <>
          <Popup
            isPopupOpened={isPinPopupOpened}
            setIsPopupOpened={setIsPinPopupOpened}
            onClose={() => setNewPointOptions(null)}
          >
            <PinPreviewPopup
              setImageIndex={setPreviewImageIndex}
              formState={newPointOptions}
            />
          </Popup>
          {newPointOptions?.images?.length > 0 && (
            <div className='relative z-[10001]'>
              <Gallery
                index={previewImageIndex}
                setIndex={setPreviewImageIndex}
                images={newPointOptions.images}
              />
            </div>
          )}
        </>
      )}
      {mode === ComponentMode.EDIT && (
        <Popup
          isPopupOpened={isPinPopupOpened}
          setIsPopupOpened={setIsPinPopupOpened}
          onClose={() => setNewPointOptions(null)}
        >
          <PinPopup
            formState={newPointOptions}
            setFormState={setNewPointOptions}
            onSubmit={handleNewPin}
          />
        </Popup>
      )}
      {mode === ComponentMode.EDIT && (
        <Toolbar>
          <div className='form flex flex-col justify-between h-full'>
            <div>
              <div className='mb-6'>
                <div className='mb-2'>
                  <label htmlFor='pgx'>GPX or FIT trail</label>
                </div>
                <div className='form__input--file mb-2'>
                  <label>
                    {gpxTrailName ? (
                      <div className='flex justify-center items-center overflow-hidden'>
                        <span className='mx-2 oveflow-hidden'>
                          {gpxTrailName}
                        </span>
                      </div>
                    ) : (
                      <IconContext.Provider
                        value={{
                          color: '#2EEBC9',
                          size: '30px',
                          className: 'upload-icon',
                        }}
                      >
                        <span>
                          <MdOutlineFileUpload />
                        </span>
                      </IconContext.Provider>
                    )}
                    <input
                      name='gpx'
                      type='file'
                      placeholder='gpx'
                      onChange={(e) => fileChangeHangler(e)}
                    />
                  </label>
                </div>
              </div>
              <div>
                <p className='mb-2'>Add Pin to map</p>
                <div className='pins-container mb-2'>
                  {Object.values(PIN_COLORS).map((_value, _index) => (
                    <div
                      key={_index}
                      className='cursor-pointer'
                      onClick={() =>
                        setNewPointOptions({
                          ...newPointOptions,
                          id: uuidv4(),
                          pinType: PIN_TYPE.PIN_SIGN,
                          color: _value.toString(),
                        })
                      }
                    >
                      <IconContext.Provider
                        value={{
                          color: `${_value.toString()}`,
                          size: '30px',
                          className: 'pin-icon',
                        }}
                      >
                        <span>
                          <FaMapMarkerAlt />
                        </span>
                      </IconContext.Provider>
                    </div>
                  ))}
                  <div
                    className='cursor-pointer'
                    onClick={() =>
                      setNewPointOptions({
                        ...newPointOptions,
                        id: uuidv4(),
                        pinType: PIN_TYPE.PIN_LABEL,
                      })
                    }
                  >
                    <IconContext.Provider
                      value={{
                        color: 'white',
                        size: '30px',
                        className: 'pin-icon',
                      }}
                    >
                      <span>
                        <SlDirection />
                      </span>
                    </IconContext.Provider>
                  </div>
                  <div
                    className='cursor-pointer'
                    onClick={() =>
                      setNewPointOptions({
                        ...newPointOptions,
                        id: uuidv4(),
                        pinType: PIN_TYPE.PIN_IMAGE,
                      })
                    }
                  >
                    <IconContext.Provider
                      value={{
                        color: 'white',
                        size: '30px',
                        className: 'pin-icon',
                      }}
                    >
                      <span>
                        <FaImage />
                      </span>
                    </IconContext.Provider>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center gap-6'>
              <button onClick={confirm} className='primary-button'>
                Save
              </button>
              <button onClick={cancel} className='secondary-button'>
                Back
              </button>
            </div>
          </div>
        </Toolbar>
      )}

      <MapTourControllers
        onStart={() => model.playTrailAnimation()}
        onPause={() => model.pauseTrailAnimation()}
        onStop={() => model.stopTrailAnimation()}
      />

      <div className={`${mode === ComponentMode.EDIT ? 'ml-[20px]' : ''}`}>
        <div
          className={`model-wrapper ${
            mode !== ComponentMode.PREVEIW ? 'fullscreen-with-nav' : 'h-screen'
          }`}
          ref={wrapperRef}
        >
          <canvas
            ref={canvasRef}
            width='1900'
            height='700'
            onClick={(e) => handleMapClick(e)}
            //onMouseMove={move}
            //onMouseDown={down}
          ></canvas>
          <div
            ref={viewHelperCanvasWrapperRef}
            className='axis-control'
            style={{ width: '128px', height: '128px' }}
          ></div>
          <div
            ref={northArrowCanvasWrapperRef}
            className='north-arrow-control'
            style={{ width: '128px', height: '128px' }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default TerrainModelComponent;
