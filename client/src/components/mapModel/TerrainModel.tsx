//@ts-nocheck
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { axiosWithAuth, setHeadersConfig } from '../../utils/axiosWithAuth'
import { Model } from '../../terainModel/model'
import { useParams, useNavigate } from 'react-router-dom'
import { useMainContext } from '../../context/MainContext'
import apiEndpoints from '../../constants/apiEndpoints'
import Toolbar from '../toolbar/Toolbar'
import {
  IMapObjectOptions,
  PIN_TYPE,
  PIN_COLORS,
  IMapDTO,
  IMapPointDTO,
} from '../../interfaces/dashboard/MapModel'
import { MdOutlineFileUpload } from 'react-icons/md'
import { FaMapMarkerAlt, FaImage } from 'react-icons/fa'
import { SlDirection } from 'react-icons/sl'
import { IconContext } from 'react-icons'
import { ComponentMode } from '../../interfaces/dashboard/ComponentProps'
import Popup from '../popup/Popup'
import { v4 as uuidv4 } from 'uuid'
import PinPopup from '../popup/PinPopup'
import PinPreviewPopup from '../popup/PinPreviewPopup'
import { Gallery } from '../Gallery'
import { Group } from 'three'
import MapTourControllers from './MapTourControllers'
import MapPinsList from '../toolbar/MapPinsList'
import { toast } from 'sonner'
import { getPinTitle } from '../../utils/pins'
import NearbyPointsConfigPopup from '../popup/nearbyPOIsConfig/NearbyPointsConfigPopup'
import { Range } from 'react-range'

