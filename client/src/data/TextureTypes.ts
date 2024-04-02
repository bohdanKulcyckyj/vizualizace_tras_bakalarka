import { ITextureType } from '../interfaces/TextureType'

import SateliteImg from '../assets/images/textureStyles/mapbox-satellite-texture.png'
import OpenStreetMapImg from '../assets/images/textureStyles/open-street-map-texture.png'
import OpenCycleMapImg from '../assets/images/textureStyles/opencyclemap-texture.png'
import LandscapeImg from '../assets/images/textureStyles/landscape-texture.png'
import OutdoorsImg from '../assets/images/textureStyles/outdoors-texture.png'
import PioneerImg from '../assets/images/textureStyles/pioneer-texture.png'
import TransportDarkImg from '../assets/images/textureStyles/transport-dark-texture.png'

export const textureTiles: ITextureType[] = [
  {
    label: 'Satelite',
    image: SateliteImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://3dmap.janjanousek.cz/proxy/?url=v4/mapbox.satellite/${zoom}/${x}/${y}@2x.png?access_token=${process.env.REACT_APP_MAP_BOX_TOKEN}`
    },
  },
  {
    label: 'OpenCycleMap',
    image: OpenCycleMapImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://tile.thunderforest.com/cycle/${zoom}/${x}/${y}.png?apikey=${process.env.REACT_APP_THUNDERFOREST_API_KEY}`
    },
  },
  {
    label: 'Landscape',
    image: LandscapeImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://tile.thunderforest.com/landscape/${zoom}/${x}/${y}.png?apikey=${process.env.REACT_APP_THUNDERFOREST_API_KEY}`
    },
  },
  {
    label: 'OpenStreetMap',
    image: OpenStreetMapImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
    },
  },
  {
    label: 'Outdoors',
    image: OutdoorsImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://tile.thunderforest.com/outdoors/${zoom}/${x}/${y}.png?apikey=${process.env.REACT_APP_THUNDERFOREST_API_KEY}`
    },
  },
  {
    label: 'Pioneer',
    image: PioneerImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://tile.thunderforest.com/pioneer/${zoom}/${x}/${y}.png?apikey=${process.env.REACT_APP_THUNDERFOREST_API_KEY}`
    },
  },
  {
    label: 'Transport Dark',
    image: TransportDarkImg,
    url: (x: number, y: number, zoom: number): string => {
      return `https://tile.thunderforest.com/transport-dark/${zoom}/${x}/${y}.png?apikey=${process.env.REACT_APP_THUNDERFOREST_API_KEY}`
    },
  },
]
