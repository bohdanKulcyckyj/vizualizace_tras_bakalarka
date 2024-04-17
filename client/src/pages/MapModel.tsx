import TerrainModelComponent from '../components/mapModel/TerrainModel'
import { ModelProvider } from '../context/ModelContext'

const MapModel = ({ mode }) => {
  return (
    <div className='map-model'>
      <ModelProvider>
        <TerrainModelComponent mode={mode} />
      </ModelProvider>
    </div>
  )
}

export default MapModel
