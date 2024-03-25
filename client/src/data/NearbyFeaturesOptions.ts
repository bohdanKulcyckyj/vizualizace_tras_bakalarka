import { INearbyFeature } from '../interfaces/NearbyFeatures'

export const featureOptions: INearbyFeature[] = [
  {
    label: 'Peaks',
    node: 'natural',
    value: 'peak',
  },
  {
    label: 'Castles',
    node: 'historic',
    value: 'castle',
  },
  {
    label: 'Monuments',
    node: 'tourism',
    value: 'monument',
  },
  {
    label: 'Alpine Huts',
    node: 'tourism',
    value: 'alpine_hut',
  },
  {
    label: 'Viewpoints',
    node: 'tourism',
    value: 'viewpoint',
  },
  {
    label: 'Towers',
    node: 'man_made',
    value: 'tower',
  },
  {
    label: 'Dams',
    node: 'waterway',
    value: 'dam',
  },
  {
    label: 'Reservoirs',
    node: 'water',
    value: 'reservoir',
  },
]
