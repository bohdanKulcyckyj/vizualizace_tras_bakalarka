import React, { createContext, useContext, useState } from 'react';
import IContextProvider, { Children } from '../interfaces/ContextProvider';
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
 
  return (
    <MainContext.Provider value={{ config, setConfig, isLoading, setIsLoading }}>
      {children}
    </MainContext.Provider>
  );
};
