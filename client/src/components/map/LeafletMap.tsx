import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Pane, ZoomControl, Marker, Rectangle } from "react-leaflet";
import Toolbar from "../toolbar/Toolbar";
import L from 'leaflet';

const LeafletMap = () => {
  const mapRef = useRef(null);
  const rectangleRef = useRef(null);
  let rectangle = null;

  const onRectangleChange = (data) => console.log(data);

  const handleRectangleChange = () => {
    const bounds = rectangle.getBounds();
    onRectangleChange({
      center: bounds.getCenter(),
      bbox: {
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest(),
      },
      zoom: mapRef.current.getZoom(),
    });
  };

  const handleMarkerDrag = (event, marker) => {
    const { target } = event;
    const latlng = target.getLatLng();
    const bounds = rectangle.getBounds();
    console.log(latlng, bounds);

    if (marker === "ne") {
      bounds._northEast.lat = latlng.lat;
      bounds._northEast.lng = latlng.lng;
    } else if (marker === "sw") {
      bounds._southWest.lat = latlng.lat;
      bounds._southWest.lng = latlng.lng;
    } else if (marker === "nw") {
      bounds._northWest.lat = latlng.lat;
      bounds._northWest.lng = latlng.lng;
    } else if (marker === "se") {
      bounds._southEast.lat = latlng.lat;
      bounds._southEast.lng = latlng.lng;
    } else if (marker === "c") {
      bounds._center.lat = latlng.lat;
      bounds._center.lng = latlng.lng;
    }

    rectangle.setBounds(bounds);
    handleRectangleChange();
  };

  const toolbarContent = () => (
    <div className="hidden">
      <label htmlFor="mapName"></label>
      <input name="mapName" placeholder="map name" />
      <button className="primary-button">Save</button>
    </div>
  );

  useEffect(() => {
    if(rectangleRef.current) {
      rectangle = rectangleRef.current;
    }
  }, [])

  return (
    <div className="flex mt-20">
      <Toolbar children={toolbarContent()} />
      <MapContainer
        ref={mapRef}
        center={[51.505, -0.09]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[90vh] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Pane name="custom">
          <Rectangle ref={rectangleRef} bounds={[[54.559322, -5.767822], [56.1210604, -3.021240]]} />
          {rectangleRef.current && rectangle && 
          <>
          <Marker 
            position={rectangle.getBounds().getNorthWest()}
            draggable={true}
            icon={L.divIcon({className: 'leaflet-marker-icon'})}
            eventHandlers={{
              drag: (e) => handleMarkerDrag(e, "nw")
            }}
          />
          <Marker 
            position={rectangle.getBounds().getNorthEast()}
            draggable={true}
            icon={L.divIcon({className: 'leaflet-marker-icon'})}
            eventHandlers={{
              drag: (e) => handleMarkerDrag(e, "ne")
            }}
             />
          <Marker 
            position={rectangle.getBounds().getSouthWest()}
            draggable={true}
            icon={L.divIcon({className: 'leaflet-marker-icon'})}
            eventHandlers={{
              drag: (e) => handleMarkerDrag(e, "sw")
            }}
             />
          <Marker 
            position={rectangle.getBounds().getSouthEast()}
            draggable={true}
            icon={L.divIcon({className: 'leaflet-marker-icon'})}
            eventHandlers={{
              drag: (e) => handleMarkerDrag(e, "se")
            }}
             />
          <Marker 
            position={rectangle.getBounds().getCenter()}
            draggable={true}
            icon={L.divIcon({className: 'leaflet-marker-icon'})}
            eventHandlers={{
              drag: (e) => handleMarkerDrag(e, "c")
            }}
             />
            </>}
        </Pane>
        <ZoomControl position="bottomleft" />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
