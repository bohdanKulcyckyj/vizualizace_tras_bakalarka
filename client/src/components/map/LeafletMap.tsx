import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { AreaSelect } from '../../utils/leaflet';
import Toolbar from "../toolbar/Toolbar";
import { MAP_DETAIL, MAP_EDIT, MAP_NEW } from '../../api/endpoints';

const LeafletMap = ({ projectId }) => {
  const navigate = useNavigate()
  const [map, setMap] = useState(null)
  const [areaSelect, setAreaSelect] = useState(null)
  const [inputNameValue, setInputNameValue] = useState<string>("New Map")

  useEffect(() => {
    // Define your Leaflet map
    const leafletMap = L.map('map').setView([51.505, -0.09], 13);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(leafletMap);

    // Create and add AreaSelect
    const areaSelectInstance = new AreaSelect();
    areaSelectInstance.initialize({
      width: 200,
      height: 300,
      minWidth: 40,
      minHeight: 40,
      minHorizontalSpacing: 40,
      minVerticalSpacing: 100
    })
    areaSelectInstance.addTo(leafletMap);

    let token = getTokenFromCookie()
    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
    
    if(projectId) {
      axios.get(MAP_DETAIL + projectId, requestConfig)
      .then(res => {
        console.log(res)
        if(res.data) {
          console.log(res.data.mapModel)
          leafletMap.setView([res.data.mapModel.center.lat, res.data.mapModel.center.lng], res.data.mapModel.zoom)
          areaSelectInstance.setBounds(new L.LatLngBounds(res.data.mapModel.bbox.southWest, res.data.mapModel.bbox.northEast));
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setMap(leafletMap);
        setAreaSelect(areaSelectInstance);
      })
    } else {
      setMap(leafletMap);
      setAreaSelect(areaSelectInstance);
    }

    return () => {
      leafletMap.remove();
    };
  }, []);

  const confirm = () => {
    const bounds = areaSelect.getBounds();
    console.log(bounds);

    const dist = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
    console.log('dist:', dist);

    if (dist > 20000 * 2) {
      // Display a snackbar or any other notification
      return;
    }

    let token = getTokenFromCookie()
    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
    const newMap = {
      mapModel: {
        center: {
          lat: ((bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2) ,
          lng: ((bounds.getNorthEast().lng + bounds.getSouthWest().lng) / 2),
          alt: 4791.7,
        },
        bbox: {
          northEast: bounds.getNorthEast(),
          southWest: bounds.getSouthWest()
        }
      },
      name: "New map",
      trailGpxUrl: null
    }
    if(projectId) {
      axios.post(MAP_EDIT + projectId, newMap, requestConfig)
      .then(res => navigate("/map-model/" + projectId, { replace: true}))
      .catch(e => window.alert("Failed to edit map"))
    } else {
      axios.post(MAP_NEW, newMap, requestConfig)
      .then(res => {
        if(res.data) {
          navigate("/map-model/" + res.data.id, { replace: true})
        }
      })
      .catch(e => window.alert("Failed to edit map"))
    }
  };

  const cancel = () => {
    navigate(-1)
  };

  const toolbarContent = () => (
    <div className='flex flex-col justify-between h-full'>
      <div className='flex flex-col'>
        <label htmlFor="mapName">Map name:</label>
        <input
        className="text-black" 
        name="mapName" 
        value={inputNameValue}
        onChange={(e) => setInputNameValue(e.target.value)} />
      </div>
      <div className="flex justify-center items-center gap-6">
      <button onClick={confirm} className="primary-button">Save</button>
      <button onClick={cancel} className="secondary-button">Back</button>
      </div>
    </div>
  );

  return (
    <div className="leaflet-map__container">
      <Toolbar children={toolbarContent()} />
      <div id="map" className="leaflet-map__map"></div>
    </div>
  );
};

export default LeafletMap;
