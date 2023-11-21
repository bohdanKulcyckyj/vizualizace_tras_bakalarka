import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AreaSelect } from '../../utils/leaflet';

const LeafletMap = () => {
  const [map, setMap] = useState(null);
  const [areaSelect, setAreaSelect] = useState(null);
  const [projectId, setProjectId] = useState(null);

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

    setMap(leafletMap);
    setAreaSelect(areaSelectInstance);

    // Clean up function
    return () => {
      leafletMap.remove();
    };
  }, []); // Empty dependency array to run the effect only once on mount

  useEffect(() => {
    // Fetch project data and update the map and AreaSelect
    // (Note: You may need to use async/await if your service methods are asynchronous)
    const fetchData = async () => {
      const response = {
        center: {
          lat: 45.83256987294795,
          lng: 6.865163189418157,
          alt: 4791.7,
        },
        bbox: {
          northEast: {
              lat: 45.9179008,
              lng: 6.9354122
          },
          southWest: {
              lat: 45.7724925,
              lng: 6.7421217,
          },
        },
        zoom: 13,
        trailGpxUrl: "./assets/export2.gpx",
      };
      const { center, bbox } = response;

      map.panTo(center);

      if (bbox) {
        areaSelect.setBounds(new L.LatLngBounds(bbox.southWest, bbox.northEast));
      }
    };

    if (projectId !== null) {
      fetchData();
    }
  }, [projectId, map, areaSelect]); // Dependencies include projectId, map, and areaSelect

  const confirm = () => {
    const bounds = areaSelect.getBounds();
    console.log(bounds);

    const dist = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
    console.log('dist:', dist);

    if (dist > 20000 * 2) {
      // Display a snackbar or any other notification
      return;
    }

    //projectService.setBBox(projectId, {
    //  northEast: bounds.getNorthEast(),
    //  southWest: bounds.getSouthWest()
    //}).then(() => {
    // Navigate to the desired route
    // (Note: You may need to use useHistory hook or any other routing method)
    //});
  };

  const cancel = () => {
    // Navigate to the desired route
    // (Note: You may need to use useHistory hook or any other routing method)
  };

  return (
    <>
      <div id="map" style={{ height: 'calc(100vh - 64px)' }}></div>
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
