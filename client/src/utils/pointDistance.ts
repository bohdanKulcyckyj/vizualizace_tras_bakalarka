import { Vector3 } from "three";
import { IMapObjectOptions } from "../interfaces/dashboard/MapModel";

export interface ITrailStop {
    stopPoint: Vector3,
    object: IMapObjectOptions
}

export const getClosestDistancePoint = (trailPoints: Vector3[], pinPoint: Vector3) : Vector3 => {
    let closestPoint = trailPoints[0];
    let closestDistance = Math.sqrt(Math.pow(trailPoints[0].x - pinPoint.x, 2) + Math.pow(trailPoints[0].y - pinPoint.y, 2));

    for (const point of trailPoints) {
        const distance = Math.sqrt(Math.pow(point.x - pinPoint.x, 2) + Math.pow(point.y - pinPoint.y, 2));
        if (distance < closestDistance) {
            closestPoint = point;
            closestDistance = distance;
        }
    }

    return closestPoint
}

export const getAllTrailStops = (trailPoints: Vector3[], mapObjects: IMapObjectOptions[]): ITrailStop[] => {
    const result: ITrailStop[] = []
    for(const obj of mapObjects) {
        const objPoint = new Vector3(obj.x, obj.y, obj.z)
        const tmpPoint = getClosestDistancePoint(trailPoints, objPoint)
        result.push({
            stopPoint: tmpPoint,
            object: obj
        })
    }

    return result;
}

export const isStopPoint = (point: Vector3, trailStops: ITrailStop[]): IMapObjectOptions | null => {
    let result = null

    for(const trailStop of trailStops) {
        if(point.x >= trailStop.stopPoint.x && point.y >= trailStop.stopPoint.y) {
            result = trailStop.object
            break;
        }
    }

    return result
}