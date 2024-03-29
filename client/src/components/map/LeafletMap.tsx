import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import L, { LatLng, LatLngBounds, LatLngExpression } from 'leaflet'
import { AreaSelect } from '../../utils/leaflet'
import Toolbar from '../toolbar/Toolbar'
import { useSearchBoxCore } from '@mapbox/search-js-react'
import apiEndpoints from '../../constants/apiEndpoints'
import routes from '../../constants/routes'
import { useMainContext } from '../../context/MainContext'
import { IMapDTO } from '../../interfaces/dashboard/MapModel'
import { axiosWithAuth } from '../../utils/axiosWithAuth'
import { toast } from 'sonner'

const LeafletMap = ({ projectId }) => {
  const { loggedUser } = useMainContext()
  const navigate = useNavigate()
  const [map, setMap] = useState(null)
  const [areaSelect, setAreaSelect] = useState(null)
  const [inputNameValue, setInputNameValue] = useState<string>('New Map')
  const [inputAddress, setInputAddress] = useState<string>('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([51.505, -0.09])
  const [mapZoom, setMapZoom] = useState<number>(13)
  const [editingRecord, setEditingRecord] = useState<IMapDTO>(null)
  const searchBoxCore = useSearchBoxCore({
    accessToken: process.env.REACT_APP_MAP_BOX_TOKEN,
  })
  const currentSessionToken = 'test-123'

  const checkForProjectColision = () => {
    console.log('is happening')
    const bounds = areaSelect.getBounds()
    const northEast = bounds.getNorthEast()
    const southWest = bounds.getSouthWest()
    const { mapModel } = editingRecord
    const isColiding =
      northEast.lat <= mapModel.bbox.southWest.lat ||
      southWest.lat >= mapModel.bbox.northEast.lat ||
      northEast.lng <= mapModel.bbox.southWest.lng ||
      southWest.lng >= mapModel.bbox.northEast.lng

    if (isColiding) {
      const correctedEditingRecord = editingRecord
      correctedEditingRecord.mapModel.mapObjects = []
      setEditingRecord(correctedEditingRecord)

      toast(
        <div className='confirm-dialog'>
          <div className='p-6 flex flex-col justify-center items-center'>
            <h2 className='confirm-dialog__title'>
              Your project has completly different borders now. You may lose
              yours points of interest. Proceed?
            </h2>
            <div className='flex justify-center gap-4 mt-5'>
              <button
                className='confirm-dialog__button confirm-dialog__button--primary'
                onClick={() => {
                  confirm()
                  toast.dismiss()
                }}
              >
                yes
              </button>
              <button
                className='confirm-dialog__button confirm-dialog__button--secondary'
                onClick={() => toast.dismiss()}
              >
                no
              </button>
            </div>
          </div>
        </div>,
        { position: 'bottom-center', unstyled: true, duration: 10000 },
      )
    } else {
      confirm()
    }
  }

  const confirm = () => {
    const bounds = areaSelect.getBounds()
    const dist = bounds.getNorthEast().distanceTo(bounds.getSouthWest())

    if (dist > 20000 * 2) {
      return
    }

    const newMap: IMapDTO = {
      mapModel: {
        center: {
          lat: (bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2,
          lng: (bounds.getNorthEast().lng + bounds.getSouthWest().lng) / 2,
          alt: 4791.7,
        },
        bbox: {
          northEast: bounds.getNorthEast(),
          southWest: bounds.getSouthWest(),
        },
        trailGpxUrl: editingRecord ? editingRecord.mapModel.trailGpxUrl : null,
        zoom: mapZoom,
        mapObjects: editingRecord ? editingRecord.mapModel.mapObjects : [],
        heightCoefficient: editingRecord
          ? editingRecord.mapModel.heightCoefficient
          : null,
      },
      name: inputNameValue,
    }

    if (projectId) {
      axiosWithAuth
        .post(apiEndpoints.editMap(projectId), newMap)
        .then((res) => {
          if (loggedUser?.role) {
            navigate(
              routes.dashboard.editMapModel(loggedUser.role, projectId),
              { replace: true },
            )
          } else {
            navigate(-1)
          }
        })
        .catch((e) => console.error(e))
    } else {
      axiosWithAuth
        .post(apiEndpoints.newMap, newMap)
        .then((res) => {
          if (res.data && loggedUser?.role) {
            navigate(
              routes.dashboard.editMapModel(loggedUser.role, res.data.id),
              { replace: true },
            )
          } else {
            navigate(-1)
          }
        })
        .catch((e) => console.error(e))
    }
  }

  const cancel = () => {
    navigate(-1)
  }

  const handleRetrieveLocation = async (suggestion) => {
    const response = await searchBoxCore.retrieve(suggestion, {
      sessionToken: currentSessionToken,
    })
    //@ts-ignore
    setMapCenter(response.features[0].geometry.coordinates.reverse())
    setSuggestions([])
  }

  useEffect(() => {
    const leafletMap = L.map('map').setView(mapCenter, mapZoom)
    leafletMap.on('zoomend', () => {
      setMapZoom(leafletMap.getZoom())
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap)

    // Create and add AreaSelect
    const areaSelectInstance = new AreaSelect()
    areaSelectInstance.initialize({
      width: 200,
      height: 300,
      minWidth: 40,
      minHeight: 40,
      minHorizontalSpacing: 40,
      minVerticalSpacing: 100,
    })
    areaSelectInstance.addTo(leafletMap)

    if (projectId) {
      axiosWithAuth
        .get(apiEndpoints.getMapDetail(projectId))
        .then((res) => {
          if (res.data.map) {
            const mapData = res.data.map
            setEditingRecord(mapData)
            leafletMap.setView(
              new LatLng(
                mapData.mapModel.center.lat,
                mapData.mapModel.center.lng,
              ),
              mapData.mapModel.zoom,
            )
            setInputNameValue(mapData.name)
            areaSelectInstance.setBounds(
              new L.LatLngBounds(
                mapData.mapModel.bbox.southWest,
                mapData.mapModel.bbox.northEast,
              ),
            )
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setMap(leafletMap)
          setAreaSelect(areaSelectInstance)
        })
    } else {
      setMap(leafletMap)
      setAreaSelect(areaSelectInstance)
    }

    return () => {
      leafletMap.remove()
    }
  }, [])

  useEffect(() => {
    if (map && areaSelect) {
      let leafletMap = map
      let leafletAreaSelect = areaSelect
      leafletMap.setView(mapCenter, 13)
      leafletAreaSelect.setBounds(
        new LatLngBounds(
          [mapCenter[0] + 0.202, mapCenter[1] + 0.582],
          [mapCenter[0] - 0.202, mapCenter[1] - 0.582],
        ),
      )
      setMap(leafletMap)
      setAreaSelect(leafletAreaSelect)
    }
  }, [mapCenter])

  useEffect(() => {
    const getSuggestions = async () => {
      const response = await searchBoxCore.suggest(inputAddress, {
        sessionToken: currentSessionToken,
      })
      console.log(response)
      setSuggestions(response.suggestions)
    }
    if (inputAddress) {
      getSuggestions()
    }
  }, [inputAddress])

  return (
    <div className='leaflet-map__container'>
      <Toolbar>
        <div className='form flex flex-col justify-between h-full'>
          <div>
            <div className='form__input flex flex-col mb-2'>
              <label htmlFor='mapName'>Map name:</label>
              <input
                className='text-black'
                name='mapName'
                value={inputNameValue}
                onChange={(e) => setInputNameValue(e.target.value)}
              />
            </div>
          </div>
          <div className='flex justify-center items-center gap-6'>
            <button
              onClick={projectId ? checkForProjectColision : confirm}
              className='primary-button'
            >
              Save
            </button>
            <button onClick={cancel} className='secondary-button'>
              Back
            </button>
          </div>
        </div>
      </Toolbar>

      {/* Search location */}
      <div className='form absolute top-15 right-5 z-[1000]'>
        <div className='form__input searchbox__select flex flex-col mb-2'>
          <label htmlFor='location'>Location:</label>
          <input
            className='text-black'
            name='location'
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <div className='searchbox__options'>
            {suggestions
              .filter((_data) => _data.full_address)
              .map((_data, _index) => (
                <div
                  onClick={() => handleRetrieveLocation(_data)}
                  key={_index}
                  className='searchbox__option'
                >
                  {_data.full_address}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div id='map' className='leaflet-map__map'></div>
    </div>
  )
}

export default LeafletMap
