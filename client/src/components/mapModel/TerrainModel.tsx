import { useEffect, useRef, useState, MouseEvent, useCallback } from 'react'
import { axiosWithAuth } from '../../utils/axiosWithAuth'
import { Model } from '../../terainModel/model'
import { useParams, useNavigate } from 'react-router-dom'
import { useMainContext } from '../../context/MainContext'
import apiEndpoints from '../../constants/apiEndpoints'
import {
  IMapObjectOptions,
  IMapPointDTO,
  IMapModelConfig,
} from '../../interfaces/dashboard/MapModel'
import { ComponentMode } from '../../interfaces/dashboard/ComponentProps'
import Popup from '../popup/Popup'
import PinPopup from '../popup/PinPopup'
import PinPreviewPopup from '../popup/PinPreviewPopup'
import { Gallery } from '../Gallery'
import { Group } from 'three'
import MapTourControllers from './MapTourControllers'
import NearbyPointsConfigPopup from '../popup/nearbyPOIsConfig/NearbyPointsConfigPopup'
import routes from '../../constants/routes'
import ModelToolbar from '../toolbar/modelToolbar/ModelToolbar'
import { useModelContext } from '../../context/ModelContext'

const TerrainModelComponent = ({ mode }) => {
  const { modelid } = useParams()
  const navigate = useNavigate()
  // main context
  const { setIsLoading } = useMainContext()
  // model context
  const {
    model,
    setModel,
    projectSettings,
    setProjectSettings,
    trailName,
    setTrailName,
  } = useModelContext()
  const [newPointOptions, setNewPointOptions] =
    useState<IMapObjectOptions>(null)
  const [isPinPopupOpened, setIsPinPopupOpened] = useState<boolean>(false)
  const [isImportPOIsPopupOpened, setIsImportPOIsPopupOpened] =
    useState<boolean>(false)
  const [previewImageIndex, setPreviewImageIndex] = useState<number>(-1)
  const [isMapBeeingDragged, setIsMapBeeingDragged] = useState<boolean>(false)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  // refs
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const viewHelperCanvasWrapperRef = useRef(null)
  const northArrowCanvasWrapperRef = useRef(null)
  // event ref
  const keyEventHandler = useRef(null)

  const handleMapClick = (e: MouseEvent): void => {
    if (isMapBeeingDragged) return
    // @ts-ignore
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
        if (!newPointOptions || !newPointOptions?.pinType || !(clickedObjects.find((x) => x.object.name === 'map'))) return
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
    //if (!Object.hasOwn(newPointOptions, 'event') || !newPointOptions?.event) {
    //  return
    //}

    const indexOfObject = model.options.mapObjects.findIndex(
      (_item) => _item.id === newPointOptions.id,
    )
    if (indexOfObject !== -1) {
      const currentObject = model.options.mapObjects[indexOfObject]
      const { x, y, z, event, ...rest } = newPointOptions

      model.removeObjectFromMap(newPointOptions.id)
      model.addObjectToMap(x, y, z, { event, ...rest })
      model.options.mapObjects[indexOfObject] = { ...currentObject, ...rest }
    } else {
      const { event, ...restOptions } = newPointOptions
      // @ts-ignore
      model.click(event, restOptions)
    }

    setProjectSettings((_currData) => ({
      ..._currData,
      mapModel: model.options,
    }))
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
      .delete(apiEndpoints.deleteUploadedMedia(trailName))
      .then((res) => {
        let currentOptions = model.options
        currentOptions.trailUrl = null
        setProjectSettings({ ...projectSettings, mapModel: currentOptions })
        setTrailName('')
        recreatedModel()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleOnTrailPointReached = (point: IMapObjectOptions): void => {
    setNewPointOptions(point)
    setIsPinPopupOpened(true)
    model?.pauseTrailAnimation()

    setTimeout(() => {
      setIsPinPopupOpened(false)
      setNewPointOptions(null)
      model?.playTrailAnimation()
    }, 3000)
  }

  const handleSubmitImportPOIS = (points: IMapPointDTO[]) => {
    model?.addNearbyPOIs(points)
    recreatedModel()
  }

  const toggleImportPOIsPopup = () => {
    const currState = isImportPOIsPopupOpened
    setIsImportPOIsPopupOpened(!currState)
  }

  const handleTextureStyleChange = (label: string) => {
    model.options.textureTypeLabel = label
    recreatedModel()
  }

  const handleModelOnload = (): void => {
    setIsLoading(false)
  }

  const setupModel = useCallback(async () => {
    // modelid should always exist
    if (!modelid) {
      return navigate(routes.notFound)
    }
    // model options
    let currentModelOptions: IMapModelConfig = null
    // get existing model options or call api
    if (projectSettings) {
      currentModelOptions = projectSettings.mapModel
      setTrailName(projectSettings.mapModel?.trailUrl ?? '')
    } else {
      try {
        const res = await axiosWithAuth.get(apiEndpoints.getMapDetail(modelid))
        const resData = res.data
        setProjectSettings(resData.map)
        setTrailName(resData.map.mapModel.trailUrl ?? '')
        resData.map.mapModel.trailUrl = resData.map.mapModel.trailUrl ?? null
        currentModelOptions = resData.map.mapModel
      } catch (e) {
        navigate('/404')
      }
    }

    const newModel = new Model(
      canvasRef.current,
      viewHelperCanvasWrapperRef.current,
      northArrowCanvasWrapperRef.current,
      currentModelOptions,
      handleModelOnload,
    )
    newModel.animate()
    newModel.onTrailPointReachedCallback = handleOnTrailPointReached
    //const controls = new CameraControls(newModel.camera, canvasRef.current);
    const controls = newModel.controls
    //newModel.setControls(controls);

    keyEventHandler.current = (e) => {
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

    window.addEventListener('keydown', keyEventHandler.current)

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

    if (currentModelOptions.animateTrail) {
      newModel.playTrailAnimation()
    }
    newModel.setEnableShadow(currentModelOptions.enableShadow)
    newModel.setEnableSun(currentModelOptions.enableSun)
    setModel(newModel)
  }, [
    handleModelOnload,
    handleOnTrailPointReached,
    modelid,
    navigate,
    projectSettings,
    setModel,
    setProjectSettings,
    setTrailName,
  ])

  const destroyModel = useCallback(() => {
    setIsLoading(true)

    window.removeEventListener('keydown', keyEventHandler.current)
    if (model) {
      setProjectSettings((_editingMapData) => ({
        ..._editingMapData,
        mapModel: model.options,
      }))
      model.destroy()
      setModel(null)
    }
  }, [keyEventHandler, model, setModel, setProjectSettings])

  const recreatedModel = () => {
    destroyModel()
    setupModel()
  }

  //useEffect(() => {
  //  setIsLoading(!isModelLoaded)
  //}, [isModelLoaded])

  useEffect(() => {
    if (!isModelLoaded) {
      setIsModelLoaded(true)
      setupModel()
    }

    return () => {
      console.log('COMPONENT UNMOUNTED')
      destroyModel()
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
      {mode === ComponentMode.EDIT && projectSettings && (
        <Popup
          isPopupOpened={isImportPOIsPopupOpened}
          setIsPopupOpened={setIsImportPOIsPopupOpened}
        >
          <NearbyPointsConfigPopup
            onSubmit={handleSubmitImportPOIS}
          />
        </Popup>
      )}
      {/* TOOLBAR */}
      {projectSettings && mode === ComponentMode.EDIT && (
        <ModelToolbar
          setNewPointOptions={setNewPointOptions}
          setIsPinPopupOpened={setIsPinPopupOpened}
          recreatedModel={recreatedModel}
          newPointOptions={newPointOptions}
          toggleImportPOIsPopup={toggleImportPOIsPopup}
          handleTextureStyleChange={handleTextureStyleChange}
          handleDeleteTrail={handleDeleteTrail}
        />
      )}
      {/* TRAIL ANIMATION CONTROLLERS */}
      {model?.options?.trailUrl && trailName && (
        <MapTourControllers
          timingConfig={{
            timestampStart: '2023-06-24T23:59:17.000Z',
            timestampEnd: '2023-06-25T08:42:17.000Z',
            animationDuration: 20000,
          }}
          onStart={() => model.playTrailAnimation()}
          onPause={() => model.pauseTrailAnimation()}
          onStop={() => model.stopTrailAnimation()}
        />
      )}
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
