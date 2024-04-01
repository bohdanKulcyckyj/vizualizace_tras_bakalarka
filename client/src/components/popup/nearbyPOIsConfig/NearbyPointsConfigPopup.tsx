import { FC, useState } from 'react'

// interfaces
import {
  IMapModelConfig,
  IMapObjectOptions,
  IMapPointDTO,
} from '../../../interfaces/dashboard/MapModel'
import { INearbyPointType } from '../../../interfaces/NearbyPoint'

// components
import NearbyPointsStepFirst from './NearbyPointsStepFirst'
import NearbyPointsStepSecond from './NearbyPointsStepSecond'

// utils
import { getNearbyPointsFromAPI } from '../../../utils/openstreetApi'
import { MapPointTypeDefaultValue } from '../../../utils/mappingPOIs'

const NearbyPointsConfigPopup: FC<{
  modelConfig: IMapModelConfig
  onSubmit: (points: IMapPointDTO[]) => void
}> = ({ modelConfig, onSubmit }) => {
  const [selectedPointCategories, setSelectedPointCategories] = useState<
    INearbyPointType[]
  >([])
  const [fetchedPoints, setFetchedPoints] = useState<IMapPointDTO[]>([])
  const [selectedPoints, setSelectedPoints] = useState<IMapPointDTO[]>([])
  const [currentStep, setCurrentStep] = useState<number>(1)
  const finalStep = 2

  const PopupStepper = () => {
    switch (currentStep) {
      case 1:
        return (
          <NearbyPointsStepFirst
            selectedOptions={selectedPointCategories}
            setSelectedOptions={setSelectedPointCategories}
          />
        )
      case 2:
        return (
          <NearbyPointsStepSecond
            data={fetchedPoints}
            selectedOptions={selectedPoints}
            setSelectedOptions={setSelectedPoints}
            excludedPointsIds={modelConfig.mapObjects.map((_item: IMapObjectOptions) => _item.id)}
          />
        )
      default:
        return (
          <NearbyPointsStepFirst
            selectedOptions={selectedPointCategories}
            setSelectedOptions={setSelectedPointCategories}
          />
        )
    }
  }

  const handleNext = async () => {
    const nextStep = currentStep + 1

    if (nextStep === finalStep) {
      // call to openstreet api
      const pointsFromApi = await getNearbyPointsFromAPI(
        selectedPointCategories,
        modelConfig.bbox,
      )
      setFetchedPoints(MapPointTypeDefaultValue(pointsFromApi))
    }
    setCurrentStep(nextStep)
  }

  return (
    <div>
      <div className='form'>
        <div className='mb-6'>
          <h2 className='text-center text-[24px] md:text-[30px] mb-8'>
            Select POI for import
          </h2>
          <PopupStepper />
          <div className='flex justify-center mt-10 gap-6'>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className='secondary-button'
              >
                Back
              </button>
            )}
            {currentStep !== finalStep && (
              <button onClick={handleNext} className='secondary-button'>
                Next
              </button>
            )}
            {currentStep === finalStep && (
              <button className='primary-button' onClick={() => onSubmit(selectedPoints)}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NearbyPointsConfigPopup
