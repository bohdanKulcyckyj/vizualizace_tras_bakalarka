import { axiosWithAuth } from "../utils/axiosWithAuth"
import { toast } from "sonner"
// api routes
import apiEndpoints from "../constants/apiEndpoints"
// interfaces
import { IMapDTO } from "../interfaces/dashboard/MapModel"

export const getUserMaps = async (): Promise<IMapDTO[]> => {
    try {
      const res = await axiosWithAuth.get(apiEndpoints.getUserMaps)
      const formattedData = res.data.map((_row) => {
        if (Object.hasOwn(_row, 'createdAt')) {
          const tmpCreatedAt = new Date(_row.createdAt).toLocaleDateString()
          return {
            ..._row,
            createdAt: tmpCreatedAt,
          }
        }
        return _row
      })
      return (formattedData as IMapDTO[])
    } catch (e) {
      toast.error('Unable to fetch maps data')
    }
}

export const deleteUserMap = async (url: string): Promise<void> => {
  try {
    await axiosWithAuth.delete(url)
  } catch(e) {
    toast.error('Failed to delete map')
  }
} 