const TerrainModelComponent = ({ mode, options }: any) => {
  const { modelid } = useParams()
  const navigate = useNavigate()
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const viewHelperCanvasWrapperRef = useRef(null)
  const northArrowCanvasWrapperRef = useRef(null)
  const [model, setModel] = useState<unknown>(null)
  const [editingMapData, setEditingMapData] = useState<IMapDTO>(null)
  const [gpxTrailName, setGpxTrailName] = useState<string>('')
  const [newPointOptions, setNewPointOptions] =
    useState<IMapObjectOptions>(null)
  const mainContext = useMainContext()
  const [isPinPopupOpened, setIsPinPopupOpened] = useState<boolean>(false)
  const [isImportPOIsPopupOpened, setIsImportPOIsPopupOpened] =
    useState<boolean>(false)
  const [previewImageIndex, setPreviewImageIndex] = useState<number>(-1)
  const [isMapBeeingDragged, setIsMapBeeingDragged] = useState<boolean>(false)
  const [heightCoefficientRangeValue, setHeightCoefficientRangeValue] =
    useState<number>(1)

  const fileChangeHangler = async (event): void => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      const requestConfig = setHeadersConfig({
        'Content-Type': 'multipart/form-data',
      })
      const formData = new FormData()
      formData.append('file', uploadedFile)

      try {
        const res = await axios.post(
          apiEndpoints.uploadMedia,
          formData,
          requestConfig,
        )

        setGpxTrailName(uploadedFile.name)
        model.drawTrail(res.data.file)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleMapClick = (e: MouseEvent): void => {
    if (isMapBeeingDragged) return

    const clickedObjects = model.clickedObjects(e)

    if (!newPointOptions || !newPointOptions?.pinType) {
      let currObject = null
      for (let i = 0; i < clickedObjects.length; i++) {
        let tmp = clickedObjects[i]
        let parent = tmp.object?.parent

        while (parent instanceof Group) {
          if (
            Object.hasOwn(parent, 'isClickable') &&
            Object.hasOwn(parent, 'pinId')
          ) {
            currObject = parent
            break
          }
          parent = parent.parent
        }

        if (
          Object.hasOwn(tmp.object, 'isClickable') &&
          Object.hasOwn(tmp.object, 'pinId')
        ) {
          currObject = tmp.object
          break
        }
      }
      console.log(currObject)
      if (currObject) {
        const selectedObjectData = model?.options?.mapObjects?.find(
          (_item) => _item.id === currObject.pinId,
        )
        if (selectedObjectData) {
          setNewPointOptions({ ...selectedObjectData, event: e })
          setIsPinPopupOpened(true)
        }
      }
    } else {
      if (clickedObjects.length > 0) {
        if (!newPointOptions || !newPointOptions?.pinType) return
        setNewPointOptions((newPointOptions) => ({
          ...newPointOptions,
          event: e,
        }))
        setIsPinPopupOpened(true)
        console.log(newPointOptions)
      }
    }
  }

  const handleNewPin = (): void => {
    if (!Object.hasOwn(newPointOptions, 'event') || !newPointOptions?.event)
      return

    if (
      model.options.mapObjects.find((_item) => _item.id === newPointOptions.id)
    ) {
      const { x, y, z, ...rest } = newPointOptions

      model.removeObjectFromMap(newPointOptions.id)
      model.addObjectToMap(x, y, z, rest)
    } else {
      const { event, ...restOptions } = newPointOptions
      model.click(event, restOptions)
    }

    setNewPointOptions(null)
    setIsPinPopupOpened(false)
  }

  const handleDeletePin = () => {
    model.removeObjectFromMap(newPointOptions.id)
    model.options.mapObjects = model.options.mapObjects.filter(
      (_option) => _option.id !== newPointOptions.id,
    )
    setNewPointOptions(null)
    setIsPinPopupOpened(false)
  }

  const handleDeleteTrail = () => {
    axiosWithAuth
      .delete(apiEndpoints.deleteUploadedMedia(gpxTrailName))
      .then((res) => {
        let currentOptions = model.options
        currentOptions.trailGpxUrl = null
        setEditingMapData({ ...editingMapData, mapModel: currentOptions })
        setGpxTrailName('')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const confirm = () => {
    const newMapConfiguration = {
      ...editingMapData,
      mapModel: model.options,
    }

    axiosWithAuth
      .post(apiEndpoints.editMap(modelid), newMapConfiguration)
      .then((res) => {
        if (res.data.map) {
          navigate(-1)
        }
      })
  }

  const handleOnTrailPointReached = (point: IMapObjectOptions): void => {
    setNewPointOptions(point)
    setIsPinPopupOpened(true)
    model.pauseTrailAnimation()

    setTimeout(() => {
      setIsPinPopupOpened(false)
      setNewPointOptions(null)
      model.playTrailAnimation()
    }, 3000)
  }

  const handleSubmitImportPOIS = (points: IMapPointDTO[]) => {
    model?.addNearbyPOIs(points)
  }

  const toggleImportPOIsPopup = () => {
    const currState = isImportPOIsPopupOpened
    setIsImportPOIsPopupOpened(!currState)
  }

  const cancel = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (mainContext) {
      mainContext.setIsLoading(true)
      setTimeout(() => {
        mainContext.setIsLoading(false)
      }, 5000)
    }
  }, [])

  useEffect(() => {
    let newModel = null

    const setup = async () => {
      let res, resData
      if (modelid) {
        try {
          res = await axiosWithAuth.get(apiEndpoints.getMapDetail(modelid))
          resData = res.data
          setEditingMapData(resData.map)
          resData.map.mapModel.trailGpxUrl =
            resData.map.mapModel.trailGpxUrl ?? null
        } catch (e) {
          navigate('/404')
          console.error(e)
        }
      }
      newModel = new Model(
        canvasRef.current,
        viewHelperCanvasWrapperRef.current,
        northArrowCanvasWrapperRef.current,
        options ?? resData.map.mapModel,
      )
      if (resData.mapPoints) {
        newModel.displayNearFeatures(JSON.parse(resData.mapPoints))
      }
      newModel.animate()
      newModel.onTrailPointReachedCallback = handleOnTrailPointReached
      setModel(newModel)
      //const controls = new CameraControls(newModel.camera, canvasRef.current);
      const controls = newModel.controls
      //newModel.setControls(controls);

      const keyEventHandler = (e) => {
        const keyRotateSpeed = 0.5
        const keyRotateAngle = (keyRotateSpeed * Math.PI) / 180

        if (e.shiftKey) {
          switch (e.keyCode) {
            case 37: // LEFT
              controls.rotate(-keyRotateAngle, 0)
              break
            case 38: // UP
              controls.rotate(0, keyRotateAngle)
              break
            case 39: // RIGHT
              controls.rotate(keyRotateAngle, 0)
              break
            case 40: // DOWN
              controls.rotate(0, -keyRotateAngle)
              break
            case 82: // Shift + R
              controls.reset()
              break
            default:
              return
          }
        } else if (e.ctrlKey) {
          switch (e.keyCode) {
            case 37: // Ctrl + LEFT
              newModel.cameraRotate(keyRotateAngle, 0)
              break
            case 38: // Ctrl + UP
              newModel.cameraRotate(0, keyRotateAngle)
              break
            case 39: // Ctrl + RIGHT
              newModel.cameraRotate(-keyRotateAngle, 0)
              break
            case 40: // Ctrl + DOWN
              newModel.cameraRotate(0, -keyRotateAngle)
              break
            default:
              return
          }
        } else {
          const keyPanSpeed = 0.2

          switch (e.keyCode) {
            case 37: // LEFT
              controls.truck(-keyPanSpeed, 0, true) // horizontally left
              break
            case 38: // UP
              controls.forward(keyPanSpeed, true) // horizontally forward
              break
            case 39: // RIGHT
              controls.truck(keyPanSpeed, 0, true)
              break
            case 40: // DOWN
              controls.forward(-keyPanSpeed, true)
              break
            default:
              return
          }
        }
      }

      window.addEventListener('keydown', (e) => keyEventHandler(e))

      const resize = () => {
        newModel.resize(
          wrapperRef.current.offsetWidth,
          wrapperRef.current.offsetHeight,
        )
      }

      const resizeObserver = new ResizeObserver((entries) => {
        resize()
      })
      resizeObserver.observe(wrapperRef.current)

      const animateTrail = mainContext.animateTrail
      const enableShadow = mainContext.enableShadow
      const enableSun = mainContext.enableSun

      if (animateTrail) {
        newModel.playTrailAnimation()
      }
      newModel.setEnableShadow(enableShadow)
      newModel.setEnableSun(enableSun)
      setModel(newModel)
    }

    if (!model) {
      setup()
    }

    return () => {
      console.log('COMPONENT UNMOUNTED')
      window.removeEventListener('keydown', (e) => keyEventHandler(e))
      if (newModel) {
        newModel.destroy()
      }
    }
  }, [modelid])

  return (
    <>
      {/* PIN POPUP IN PREVIEW MODE  */}
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
      {/* PIN POPUP IN EDIT MODE  */}
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
            onDelete={handleDeletePin}
          />
        </Popup>
      )}
      {/* IMPORT POIs POPUP */}
      {mode === ComponentMode.EDIT && editingMapData && (
        <Popup
          isPopupOpened={isImportPOIsPopupOpened}
          setIsPopupOpened={setIsImportPOIsPopupOpened}
        >
          <NearbyPointsConfigPopup
            modelConfig={editingMapData.mapModel}
            onSubmit={handleSubmitImportPOIS}
          />
        </Popup>
      )}
      {/* TOOLBAR */}
      {mode === ComponentMode.EDIT && (
        <Toolbar>
          <div className='form flex flex-col justify-between h-full'>
            <div>
              {/* GPX / FIT uploading */}
              <div className='mb-6'>
                <div className='flex justify-between flex-wrap gap-2 mb-2'>
                  <label htmlFor='pgx'>GPX or FIT trail</label>
                  {gpxTrailName && (
                    <button
                      className='secondary-button secondary-button--small'
                      onClick={handleDeleteTrail}
                    >
                      delete
                    </button>
                  )}
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
              {/* NEW PIN */}
              <div>
                <p className='mb-2'>New Pin</p>
                <div className='pins-container mb-2'>
                  {Object.values(PIN_COLORS).map((_value, _index) => (
                    <div
                      title={getPinTitle(PIN_TYPE.PIN_SIGN)}
                      key={_index}
                      className='cursor-pointer'
                      onClick={() => {
                        setNewPointOptions({
                          ...newPointOptions,
                          id: uuidv4(),
                          pinType: PIN_TYPE.PIN_SIGN,
                          color: _value.toString(),
                        })
                        toast('Click on the map to place new pin', {
                          position: 'bottom-center',
                        })
                      }}
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
                    title={getPinTitle(PIN_TYPE.PIN_LABEL)}
                    className='cursor-pointer'
                    onClick={() => {
                      setNewPointOptions({
                        ...newPointOptions,
                        id: uuidv4(),
                        pinType: PIN_TYPE.PIN_LABEL,
                      })
                      toast('Click on the map to place new pin', {
                        position: 'bottom-center',
                      })
                    }}
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
                    title={getPinTitle(PIN_TYPE.PIN_IMAGE)}
                    className='cursor-pointer'
                    onClick={() => {
                      setNewPointOptions({
                        ...newPointOptions,
                        id: uuidv4(),
                        pinType: PIN_TYPE.PIN_IMAGE,
                      })
                      toast('Click on the map to place new pin', {
                        position: 'bottom-center',
                      })
                    }}
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
              {/* PLACED PINS */}
              {model?.options?.mapObjects?.length > 0 && (
                <div className='mb-3'>
                  <MapPinsList
                    data={model?.options?.mapObjects ?? []}
                    onPinSelect={(pin: IMapObjectOptions) => {
                      setNewPointOptions(pin)
                      setIsPinPopupOpened(true)
                    }}
                  />
                </div>
              )}
              {/* TOGGLE NEARBY FEATURES */}
              <div className='flex justify-end my-4'>
                <button
                  className='secondary-button secondary-button--small'
                  onClick={toggleImportPOIsPopup}
                >
                  Import POIs
                </button>
              </div>
              {/* HEIGHT SCALE RANGE */}
              <div>
                <div className='flex justify-between items-center my-2'>
                  <p>Heights scale</p>
                  <p>{heightCoefficientRangeValue}</p>
                </div>
                <Range
                  step={0.1}
                  min={1}
                  max={10}
                  values={[heightCoefficientRangeValue]}
                  onChange={(values) => {
                    console.log(model.options)
                    if (model?.options) {
                      setHeightCoefficientRangeValue(values[0])
                      model.options.heightCoefficient = values[0]
                    }
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '6px',
                        width: '100%',
                        backgroundColor: '#2EEBC9',
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '22px',
                        width: '22px',
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        outline: 'none',
                      }}
                    />
                  )}
                />
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
      {/* TRAIL ANIMATION CONTROLLERS */}
      <MapTourControllers
        onStart={() => model.playTrailAnimation()}
        onPause={() => model.pauseTrailAnimation()}
        onStop={() => model.stopTrailAnimation()}
      />
      {/* MODEL */}
      <div className={`${mode === ComponentMode.EDIT ? 'ml-[20px]' : ''}`}>
        <div className='model-wrapper h-screen' ref={wrapperRef}>
          <canvas
            ref={canvasRef}
            width='1900'
            height='700'
            onClick={(e) => handleMapClick(e)}
            onMouseMove={() => setIsMapBeeingDragged(true)}
            onMouseDown={() => setIsMapBeeingDragged(false)}
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
  )
}

export default TerrainModelComponent
