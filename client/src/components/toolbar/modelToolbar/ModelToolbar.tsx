import React from 'react'
import apiEndpoints from '../../../constants/apiEndpoints'
import { axiosWithAuth } from '../../../utils/axiosWithAuth'
// components
import Toolbar from '../Toolbar'
import SelectTilesTexture from './SelectTilesTexture'
import HeightsScaleRange from './HeightsScaleRange'
import TrailUploader from './TrailUploader'
import NewPinPanel from './NewPinPanel'
import MapPinsList from '../MapPinsList'

// interfaces
import { IMapObjectOptions } from '../../../interfaces/dashboard/MapModel'
// enums
import { useNavigate } from 'react-router-dom'

// data

const ModelToolbar = ({
  model,
  modelid,
  editingMapData,
  setEditingMapData,
  setNewPointOptions,
  setIsPinPopupOpened,
  heightCoefficientRangeValue,
  setHeightCoefficientRangeValue,
  recreatedModel,
  newPointOptions,
  toggleImportPOIsPopup,
  handleTextureStyleChange,
  gpxTrailName,
  handleDeleteTrail,
  fileChangeHandler,
}) => {
  const navigate = useNavigate()

  const handleCancel = (): void => {
    navigate(-1)
  }

  const handleSubmit = (): void => {
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

  return (
    <Toolbar>
      <div className='form flex flex-col justify-between h-full'>
        <div>
          <SelectTilesTexture
            handleTextureStyleChange={handleTextureStyleChange}
          />
          <HeightsScaleRange
            model={model}
            recreatedModel={recreatedModel}
            heightCoefficientRangeValue={heightCoefficientRangeValue}
            setHeightCoefficientRangeValue={setHeightCoefficientRangeValue}
          />
          <TrailUploader
            gpxTrailName={gpxTrailName}
            handleDeleteTrail={handleDeleteTrail}
            fileChangeHandler={fileChangeHandler}
          />
          <NewPinPanel
            newPointOptions={newPointOptions}
            setNewPointOptions={setNewPointOptions}
            toggleImportPOIsPopup={toggleImportPOIsPopup}
          />
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
        </div>
        <div className='flex justify-center items-center gap-6'>
          <button onClick={handleCancel} className='secondary-button'>
            Back
          </button>
          <button onClick={handleSubmit} className='primary-button'>
            Save
          </button>
        </div>
      </div>
    </Toolbar>
  )
}

export default ModelToolbar
