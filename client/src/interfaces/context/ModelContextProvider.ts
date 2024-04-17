import { Dispatch, SetStateAction } from 'react'
import { Model } from '../../terainModel/model'
import { IMapDTO } from '../dashboard/MapModel'

export interface IModelContextProvider {
  model: Model
  setModel: Dispatch<SetStateAction<Model>>
  projectSettings: IMapDTO
  setProjectSettings: Dispatch<SetStateAction<IMapDTO>>
  trailName: string
  setTrailName: Dispatch<SetStateAction<string>>
}

export default IModelContextProvider
