import React from 'react'
import TerrainModelComponent from '../terainModel/TerrainModelComponent'
import Toolbar from '../components/toolbar/Toolbar'

const MapModel = ({type}) => {

    const toolbarContent = () => (
        <input  type="text" placeholder="gpx" />
    )

  return (
    <div className='map-model offset-from-nav'>
        {type === "edit" && <Toolbar children={toolbarContent()} />}
        <div className={`${type === "edit" ? "ml-[20px]" : ""}`}>
          <TerrainModelComponent />
        </div>
    </div>
  )
}

export default MapModel