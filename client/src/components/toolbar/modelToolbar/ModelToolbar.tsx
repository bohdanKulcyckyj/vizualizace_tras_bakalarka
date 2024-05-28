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
import { Link, useNavigate } from 'react-router-dom'
import { useModelContext } from '../../../context/ModelContext'
import { useMainContext } from '../../../context/MainContext'
import routes from '../../../constants/routes'
import AccordionItem from '../../AccordionItem'
import { useState } from 'react'
import TrailColor from './TrailColor'
import LightPositioning from './LightPositioning'
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
  const [openedAccordionId, setOpenedAccordionId] = useState(2)
  const navigate = useNavigate()
  const { model, projectSettings } = useModelContext()
  const { loggedUser } = useMainContext()

  const handleOpenAccordion = (id: number) =>
    setOpenedAccordionId((state) => (state === id ? -1 : id))

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
          <h3 className='mb-8 uppercase text-center text-24px font-medium'>
            Model settings
          </h3>
          <AccordionItem
            identifier={1}
            title='Trail'
            openedIdenfier={openedAccordionId}
            onOpenIdenfier={handleOpenAccordion}
          >
            <TrailUploader handleDeleteTrail={handleDeleteTrail} />
            <TrailColor />
          </AccordionItem>
          <AccordionItem
            identifier={2}
            title='Points'
            openedIdenfier={openedAccordionId}
            onOpenIdenfier={handleOpenAccordion}
          >
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
          </AccordionItem>
          <AccordionItem
            identifier={3}
            title='Lights'
            openedIdenfier={openedAccordionId}
            onOpenIdenfier={handleOpenAccordion}
          >
            <LightPositioning />
          </AccordionItem>
          <AccordionItem
            identifier={4}
            title='Others'
            openedIdenfier={openedAccordionId}
            onOpenIdenfier={handleOpenAccordion}
          >
            <SelectTilesTexture
              handleTextureStyleChange={handleTextureStyleChange}
            />
            <HeightsScaleRange recreatedModel={recreatedModel} />
          </AccordionItem>
        </div>
        <div className='flex justify-center items-center gap-6'>
          <Link
            to={routes.dashboard.maps(loggedUser.role)}
            className='secondary-button'
          >
            Back
          </Link>
          <button onClick={handleSubmit} className='primary-button'>
            Save
          </button>
        </div>
      </div>
    </Toolbar>
  )
}

export default ModelToolbar
