import React, { Dispatch, SetStateAction } from 'react'
import {
  IMapObjectOptions,
  PIN_TYPE,
} from '../../interfaces/dashboard/MapModel'

const PinPreviewPopup: React.FC<{
  formState: IMapObjectOptions
  setImageIndex: Dispatch<SetStateAction<number>>
}> = ({ formState, setImageIndex }) => {
  return (
    <div>
      <div className='form'>
        <div className='mb-6'>
          {formState?.label && (
            <div className='mb-8'>
              <h2 className='text-center text-[24px] md:text-[30px]'>
                {formState.label}
              </h2>
            </div>
          )}
          {formState.pinType === PIN_TYPE.PIN_IMAGE && (
            <div className='mt-6'>
              {formState?.images?.length > 0 && (
                <div className='grid grid-cols-4 gap-2 mb-2'>
                  {formState.images.map((_image, _index) => (
                    <div
                      className='cursor-pointer'
                      key={_index}
                      onClick={() => setImageIndex(_index)}
                    >
                      <img
                        className='w-full h-full object-cover'
                        src={_image}
                        alt='WanderMap3D - new pin'
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PinPreviewPopup
