import React, { createContext, useContext, useState } from 'react';
import IConfigProvider from '../interfaces/IConfigProvider';

const ConfigContext = createContext({});

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children } : any) => {
  const [config, setConfig] = useState({
    animateTrail: false,
    enableShadow: false,
    enableSun: true,
  });

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
