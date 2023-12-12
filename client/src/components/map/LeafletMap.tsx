import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { AreaSelect } from '../../utils/leaflet';
import { MAP_DETAIL, MAP_EDIT, MAP_NEW } from '../../api/endpoints';

const LeafletMap = ({ projectId }) => {
  const navigate = useNavigate()
  const [map, setMap] = useState(null);
  const [areaSelect, setAreaSelect] = useState(null)

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
      .then(res => navigate("/map/" + projectId, { replace: true}))
      .catch(e => window.alert("Failed to edit map"))
    } else {
      axios.post(MAP_NEW, newMap, requestConfig)
      .then(res => {
        if(res.data) {
          navigate("/map/" + res.data.id, { replace: true})
        }
      })
      .catch(e => window.alert("Failed to edit map"))
    }
  };

  const cancel = () => {
    navigate(-1)
  };

  return (
    <>
      <div className='flex'>
        
        <div id="map" style={{ height: 'calc(100vh - 64px)' }}></div>
      </div>
      <div className="btns-wrapper">
        <div className="btn-wrapper">
          <button onClick={cancel} className="mat-fab" style={{ backgroundColor: 'accent' }}>
            <span>Close</span>
          </button>
        </div>
        <div className="btn-wrapper">
          <button onClick={confirm} className="mat-fab" style={{ backgroundColor: 'primary' }}>
            <span>Done</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default LeafletMap;
