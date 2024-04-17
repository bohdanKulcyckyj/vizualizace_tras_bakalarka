import { createContext, useContext, useState } from "react";
import IModelContextProvider from "../interfaces/context/ModelContextProvider";
import { Children } from "../interfaces/context/MainContextProvider";
import { Model } from "../terainModel/model";
import { IMapDTO } from "../interfaces/dashboard/MapModel";

const ModelContext = createContext<IModelContextProvider>(null)

export const useModelContext = () => {
    return useContext(ModelContext)
}

export const ModelProvider = ({ children }: Children) => {
    const [model, setModel] = useState<Model>(null)
    const [projectSettings, setProjectSettings] = useState<IMapDTO>(null)
    const [trailName, setTrailName] = useState<string>('')

    return (
        <ModelContext.Provider value={{
            model,
            setModel,
            projectSettings,
            setProjectSettings,
            trailName,
            setTrailName
        }}>
            {children}
        </ModelContext.Provider>
    )
}