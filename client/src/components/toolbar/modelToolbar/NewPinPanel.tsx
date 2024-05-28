import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IconContext } from 'react-icons'
import { FaMapMarkerAlt, FaImage } from 'react-icons/fa'
import { SlDirection } from 'react-icons/sl'
// components
import { toast } from 'sonner'

// interface
import { PIN_COLORS } from '../../../interfaces/dashboard/MapModel'

// enums
import { PIN_TYPE } from '../../../interfaces/dashboard/MapModel'

// utils
import { getPinTitle } from '../../../utils/pins'

const NewPinPanel = ({ newPointOptions, setNewPointOptions, toggleImportPOIsPopup }) => {
  return (
    <>
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
      {/* IMPORT NEARBY FEATURES */}
      <div className='flex justify-end mt-4 mb-2'>
        <button
          className='secondary-button secondary-button--small'
          onClick={toggleImportPOIsPopup}
        >
          Import POI
        </button>
      </div>
    </>
  )
}

export default NewPinPanel
