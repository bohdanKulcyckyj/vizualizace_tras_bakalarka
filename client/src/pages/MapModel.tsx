import TerrainModelComponent from '../components/mapModel/TerrainModel'
import { ComponentMode } from '../interfaces/dashboard/ComponentProps'

const MapModel = ({ mode }) => {
  return (
    <div className={`map-model ${mode !== ComponentMode.PREVEIW ? 'offset-from-nav' : ''}`}>
      <TerrainModelComponent mode={mode} />
    </div>
  )
}

export default MapModel