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
import { useModelContext } from '../../../context/ModelContext'
// data
const ModelToolbar = ({
  setNewPointOptions,
  setIsPinPopupOpened,
  recreatedModel,
  newPointOptions,
  toggleImportPOIsPopup,
  handleTextureStyleChange,
  handleDeleteTrail,
}) => {
  const navigate = useNavigate()
  const { model, projectSettings } = useModelContext()

  const handleCancel = (): void => {
    navigate(-1)
  }

  const handleSubmit = (): void => {
    const newMapConfiguration = {
      ...projectSettings,
      mapModel: model.options,
    }

    axiosWithAuth
      .post(apiEndpoints.editMap(projectSettings.id), newMapConfiguration)
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
            recreatedModel={recreatedModel}
          />
          <TrailUploader
            handleDeleteTrail={handleDeleteTrail}
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
                  console.log(pin)
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
