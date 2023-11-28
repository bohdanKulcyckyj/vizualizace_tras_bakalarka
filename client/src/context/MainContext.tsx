import React, { createContext, useContext, useState } from 'react';
import IContextProvider, { Children } from '../interfaces/IContextProvider';
import { IModelOptions } from '../terainModel/model';

const MainContext = createContext<IContextProvider>(null);;

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainProvider = ({ children } : Children) => {
  const [config, setConfig] = useState({
    animateTrail: false,
    enableShadow: false,
    enableSun: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mapData, setMapData] = useState<IModelOptions>({
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
  })

  return (
    <MainContext.Provider value={{ config, setConfig, isLoading, setIsLoading, mapData, setMapData }}>
      {children}
    </MainContext.Provider>
  );
};
