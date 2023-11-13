import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Toolbar from "./Toolbar";

const LeafletMap = () => {

  const toolbarContent = () => (
    <div className="hidden">
      <label htmlFor="mapName"></label>
      <input name="mapName" placeholder="map name" />
      <button className="primary-button">Save</button>
    </div>
  )

  return (
    <div className="flex mt-20">
    <Toolbar children={toolbarContent()} />
    <div id="map" className="h-[800px] w-full">
      <MapContainer center={[51.505, -0.09]} zoom={5} scrollWheelZoom={true} style={{height: "100vh", width: "100%"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
    </div>
  );
};

export default LeafletMap;
