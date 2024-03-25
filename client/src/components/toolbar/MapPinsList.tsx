import { FC } from 'react'

// icons
import { FaMapMarkerAlt, FaImage } from 'react-icons/fa'
import { SlDirection } from 'react-icons/sl'
import { IconContext } from 'react-icons'

// interface
import {
  IMapObjectOptions,
  PIN_TYPE,
} from '../../interfaces/dashboard/MapModel'

const MapPinsList: FC<{
  data: IMapObjectOptions[]
  onPinSelect: (pin: IMapObjectOptions) => void
}> = ({ data, onPinSelect }) => {
  const insertPinIcon = (_pin: IMapObjectOptions) => {
    if (_pin.pinType === PIN_TYPE.PIN_LABEL) {
      return (
        <IconContext.Provider
          value={{
            color: 'white',
            size: '20px',
            className: 'pin-icon',
          }}
        >
          <span>
            <SlDirection />
          </span>
        </IconContext.Provider>
      )
    }
    if (_pin.pinType === PIN_TYPE.PIN_IMAGE) {
      return (
        <IconContext.Provider
          value={{
            color: 'white',
            size: '20px',
            className: 'pin-icon',
          }}
        >
          <span>
            <FaImage />
          </span>
        </IconContext.Provider>
      )
    }
    if (_pin.pinType === PIN_TYPE.PIN_SIGN) {
      return (
        <IconContext.Provider
          value={{
            color: `${_pin.color}`,
            size: '20px',
            className: 'pin-icon',
          }}
        >
          <span>
            <FaMapMarkerAlt />
          </span>
        </IconContext.Provider>
      )
    }
  }

  return (
    <div className='map-pins-list'>
      {data.map((_pin: IMapObjectOptions, _index: number) => (
        <div
          className='map-pins-list__item'
          key={_index}
          onClick={() => onPinSelect(_pin)}
        >
          <div className='map-pins-list__item__icon'>{insertPinIcon(_pin)}</div>
          <div className='map-pins-list__item__label overflow-hidden flex justify-start items-center'>
            <p className='truncate'>{_pin.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MapPinsList
