import { INearbyPointType } from '../interfaces/NearbyPoint'
import { IBbox, IMapPointDTO } from '../interfaces/dashboard/MapModel'

export const getNearbyPointsFromAPI = async (
  featuresOptions: INearbyPointType[],
  bbox: IBbox,
): Promise<IMapPointDTO[]> => {
  const minLat = bbox.southWest.lat
  const minLon = bbox.southWest.lng
  const maxLat = bbox.northEast.lat
  const maxLon = bbox.northEast.lng
  const bboxStr = `${minLat},${minLon},${maxLat},${maxLon}`

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body:
        'data=' +
        encodeURIComponent(`
           [bbox: ${bboxStr}]
           [out:json]
           [timeout:90]
           ;
           (
             ${featuresOptions
               .map((_option) => {
                 return `node["${_option.node}"="${_option.value}"](${bboxStr});`
               })
               .join('\n')}
           );
           out geom;
         `),
    })

    if (!res.ok) {
      throw new Error(
        `Error in fetching features: ${featuresOptions.map((_opt) => _opt.label).join()} - ${res.status} ${res.statusText}`,
      )
    }

    const resData = await res.json()
    //this.displayNearFeatures(resData.elements)
    return resData.elements as IMapPointDTO[]
  } catch (err) {
    console.error(
      `Error in fetching features: ${featuresOptions.map((_opt) => _opt.label).join()}`,
      err,
    )
    return [] as IMapPointDTO[]
  }
}
