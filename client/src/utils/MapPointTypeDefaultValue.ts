import { MapPointDTO } from '../interfaces/dashboard/MapModel';

export function MapPointTypeDefaultValue(points: MapPointDTO[]): MapPointDTO[] {
  points.forEach((point) => {
    if (!point.tags.hasOwnProperty('name')) {
      switch (point.type) {
        case 'peak':
          point.tags['name'] = 'Peak';
          break;
        case 'castle':
          point.tags['name'] = 'Castle';
          break;
        case 'monument':
          point.tags['name'] = 'Monument';
          break;
        case 'alpine_hut':
          point.tags['name'] = 'Alpine Hut';
          break;
        case 'wilderness_hut':
          point.tags['name'] = 'Wilderness Hut';
          break;
        case 'dam':
          point.tags['name'] = 'Dam';
          break;
        case 'reservoir':
          point.tags['name'] = 'Reservoir';
          break;
        case 'watchtower':
          point.tags['name'] = 'Watchtower';
          break;
        case 'viewpoint':
          point.tags['name'] = 'Viewpoint';
          break;
        default:
          point.tags['name'] = '';
          break;
      }
    }
  });

  return points;
}
