import React, { Dispatch, SetStateAction } from 'react';

export interface Children {
    children: React.ReactNode;
}

export interface IMapConfig {
    animateTrail: boolean;
    enableShadow: boolean;
    enableSun: boolean;
}

export default interface IContextProvider {
    config: IMapConfig,
    setConfig: Dispatch<SetStateAction<IMapConfig>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}