import React from 'react'
// data
import { textureTiles } from '../../../data/TextureTypes'

const SelectTilesTexture = ({ handleTextureStyleChange }) => {
  return (
    <>
      <p className='mb-2'>Texture style</p>
      <div className='grid grid-cols-4 gap-2 mb-6'>
        {textureTiles.map((_item, _index) => (
          <div
            className='h-[60px] cursor-pointer'
            title={_item.label}
            key={_index}
            onClick={() => handleTextureStyleChange(_item.label)}
          >
            <img
              className='w-full h-full object-cover'
              src={_item.image}
              alt={`Texture style - ${_item.label}`}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default SelectTilesTexture
