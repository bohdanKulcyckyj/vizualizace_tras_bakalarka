import { pointsOptions } from '../data/NearbyPointsOptions'
import { INearbyPointTypeGroup } from '../interfaces/NearbyPoint'
import { IMapPointDTO } from '../interfaces/dashboard/MapModel'

export function MapPointTypeDefaultValue(
  points: IMapPointDTO[],
): IMapPointDTO[] {
  points.forEach((point) => {
    if (point.tags?.name) {
      if (point.tags?.natural === 'peak') {
        point.tags.name += ` - ${point.tags.ele} m`
      }
    } else {
      for (const _pointOpt of pointsOptions) {
        if (Object.hasOwn(point.tags, _pointOpt.node)) {
          const [firstLetter, ...rest] = _pointOpt.value
          const defaultName = [firstLetter.toUpperCase(), ...rest]
            .join('')
            .replaceAll('_', ' ')
          point.tags.name =
            point.tags?.natural === 'peak'
              ? `${defaultName} - ${point.tags.ele} m`
              : defaultName
          break
        }
      }
    }
  })

  return points
}

export function mappingPointsToSelectOptionsGroups(
  points: IMapPointDTO[],
  excludedPointsIds: string[] = [],
): INearbyPointTypeGroup[] {
  const pointGroups: INearbyPointTypeGroup[] = []

  points.forEach((point) => {
    if (excludedPointsIds.includes(point.id.toString())) return

    for (const _pointOpt of pointsOptions) {
      if (Object.hasOwn(point.tags, _pointOpt.node)) {
        const indexOfGroup = pointGroups.findIndex(
          (_group) => _group.label === _pointOpt.label,
        )
        const newOption = {
          label: point.tags.name,
          value: point,
        }
        if (indexOfGroup === -1) {
          pointGroups.push({
            label: _pointOpt.label,
            options: [newOption],
          })
        } else {
          pointGroups[indexOfGroup].options.push(newOption)
        }
        break
      }
    }
  })

  return pointGroups
}
