import React from 'react'
import TerrainModelComponent from '../terainModel/TerrainModelComponent'
import { ComponentMode } from '../interfaces/dashboard/ComponentProps'

const MapModel = ({ mode }) => {
  return (
    <div className={`map-model ${mode !== ComponentMode.PREVEIW ? 'offset-from-nav' : ''}`}>
      <TerrainModelComponent mode={mode} />
    </div>
  )
}

export default MapModel