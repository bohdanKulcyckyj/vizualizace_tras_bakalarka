import React from 'react'
import { useParams } from 'react-router-dom'
import LeafletMap from '../components/map/LeafletMap'

const MapDetail = ({ mode }) => {
  const { mapid } = useParams()
  return (
    <div>
      <LeafletMap projectId={mapid ?? null} />
    </div>
  )
}

export default MapDetail
