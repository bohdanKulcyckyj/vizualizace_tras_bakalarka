import TerrainModelComponent from '../components/mapModel/TerrainModel'

const MapModel = ({ mode }) => {
  return (
    <div
      className="map-model"
    >
      <TerrainModelComponent mode={mode} />
    </div>
  )
}

export default MapModel
