import React from 'react'
import TerrainModelComponent from '../terainModel/TerrainModelComponent'

const MapModel = ({type}) => {
  return (
    <div className={`map-model ${type !== "preview" ? 'offset-from-nav' : ''}`}>
      <TerrainModelComponent type={type} />
    </div>
  )
}

export default MapModel