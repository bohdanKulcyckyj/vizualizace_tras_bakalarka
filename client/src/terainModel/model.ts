//@ts-nocheck
import { getPosition as getSunPosition, getTimes } from 'suncalc'
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  OrthographicCamera,
  Spherical,
  Vector3,
  Quaternion,
  PlaneGeometry,
  TextureLoader,
  DoubleSide,
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Shape,
  ShapeGeometry,
  AmbientLight,
  DirectionalLight,
  MeshLambertMaterial,
  Raycaster,
  SphereGeometry,
  Group,
  LineBasicMaterial,
  Line,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  LinearFilter,
  ClampToEdgeWrapping,
  MathUtils,
  DirectionalLightHelper,
  PCFSoftShadowMap,
  LineCurve3,
  CurvePath,
  Clock,
  CubicBezierCurve3,
  Box3,
  MeshStandardMaterial,
  Color,
  Sphere,
  Vector4,
  Matrix4,
  Vector,
} from 'three'
import axios from 'axios'
import gsap from 'gsap'

import { AxisControl } from './AxisControl'
import { ElevationLoader } from './ElevationLoader'
import { fitCurve } from './FitCurves3D'
import { ILatLng, ILatLngAlt, IPoint, IPoint3D } from './interfaces'
import { Map } from './Map'
import { NorthArrowControl } from './NorthArrowControl'
import {
  lat2tile,
  lon2tile,
  tile2lat,
  tile2LatLong,
  tile2long,
} from './OsmUtils'
import { simplify3D } from './simplify'
import { Sky } from './Sky'
import CameraControls from 'camera-controls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  ITileTextureDecorator,
  TileTextureDecorator,
} from './TileTextureDecorator'
import {
  IMapModelConfig,
  IMapObjectOptions,
  IMapPointDTO,
  PIN_TYPE,
} from '../interfaces/dashboard/MapModel'
import { latLng } from 'leaflet'
import { MapPointTypeDefaultValue } from '../utils/mappingPOIs'
import { INearbyFeature } from '../interfaces/NearbyPoint'
import {
  getAllTrailStops,
  isStopPoint,
  ITrailStop,
} from '../utils/pointDistance'

const subsetOfTHREE = {
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
}

CameraControls.install({ THREE: subsetOfTHREE })

// https://stadtentwicklung.github.io/map3/

// https://github.com/stadtentwicklung/map3/blob/main/Qgis2threejs.js

// const ENABLE_SHADOW = false;

class ModelScene extends Scene {}

interface IContourHeightMap {
  left: number[]
  right: number[]
  top: number[]
  bottom: number[]
}

enum TileBorderEnum {
  NONE = 0,
  TOP = 1,
  RIGHT = 2,
  BOTTOM = 4,
  LEFT = 8,
}

export class Model {
  private renderer: WebGLRenderer
  private scene: ModelScene
  private camera: PerspectiveCamera
  public readonly controls: CameraControls
  private width: number
  private height: number
  private axisControl: AxisControl
  private northArrowControl: NorthArrowControl
  private origin: IPoint
  private map: Map
  private enableSun: boolean = true
  private clock = new Clock()
  private pathAnimation: gsap.core.Tween
  private markers: Group[] = []
  private disposed: boolean = false
  public options: IMapModelConfig
  // call TerainModel component method to set popup data about reached point
  public onTrailPointReachedCallback: (point: IMapObjectOptions) => void

  constructor(
    private canvas: HTMLCanvasElement,
    viewHelperCanvasWrapper: HTMLElement,
    northArrowCanvasWrapper: HTMLElement,
    private options: IMapModelConfig,
  ) {
    this.width = canvas.width
    this.height = canvas.height
    this.options = options
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0, 0)

    //if (ENABLE_SHADOW) {
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.shadowMap.enabled = false
    //}
    // this.renderer.physicallyCorrectLights=true;

    this.camera = this.buildCamera()
    this.scene = new ModelScene()
    this.controls = this.initOrbitControls(
      this.camera,
      this.renderer.domElement,
    )
    // this.controls.update(delta );
    // -
    this.axisControl = this.buildAxisControl(viewHelperCanvasWrapper)
    this.northArrowControl = new NorthArrowControl(
      this.camera,
      northArrowCanvasWrapper,
      0,
    )
    // -
    this.map = new Map(
      {
        lat: options.center.lat,
        lng: options.center.lng,
      },
      options.center.alt,
      options.zoom,
    )

    //this.addLights();
    this.addSky()
    this.addNewLights()

    this.init()

    //const center = this.coordToModelPoint(this.map.center);
    // MAPPING PREVIOUSLY ADDED OBJECTS BY USER
    options?.mapObjects?.forEach((_obj) =>
      this.addObjectToMap(_obj.x, _obj.y, _obj.z, _obj),
    )

    /*
		this.scene.position.x = -center.x;
		this.scene.position.y = -center.y;
		*/
  }

  public destroy() {
    this.scene.clear()
    this.renderer.dispose()
    this.disposed = true
  }

  public addNearbyPOIs(mapPoints: IMapPointDTO[]) {
    const heightScale = this.getHeightScale()
    let fallbackElevation = 0

    mapPoints.forEach((_elem) => {
      if (_elem?.tags?.ele) {
        fallbackElevation = _elem.tags.ele
      }
      const point = this.coordToModelPoint({ lat: _elem.lat, lng: _elem.lon })
      let labelStr = ''
      if (_elem.type === 'peak') {
        labelStr = `${_elem?.tags?.name ? _elem?.tags?.name + ' ' : ''}${
          _elem?.tags?.ele
        }m`
      } else {
        labelStr = _elem?.tags?.name
      }
      if (labelStr) {
        this.addLabel(
          point.x - 0.5,
          point.y + 0.5,
          (_elem?.tags?.ele ?? fallbackElevation) / heightScale,
          _elem.id.toString(),
          labelStr,
        )
        this.options.mapObjects.push({
          label: labelStr,
          id: _elem.id.toString(),
          x: point.x - 0.5,
          y: point.y + 0.5,
          z: (_elem?.tags?.ele ?? fallbackElevation) / heightScale,
          pinType: PIN_TYPE.PIN_LABEL
        })
      }
    })
  }

  public pauseTrailAnimation() {
    if (!this.animationTrail) return
    this.animationTrail = false
    this.pathAnimation?.pause()
    this.controls.enabled = true
  }

  public playTrailAnimation() {
    if (this.animationTrail) return
    this.animationTrail = true
    const currentTime = this.pathAnimation ? this.pathAnimation.time() : 0
    this.pathAnimation?.play()
    this.pathAnimation?.time(currentTime)
  }

  public stopTrailAnimation() {
    this.animationTrail = false
    this.pathAnimation?.pause()
    this.pathAnimation?.time(0)
    this.controls.enabled = true
  }

  public setEnableShadow(enable: boolean) {
    if (this.renderer.shadowMap.enabled != enable) {
      this.renderer.shadowMap.enabled = enable
      this.renderer.shadowMap.needsUpdate = true

      this.scene.traverse((child: any) => {
        if (child.material) {
          child.material.needsUpdate = true
        }
      })
    }
  }

  public setEnableSun(enable: boolean) {
    this.enableSun = enable
  }

  private addCube(x: number, y: number, z: number) {
    const size = 0.02
    const geometry = new BoxGeometry(size, size, size)
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new Mesh(geometry, material)
    cube.position.set(x, y, z)
    this.scene.add(cube)
  }

  //@ts-ignore
  private async addMarker(
    x: number,
    y: number,
    z: number,
    pinId: string,
    color: Color = null,
  ) {
    const url = '/assets/pin.gltf'
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(url)

    const scale = 0.03

    let pin = gltf.scene.clone(true)
    pin.position.setZ(z) //setZ(3.195149291587768);

    if (color != null) {
      const mesh = pin.getObjectByName('Curve') as Mesh
      const mat = mesh.material as MeshStandardMaterial
      mat.color = color
    }
    /*
		var box = new Box3().setFromObject(pin);
		let t = new Vector3();
		console.log('box',  box.getCenter(t), t);
		*/
    let pinGroup = new Group()
    pinGroup.name = 'PIN_COLORED'
    pinGroup.add(pin)

    pin.rotateX(Math.PI)

    pinGroup.scale.x = scale
    pinGroup.scale.y = scale
    pinGroup.scale.z = scale

    pinGroup.position.set(x, y, z)
    pinGroup.pinId = pinId
    pinGroup.isClickable = true

    this.scene.add(pinGroup)

    this.markers.push(pinGroup)
    //pinGroup.quaternion.copy( this.camera.quaternion );
  }

  private addSphere(x: number, y: number, z: number, id: string = null) {
    const size = 0.01
    const geometry = new SphereGeometry(size, 32, 32)
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    const sphare = new Mesh(geometry, material)
    sphare.position.set(x, y, z)
    if (id) {
      sphare.pinId = id
    }
    this.scene.add(sphare)
  }

  private addLights() {
    this.scene.add(new AmbientLight(0xffffff, 0.5))

    const dirLight = new DirectionalLight(0xffffff, 0.9)

    dirLight.position.set(-0.8, -0.8, 1.3)

    const dirLightHelper = new DirectionalLightHelper(dirLight, 10)
    this.scene.add(dirLightHelper)

    //this.addCube(dir.position.getComponent(0), dir.position.getComponent(1), dir.position.getComponent(2));
    //this.scene.add(dir);
  }

  public async init() {
    const xyz = this.getTileXYZ(this.map.center, this.map.zoom)
    const trail =
      this.options.trailGpxUrl == null
        ? null
        : await this.loadTrail(this.options.trailGpxUrl)
    //@ts-ignore
    const tileDecorator: TileTextureDecorator =
      trail == null ? null : new TileTextureDecorator(trail, this.map)

    const tilesGroup = new Group()
    tilesGroup.name = 'model'

    let tileMatrix: Promise<Group>[][] = []

    if (this.options.bbox != null) {
      const t1 = this.getTileXYZ(this.options.bbox.northEast, this.options.zoom)

      const t2 = this.getTileXYZ(this.options.bbox.southWest, this.options.zoom)

      if (t1[0] < t2[0]) {
        throw new Error('0')
      }
      if (t1[1] > t2[1]) {
        throw new Error('1')
      }

      for (let i = t2[0]; i <= t1[0]; i++) {
        let tmp: Promise<Group>[] = []
        tileMatrix.push(tmp)
        for (let j = t1[1]; j <= t2[1]; j++) {
          tmp.push(
            this.addTileMesh(
              xyz,
              i - xyz[0],
              xyz[1] - j,
              tilesGroup,
              (i == t2[0] ? TileBorderEnum.LEFT : TileBorderEnum.NONE) |
                (i == t1[0] ? TileBorderEnum.RIGHT : TileBorderEnum.NONE) |
                (j == t1[1] ? TileBorderEnum.TOP : TileBorderEnum.NONE) |
                (j == t2[1] ? TileBorderEnum.BOTTOM : TileBorderEnum.NONE),
              tileDecorator,
            ),
          )
        }
      }
    } else {
      let modelTileSize = 4
      const low = Math.floor(modelTileSize / 2)
      const up = low + modelTileSize

      for (let i = -low; i < up; i++) {
        let tmp: Promise<Group>[] = []
        tileMatrix.push(tmp)
        for (let j = -low; j < up; j++) {
          // const x = xyz[0] + i;
          // const y = xyz[1] - j;

          tmp.push(
            this.addTileMesh(
              xyz,
              i,
              -j,
              tilesGroup,
              (i == -low ? TileBorderEnum.LEFT : TileBorderEnum.NONE) |
                (i == up - 1 ? TileBorderEnum.RIGHT : TileBorderEnum.NONE) |
                (j == -low ? TileBorderEnum.TOP : TileBorderEnum.NONE) |
                (j == up - 1 ? TileBorderEnum.BOTTOM : TileBorderEnum.NONE),
              tileDecorator,
            ),
          )
        }
      }
    }

    this.scene.add(tilesGroup)

    const origin = this.map.project(tile2LatLong(xyz[0], xyz[1], xyz[2]))
    this.origin = origin

    if (trail != null) {
      await this.addTrail(trail)
    }

    const heightScale = this.getHeightScale()

    const tmpPoint = this.map.project({
      lat: 45.85493,
      lng: 6.8175289,
    })

    this.addSphere(
      (tmpPoint.x - origin.x) / 256 - 0.5,
      (origin.y - tmpPoint.y) / 256 + 0.5,
      3167 / heightScale + 0.006,
    )

    this.fixTileEdges(tileMatrix)

    setTimeout(() => {
      this.fitCameraTo(new Box3().setFromObject(tilesGroup), this.camera as any)
    }, 1000)
  }

  public async drawTrail(source: string) {
    const xyz = this.getTileXYZ(this.map.center, this.map.zoom)
    let trail: ILatLngAlt[] = await this.loadTrail(source)
    this.options.trailGpxUrl = source
    //@ts-ignore
    const tileDecorator: TileTextureDecorator =
      trail == null ? null : new TileTextureDecorator(trail, this.map)

    const tilesGroup = new Group()
    tilesGroup.name = 'model'

    let tileMatrix: Promise<Group>[][] = []

    if (this.options.bbox != null) {
      const t1 = this.getTileXYZ(this.options.bbox.northEast, this.options.zoom)

      const t2 = this.getTileXYZ(this.options.bbox.southWest, this.options.zoom)

      if (t1[0] < t2[0]) {
        throw new Error('0')
      }
      if (t1[1] > t2[1]) {
        throw new Error('1')
      }

      for (let i = t2[0]; i <= t1[0]; i++) {
        let tmp: Promise<Group>[] = []
        tileMatrix.push(tmp)
        for (let j = t1[1]; j <= t2[1]; j++) {
          tmp.push(
            this.addTileMesh(
              xyz,
              i - xyz[0],
              xyz[1] - j,
              tilesGroup,
              (i == t2[0] ? TileBorderEnum.LEFT : TileBorderEnum.NONE) |
                (i == t1[0] ? TileBorderEnum.RIGHT : TileBorderEnum.NONE) |
                (j == t1[1] ? TileBorderEnum.TOP : TileBorderEnum.NONE) |
                (j == t2[1] ? TileBorderEnum.BOTTOM : TileBorderEnum.NONE),
              tileDecorator,
            ),
          )
        }
      }
    } else {
      let modelTileSize = 4
      const low = Math.floor(modelTileSize / 2)
      const up = low + modelTileSize

      for (let i = -low; i < up; i++) {
        let tmp: Promise<Group>[] = []
        tileMatrix.push(tmp)
        for (let j = -low; j < up; j++) {
          // const x = xyz[0] + i;
          // const y = xyz[1] - j;

          tmp.push(
            this.addTileMesh(
              xyz,
              i,
              -j,
              tilesGroup,
              (i == -low ? TileBorderEnum.LEFT : TileBorderEnum.NONE) |
                (i == up - 1 ? TileBorderEnum.RIGHT : TileBorderEnum.NONE) |
                (j == -low ? TileBorderEnum.TOP : TileBorderEnum.NONE) |
                (j == up - 1 ? TileBorderEnum.BOTTOM : TileBorderEnum.NONE),
              tileDecorator,
            ),
          )
        }
      }
    }

    this.scene.add(tilesGroup)

    const origin = this.map.project(tile2LatLong(xyz[0], xyz[1], xyz[2]))
    this.origin = origin

    if (trail != null) {
      await this.addTrail(trail)
    }

    const heightScale = this.getHeightScale()

    const tmpPoint = this.map.project({
      lat: 45.85493,
      lng: 6.8175289,
    })

    this.addSphere(
      (tmpPoint.x - origin.x) / 256 - 0.5,
      (origin.y - tmpPoint.y) / 256 + 0.5,
      3167 / heightScale + 0.006,
    )

    this.fixTileEdges(tileMatrix)

    setTimeout(() => {
      this.fitCameraTo(new Box3().setFromObject(tilesGroup), this.camera as any)
    }, 1000)
  }

  public resetCamera() {
    const bbox = new Box3()
    //@ts-ignore
    bbox.setFromObject(this.scene.getObjectByName('model'))
    this.fitCameraTo(bbox, this.camera as any)
  }

  private fitCameraTo(boundingBox: Box3, camera: PerspectiveCamera) {
    const size = boundingBox.getSize(new Vector3())

    const padding = 0.2

    const distance = this.controls.getDistanceToFitBox(
      size.x + padding,
      size.y + padding,
      size.z + padding,
    )
    this.controls.moveTo(0, 0, 0, true)
    this.controls.dollyTo(distance, true)
    this.controls.rotateTo(0, Math.PI / 4, true)
    this.controls.setFocalOffset(0, 0, 0, true)
  }

  private async loadTrail(sourceUrl: string) {
    try {
      const response = await axios.get(sourceUrl)
      const fileContent = response.data
      const pathPoints: ILatLngAlt[] = []
      fileContent.forEach((_point) => {
        const { latitude, longitude, elevation } = _point
        const newPoint: ILatLngAlt = {
          //@ts-ignore
          lat: latitude,
          //@ts-ignore
          lng: longitude,
          //@ts-ignore
          alt: elevation || 0,
        }

        pathPoints.push(newPoint)
      })
      return pathPoints
    } catch (e) {
      console.error(e)
    }
  }

  private async addTrail(gpxPoints: ILatLngAlt[]) {
    // https://stackoverflow.com/questions/2651099/convert-long-lat-to-pixel-x-y-on-a-given-picture

    const material = new LineBasicMaterial({
      color: 0x0000ff,
    })

    const heightScale = this.getHeightScale()

    let points: IPoint3D[] = []
    for (let x of gpxPoints) {
      const tmpPoint = this.map.project({
        lat: x.lat,
        lng: x.lng,
      })

      const coord = [
        (tmpPoint.x - this.origin.x) / 256,
        (this.origin.y - tmpPoint.y) / 256,
      ]

      points.push({
        x: coord[0] - 0.5,
        y: coord[1] + 0.5,
        z: x.alt / heightScale + 0.006,
      })
    }

    const SIMPLIFY = false
    let path = new CurvePath()

    const cameraElevation = 0

    let allTrailStops: ITrailStop[] = []

    let vectors: Vector3[]
    if (SIMPLIFY) {
      points = simplify3D(points, 0.001, false)

      let beziers = fitCurve(points, 0.01)

      for (let bezier of beziers) {
        path.add(
          new CubicBezierCurve3(
            new Vector3(
              bezier[0].x,
              bezier[0].y,
              bezier[0].z + cameraElevation,
            ),
            new Vector3(
              bezier[1].x,
              bezier[1].y,
              bezier[1].z + cameraElevation,
            ),
            new Vector3(
              bezier[2].x,
              bezier[2].y,
              bezier[2].z + cameraElevation,
            ),
            new Vector3(
              bezier[3].x,
              bezier[3].y,
              bezier[3].z + cameraElevation,
            ),
          ),
        )
      }
      vectors = path.getPoints(100) as Vector3[]
    } else {
      vectors = points.map((x) => new Vector3(x.x, x.y, x.z))
      allTrailStops = getAllTrailStops(vectors, this.options.mapObjects)
      console.log(allTrailStops)

      for (let i = 1; i < vectors.length; i++) {
        let p1 = vectors[i - 1].clone()
        let p2 = vectors[i].clone()
        p1.z += cameraElevation
        p2.z += cameraElevation
        path.add(new LineCurve3(p1, p2))
      }
    }

    //const vectors: Vector3[] = points.map(x => new Vector3(x.x, x.y, x.z));

    const geometry = new BufferGeometry().setFromPoints(vectors)

    const line = new Line(geometry, material)
    this.scene.add(line)

    this.setTrailAnimation(path, allTrailStops)
  }

  private setTrailAnimation(path: CurvePath<Vector>, stops: ITrailStop[] = []) {
    const { x, y, z } = path.getPointAt(0) as Vector3
    this.addSphere(x, y, z, 'TRAIL_SPHERE')

    const animationProgress = { value: 0 }
    const pathAnimation = gsap.fromTo(
      animationProgress,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 20,
        overwrite: true,
        paused: true,
        repeat: 0,
        onUpdateParams: [animationProgress],
        onUpdate: ({ value }) => {
          const pos = path.getPointAt(value) as Vector3
          const stopObj = isStopPoint(pos, stops)
          if (stopObj !== null) {
            stops = stops.filter(
              (_stop: ITrailStop) => _stop.object.id !== stopObj.id,
            )
            this.pauseTrailAnimation()

            this.onTrailPointReachedCallback(stopObj)

            setTimeout(() => {
              this.playTrailAnimation()
            }, 5000)
          }

          const mySphere = this.scene.children.find(
            (_item) => _item.pinId === 'TRAIL_SPHERE',
          )
          mySphere.position.set(pos.x, pos.y, pos.z)
        },
        onStart: () => {
          this.controls.enabled = false
        },
        onComplete: () => {
          this.controls.enabled = true
          this.animateTrail = false
          this.stopTrailAnimation()
        },
      },
    )

    this.pathAnimation = pathAnimation
  }

  private fixTileEdges(tileMatrix: Promise<Group>[][]) {
    async function getPositionBuffer(tile: Promise<Group>) {
      let map = (await tile).getObjectByName('map') as Mesh
      return map.geometry.getAttribute('position') as Float32BufferAttribute
    }

    async function fixTiles(
      tile1: Promise<Group>,
      tile2: Promise<Group>,
      fn1: (i: number) => number,
      fn2: (i: number) => number,
    ) {
      let pos1 = await getPositionBuffer(tile1)
      let pos2 = await getPositionBuffer(tile2)

      for (let i = 0; i < 256; i++) {
        const idx1 = fn1(i)
        const idx2 = fn2(i)
        const avg = (pos2.getZ(idx2) + pos1.getZ(idx1)) / 2
        pos1.setZ(idx1, avg)
        pos2.setZ(idx2, avg)
      }
      pos1.needsUpdate = true
      pos2.needsUpdate = true
    }

    for (let i = 0; i < tileMatrix.length; i++) {
      for (let j = 0; j < tileMatrix[i].length - 1; j++) {
        fixTiles(
          tileMatrix[i][j],
          tileMatrix[i][j + 1],
          (x) => 256 * 256 - 256 + x,
          (x) => x,
        )
      }
    }

    for (let i = 0; i < tileMatrix.length - 1; i++) {
      for (let j = 0; j < tileMatrix[i].length; j++) {
        fixTiles(
          tileMatrix[i][j],
          tileMatrix[i + 1][j],
          (x) => 256 + x * 256 - 1,
          (x) => x * 256,
        )
      }
    }
  }

  private coordToModelPoint(coord: ILatLng): IPoint {
    const xyz = this.getTileXYZ(this.map.center, this.map.zoom)

    const origin = this.map.project(tile2LatLong(xyz[0], xyz[1], xyz[2]))
    const tmpPoint = this.map.project(coord)

    return {
      x: (tmpPoint.x - origin.x) / 256,
      y: (origin.y - tmpPoint.y) / 256,
    }
  }

  private async addTileMesh(
    xyz: number[],
    x: number,
    y: number,
    tilesGroup: Group,
    borders: TileBorderEnum,
    tileDecorator: ITileTextureDecorator,
  ) {
    let mesh = await this.getMesh(
      xyz[0] + x,
      xyz[1] - y,
      xyz[2],
      borders,
      tileDecorator,
    )
    mesh.name = `tile-${xyz[0] + x}-${xyz[1] - y}`

    tilesGroup.add(mesh)
    mesh.position.setX(x)
    mesh.position.setY(y)
    return mesh
  }

  private getTileXYZ(pos: ILatLng, zoom: number) {
    let x = lon2tile(pos.lng, zoom)
    let y = lat2tile(pos.lat, zoom)

    return [x, y, zoom]
  }

  private async loadTile(x: number, y: number, zoom: number) {
    const baseUrl = 'https://3dmap.janjanousek.cz/proxy/?url='
    //const baseUrl = 'https://api.mapbox.com/';

    const apiKey =
      'pk.eyJ1IjoiamFub3VzZWsiLCJhIjoiY2oyYWE4cXgyMDAwZTMzbjJ2YnZsN2owaiJ9.pYpMMOZZ4Kyaaw3sUZP0hg'
    const url = `${baseUrl}v4/mapbox.terrain-rgb/${zoom}/${x}/${y}.pngraw?access_token=${apiKey}`
    const textureUrl = `${baseUrl}v4/mapbox.satellite/${zoom}/${x}/${y}@2x.png?access_token=${apiKey}`

    const [{ size: planeSize, heights }, texture] = await Promise.all([
      ElevationLoader.load(url),
      new TextureLoader().loadAsync(textureUrl),
    ])

    //nejvetsi alt na mape
    this.options.center.alt = Math.max(this.options.center.alt, ...heights)

    let sidesHeightMap: IContourHeightMap = {
      left: [],
      right: [],
      top: [],
      bottom: [],
    }
    for (let idx = 0; idx < heights.length; idx++) {
      const height = heights[idx]

      if (idx < planeSize) {
        sidesHeightMap.top.push(height)
      }
      if (idx > heights.length - planeSize - 1) {
        sidesHeightMap.bottom.push(height)
      }
      if (idx % planeSize == 0) {
        sidesHeightMap.left.push(height)
      }
      if ((idx + 1) % planeSize == 0) {
        sidesHeightMap.right.push(height)
      }
    }

    return {
      heights: heights,
      size: planeSize,
      texture: texture,
      sidesHeightMap: sidesHeightMap,
    }
  }

  private async getMesh(
    x: number,
    y: number,
    zoom: number,
    borders: TileBorderEnum,
    tileDecorator: ITileTextureDecorator,
  ): Promise<Group> {
    const tileLat = tile2lat(y, zoom)
    const tileLng = tile2long(x, zoom)

    const group = new Group()

    const tile = await this.loadTile(x, y, zoom)
    const geometry = new PlaneGeometry(1, 1, tile.size - 1, tile.size - 1)

    const heightScale = this.getHeightScale()

    const positions = geometry.attributes['position'] as Float32BufferAttribute
    for (let i = 0; i < tile.heights.length; i++) {
      const height = tile.heights[i]
      positions.setZ(i, height / heightScale)
    }

    geometry.computeVertexNormals()

    geometry.attributes['position'].needsUpdate = true
    geometry.attributes['normal'].needsUpdate = true
    geometry.attributes['uv'].needsUpdate = true

    tileDecorator?.decorate(tile.texture, tileLat, tileLng)

    const material = new MeshLambertMaterial({
      map: tile.texture,
      side: DoubleSide,
      // wireframe: true
    })
    const mesh = new Mesh(geometry, material)
    mesh.name = 'map'
    mesh.userData = {
      x: x,
      y: y,
      zoom: zoom,
      lat: tile2lat(y, zoom),
      lng: tile2long(x, zoom),
    }

    //if (ENABLE_SHADOW) {
    mesh.receiveShadow = true
    mesh.castShadow = true
    //}

    this.createBox(tile.sidesHeightMap, heightScale, group, borders)

    group.add(mesh)

    // console.log('max height', tile.heights.reduce((a, b) => Math.max(a, b), 0) / heightScale);

    return group
  }

  private static groundMaterial = new Promise(async (resolve) => {
    const loader = new TextureLoader()
    const groundTexture = await loader.loadAsync('/assets/ground.jpg')
    resolve(
      new MeshLambertMaterial({
        map: groundTexture,
        side: DoubleSide,
        // wireframe: true
      }),
    )
  })

  private async createBox(
    sidesHeightMap: IContourHeightMap,
    heightScale: number,
    group: Group,
    borders: TileBorderEnum,
  ) {
    if (borders == TileBorderEnum.NONE) {
      return
    }

    const sideMaterial = await Model.groundMaterial

    const DEPTH = -0.1

    let createSide = (data: number[]) => {
      const len = data.length - 1

      /*
						let pts: Vector2[] = [];
						for (let i = 0; i < data.length; i++) {
							pts.push(new Vector2(i / len, data[i] / heightScale));
						}
						pts.push(new Vector2(1, DEPTH));
						pts.push(new Vector2(0, DEPTH));
			
						let shape = new Shape(pts);
						let bg = new ShapeGeometry(shape);
						let side = new Mesh(bg, sideMaterial);
						*/

      let pts: number[] = []
      for (let i = 0; i < data.length; i++) {
        pts.push(i / len)
        pts.push(data[i] / heightScale)
        pts.push(0)
      }
      for (let i = 0; i < data.length; i++) {
        pts.push(i / len)
        pts.push(DEPTH)
        pts.push(0)
      }

      let idxs: number[] = []
      for (let i = 0; i < data.length - 1; i++) {
        idxs.push(0 + i)
        idxs.push(1 + i)
        idxs.push(data.length + i)

        idxs.push(1 + i)
        idxs.push(data.length + 1 + i)
        idxs.push(data.length + i)
      }

      let uvs: number[] = []
      for (let i = 0; i < data.length; i++) {
        uvs.push(i / len)
        uvs.push(0)
      }
      for (let i = 0; i < data.length; i++) {
        uvs.push(i / len)
        uvs.push(1)
      }

      let normals: number[] = []
      for (let i = 0; i < pts.length; i++) {
        normals.push(0, 0, -1)
      }

      let bg = new BufferGeometry()

      bg.setAttribute('position', new Float32BufferAttribute(pts, 3))
      bg.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
      bg.setAttribute('normal', new Float32BufferAttribute(normals, 3))
      bg.setIndex(idxs)

      let side = new Mesh(bg, sideMaterial)

      return side
    }

    let createHorizontalSide = (data: number[], mult: number) => {
      let side = createSide(data)
      side.rotation.x = Math.PI / 2
      side.rotation.y = (-Math.PI / 2) * mult

      side.position.y = 0.5 * mult
      return side
    }

    let createVerticalSide = (data: number[], mult: number) => {
      let side = createSide(data)
      side.rotation.x = Math.PI / 2
      side.rotation.y = mult == -1 ? Math.PI : 0

      side.position.x = -0.5 * mult
      return side
    }

    if ((borders & TileBorderEnum.LEFT) == TileBorderEnum.LEFT) {
      let leftSide = createHorizontalSide(sidesHeightMap.left, 1)
      leftSide.position.x = -0.5
      group.add(leftSide)
    }
    // -

    if ((borders & TileBorderEnum.RIGHT) == TileBorderEnum.RIGHT) {
      let rightSide = createHorizontalSide(sidesHeightMap.right.reverse(), -1)
      rightSide.position.x = 0.5
      group.add(rightSide)
    }
    // -
    if ((borders & TileBorderEnum.TOP) == TileBorderEnum.TOP) {
      let topSide = createVerticalSide(sidesHeightMap.top.reverse(), -1)
      topSide.position.y = 0.5
      group.add(topSide)
    }
    // -
    if ((borders & TileBorderEnum.BOTTOM) == TileBorderEnum.BOTTOM) {
      let bottomSide = createVerticalSide(sidesHeightMap.bottom, 1)
      bottomSide.position.y = -0.5
      group.add(bottomSide)
    }

    /*
		const helper = new VertexNormalsHelper(rightSide, 1, 0xff0000);
		this.scene.add(helper);
		*/
    // bottom

    let pts: Vector2[] = []

    pts.push(new Vector2(0, 0))
    pts.push(new Vector2(0, 1))
    pts.push(new Vector2(1, 1))
    pts.push(new Vector2(1, 0))

    let bottomShape = new ShapeGeometry(new Shape(pts))
    const bottomNormals = bottomShape.attributes['normal']
    for (let i = 0; i < bottomNormals.count; i++) {
      ;(bottomNormals as any).setZ(i, -1)
    }

    let bottom = new Mesh(
      bottomShape,
      new MeshBasicMaterial({ color: 0x642b1f, side: DoubleSide }),
    )
    bottom.position.x = -0.5
    bottom.position.y = -0.5
    bottom.position.z = DEPTH
    group.add(bottom)
  }

  private buildAxisControl(viewHelperCanvasWrapper: HTMLElement) {
    const axisControl = new AxisControl(
      this,
      this.camera,
      viewHelperCanvasWrapper,
    )
    return axisControl
  }

  public setCanvasSize(width: number, height: number) {
    this.width = width
    this.height = height

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private buildCamera() {
    const camera = new PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      10000,
    )
    // magic to change y-up world to z-up
    camera.up.set(0, 0, 1)

    camera.position.z = 2

    return camera
  }

  private render() {
    // rotace markerů podle kamery
    for (let marker of this.markers) {
      // TODO: jak dělat billboarding?
      // let pos = this.camera.position.clone();
      //pos.x = marker.position.x;
      //marker.lookAt(pos);
      // console.log(marker.rotation);
      //marker.rotation.x = 0;
      //marker.rotation.y = 0;
      /*/
			console.log(marker.quaternion);
			marker.quaternion.copy( this.camera.quaternion );
			marker.quaternion.x = 0;
			marker.quaternion.y = 0;*/
      //marker.rotation.z = this.camera.rotation.z;
    }

    // -

    this.renderer.render(this.scene, this.camera)

    this.axisControl.render()

    this.northArrowControl.render()
  }

  public animate() {
    if (this.disposed) return

    requestAnimationFrame(() => this.animate())

    this.axisControl.update()

    this.northArrowControl.update()

    const hasControlsUpdated = this.controls.update(this.clock.getDelta())

    this.render()
  }

  private initOrbitControls(
    camera: PerspectiveCamera | OrthographicCamera,
    domElement: HTMLCanvasElement,
  ) {
    const controls = new CameraControls(camera, domElement)
    controls.verticalDragToForward = true
    // controls.screenSpacePanning = false;

    // controls.enableKeys = false;    // key events are handled in app.eventListener.keydown
    /*
				controls.panSpeed = Q3D.Config.controls.panSpeed;
				controls.rotateSpeed = Q3D.Config.controls.rotateSpeed;
				controls.zoomSpeed = Q3D.Config.controls.zoomSpeed;
				controls.keyPanSpeed = Q3D.Config.controls.keyPanSpeed;
				controls.keyRotateAngle = Q3D.Config.controls.keyRotateSpeed * Math.PI / 180;
		
				controls.target.copy(Q3D.Config.viewpoint.lookAt);
		*/

    // custom actions
    const offset = new Vector3(),
      spherical = new Spherical(),
      quat = new Quaternion().setFromUnitVectors(
        camera.up,
        new Vector3(0, 1, 0),
      ),
      quatInverse = quat.clone().invert()

    this.cameraRotate = (thetaDelta: number, phiDelta: number) => {
      let target = new Vector3()
      target = this.controls.getTarget(target)

      offset.copy(target).sub(this.controls.camera.position)
      offset.applyQuaternion(quat)

      spherical.setFromVector3(offset)

      spherical.theta += thetaDelta
      spherical.phi -= phiDelta

      // restrict theta/phi to be between desired limits
      spherical.theta = Math.max(
        this.controls.minAzimuthAngle,
        Math.min(this.controls.maxAzimuthAngle, spherical.theta),
      )
      spherical.phi = Math.max(
        this.controls.minPolarAngle,
        Math.min(this.controls.maxPolarAngle, spherical.phi),
      )
      spherical.makeSafe()

      offset.setFromSpherical(spherical)
      offset.applyQuaternion(quatInverse)

      target.copy(this.controls.camera.position).add(offset)

      this.controls.setTarget(target.x, target.y, target.z)
      this.controls.camera.lookAt(target)
    }

    return controls
  }

  public cameraRotate(thetaDelta: number, phiDelta: number) {
    throw new Error('not implemented')
  }

  public intersectObjects(offsetX: number, offsetY: number) {
    var vec2 = new Vector2(
      (offsetX / this.width) * 2 - 1,
      -(offsetY / this.height) * 2 + 1,
    )
    var ray = new Raycaster()
    // ray.linePrecision = 0.2;

    ray.setFromCamera(vec2, this.camera)
    return ray.intersectObjects([this.scene], true)
  }

  private addLabel(
    x: number,
    y: number,
    z: number,
    pinId: string = '',
    txt: string = 'TEST',
  ) {
    const size = 0.01
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const fontSize = 16

    ctx.font = `${fontSize}px Arial`
    ctx.textBaseline = 'middle' // pro vycentrování textu ve výšce
    const textWidth = ctx.measureText(txt).width

    const width = textWidth + 10
    const height = fontSize + 4

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.strokeRect(0, 0, width, height)

    ctx.fillStyle = '#000'
    ctx.fillText(txt, (width - textWidth) / 2, height / 2)

    const texture = new CanvasTexture(ctx.getImageData(0, 0, width, height))
    texture.minFilter = LinearFilter
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping

    const material = new SpriteMaterial({
      map: texture,
      transparent: true,
    })
    const sprite = new Sprite(material)
    sprite.position.set(x, y, z + 0.1)
    sprite.scale.x = canvas.width * 0.0003
    sprite.scale.y = canvas.height * 0.0003

    sprite.name = 'label'
    sprite.pinId = pinId
    sprite.isClickable = !!pinId
    this.scene.add(sprite)

    const lineMaterial = new LineBasicMaterial({
      color: 0x0000ff,
    })

    const lineGeometry = new BufferGeometry().setFromPoints([
      new Vector3(x, y, z),
      new Vector3(x, y, z + 0.1),
    ])
    const line = new Line(lineGeometry, lineMaterial)

    this.scene.add(line)
  }

  private addImageSprite(
    x: number,
    y: number,
    z: number,
    pinId: string,
    imageUrl: string = '',
  ) {
    const canvasWidth = 300
    const canvasHeight = 160

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = imageUrl

    image.onload = () => {
      const aspectRatio = image.width / image.height
      let drawWidth = canvasWidth
      let drawHeight = canvasHeight

      if (aspectRatio > 1) {
        drawHeight = canvasWidth / aspectRatio
      } else {
        drawWidth = canvasHeight * aspectRatio
      }

      const xOffset = (canvasWidth - drawWidth) / 2
      const yOffset = (canvasHeight - drawHeight) / 2

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      ctx.drawImage(image, xOffset, yOffset, drawWidth, drawHeight)

      const texture = new CanvasTexture(canvas)
      texture.minFilter = LinearFilter
      texture.wrapS = ClampToEdgeWrapping
      texture.wrapT = ClampToEdgeWrapping

      const material = new SpriteMaterial({
        map: texture,
        transparent: true,
      })

      const sprite = new Sprite(material)
      sprite.position.set(x, y, z + 0.1)
      sprite.scale.x = canvas.width * 0.0003
      sprite.scale.y = canvas.height * 0.0003

      sprite.name = 'PIN_IMAGE'
      sprite.pinId = pinId
      sprite.isClickable = true
      this.scene.add(sprite)
      //   let tmp_obj = this.scene.getObjectByName('imageSprite');
      //   tmp_obj.name = 'changedImageSprite';
      const lineMaterial = new LineBasicMaterial({
        color: 0x0000ff,
      })

      const lineGeometry = new BufferGeometry().setFromPoints([
        new Vector3(x, y, z),
        new Vector3(x, y, z + 0.1),
      ])

      const line = new Line(lineGeometry, lineMaterial)
      this.scene.add(line)
    }
  }

  public click(e: MouseEvent, options: IMapObjectOptions): void {
    console.log('EVENT TRIGGERED WITH OPTIONS:')
    console.log(options)
    if (!options || !options?.pinType) return

    const intersectedObjects = this.clickedObjects(e)
    console.log(intersectedObjects)
    if (intersectedObjects.length === 0) return
    const map = intersectedObjects.find((x) => x.object.name === 'map')
    this.addObjectToMap(map.point.x, map.point.y, map.point.z, options)
    this.options.mapObjects.push({
      ...options,
      x: map.point.x,
      y: map.point.y,
      z: map.point.z,
    })
    //const elevation = this.getHeightScale() * map.point.z
    //const clicLatLng = this.map.unproject({
    //	x: this.origin.x + (map.point.x + 0.5) * 256,
    //	y: this.origin.y - (map.point.y - 0.5) * 256
    //});
    //console.log(clicLatLng.lat, clicLatLng.lng, elevation);
  }

  public clickedObjects(
    e: MouseEvent,
  ): Intersection<Object3D<Object3DEventMap>>[] {
    const parent = this.canvas.getBoundingClientRect()
    const objs = this.intersectObjects(
      e.clientX - parent.left,
      e.clientY - parent.top,
    )
    const map = objs.find((x) => x.object.name === 'map')
    if (map == null) {
      return []
    }
    return objs
  }

  public addObjectToMap(
    x: number,
    y: number,
    z: number,
    options: IMapObjectOptions,
  ) {
    console.log('ADDING OBJECT TO MAP')

    z = this.options.heightCoefficient ? z * this.options.heightCoefficient : z

    if (options.pinType === PIN_TYPE.PIN_SIGN) {
      this.addMarker(
        x,
        y,
        z + 0.09,
        options.id,
        options.color ? new Color(options.color) : 0x000000,
      )
    }
    if (options.pinType == PIN_TYPE.PIN_IMAGE) {
      this.addImageSprite(
        x,
        y,
        z,
        options.id,
        options.images?.length > 0 ? options.images[0] : null,
      )
    }
    if (options.pinType == PIN_TYPE.PIN_LABEL && options.label) {
      this.addLabel(x, y, z, options.id, options.label)
    }
  }

  public removeObjectFromMap(pinId: string) {
    console.log(this.scene)
    const itemToDelete = this.scene.children.find(
      (_item) => _item.pinId === pinId,
    )
    console.log(itemToDelete)
    this.scene.remove(itemToDelete)
    console.log(this.scene)
  }

  private addNewLights() {
    const centerZ = this.map.centerAltitude / this.getHeightScale()
    //console.log(getTimes(new Date(),this.map.center.lat, this.map.center.lng))

    this.scene.add(new AmbientLight(0xffffff, 0.2))

    /*
				var hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
		
		
				hemiLight.color.set(0xb1e1ff); // light blue
				hemiLight.color.set(0xb97a20); // brownish
		
				//hemiLight.color.setHSL(0.6, 0.75, 0.5);
				//hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
		
				hemiLight.position.set(0, 0, centerZ + 2);
		
				this.scene.add(hemiLight);
		
				const hemiLightHelper = new HemisphereLightHelper(hemiLight, 5);
				this.scene.add(hemiLightHelper);
		*/
    var dirLight = new DirectionalLight(0xffffff, 1)
    dirLight.target.position.z = centerZ
    // dirLight.position.set(-1, 0.75, 1);

    dirLight.name = 'dirlight'
    // dirLight.shadowCameraVisible = true;

    this.scene.add(dirLight)

    //if (ENABLE_SHADOW) {
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = Math.pow(2, 21) // 1024 === 2 ^ 10;
    dirLight.shadow.mapSize.height = Math.pow(2, 21) // 1024 === 2 ^ 10;

    let d = 50

    dirLight.shadow.camera.left = -d
    dirLight.shadow.camera.right = d
    dirLight.shadow.camera.top = d
    dirLight.shadow.camera.bottom = -d

    dirLight.shadow.camera.far = 3500
    dirLight.shadow.bias = -0.0001 //-0.0001;
    // dirLight.shadowDarkness = 0.35;
    //}

    const dirLightHelper = new DirectionalLightHelper(dirLight, 10)
    this.scene.add(dirLightHelper)

    const setPos = (date: Date) => {
      const sunPos = getSunPosition(
        date,
        this.map.center.lat,
        this.map.center.lng,
      )

      let azimuth = MathUtils.radToDeg(sunPos.azimuth) + 180
      let altitude = MathUtils.radToDeg(sunPos.altitude + Math.PI) - 180

      if (!this.enableSun) {
        azimuth = 180
        altitude = 90
      }

      let t = MathUtils.degToRad(360 - azimuth + 90)
      let x = Math.cos(t)
      let y = Math.sin(t)
      let z = Math.sin(MathUtils.degToRad(altitude))

      const getSunIntensity = (sunrise: Date, sunset: Date) => {
        let xScale = sunset.getTime() - sunrise.getTime()

        let currentX = date.getTime() - sunrise.getTime()
        let xt = currentX / xScale
        if (xt < 0 || xt > 1) {
          // před východem slunce, nebo po západu slunce
          return 0
        } else {
          return Math.sin(xt * Math.PI)
        }
      }

      const times = getTimes(date, this.map.center.lat, this.map.center.lng)

      dirLight.position.set(x, y, z)

      /*
			this.addSphere(
				dirLight.position.getComponent(0),
				dirLight.position.getComponent(1),
				dirLight.position.getComponent(2)
			);
			*/

      if (this.enableSun) {
        dirLight.intensity = getSunIntensity(times.sunrise, times.sunset)
      } else {
        dirLight.intensity = 1
      }
      dirLight.position.multiplyScalar(50)

      dirLightHelper.update()
    }

    iterateDate(this.map.center, (x) => setPos(x))
  }

  private addSky() {
    const sky = new Sky()
    sky.scale.setScalar(200)
    this.scene.add(sky)

    const sun = new Vector3(0, 0, 0)

    let setPos = (date: Date) => {
      const sunPos = getSunPosition(
        date,
        this.map.center.lat,
        this.map.center.lng,
      )

      let azimuth = MathUtils.radToDeg(sunPos.azimuth) + 180
      let altitude = MathUtils.radToDeg(sunPos.altitude + Math.PI) - 180

      if (!this.enableSun) {
        azimuth = 180
        altitude = 90
      }

      const effectController = {
        turbidity: 10,
        rayleigh: 0.642, //3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.9, //0.7,
        elevation: 2,
        azimuth: 180,
        luminance: 0.9,
      }

      const uniforms = sky.material.uniforms
      uniforms['turbidity'].value = effectController.turbidity
      uniforms['rayleigh'].value = effectController.rayleigh
      uniforms['mieCoefficient'].value = effectController.mieCoefficient
      uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

      // const phi = MathUtils.degToRad(90 - effectController.elevation);
      // const theta = MathUtils.degToRad(effectController.azimuth);

      let t = MathUtils.degToRad(360 - azimuth + 90)
      let x = Math.cos(t)
      let y = Math.sin(t)
      let z = Math.sin(MathUtils.degToRad(altitude))

      sun.set(x, y, z)

      uniforms['sunPosition'].value.copy(sun)
      uniforms['up'].value = new Vector3(0, 0, 1)
    }

    iterateDate(this.map.center, (x) => setPos(x))
  }

  public resize(w: number, h: number) {
    this.setCanvasSize(w, h)
  }

  private getHeightScale(): number {
    const heightCoeffitient = this.options.heightCoefficient
    let result = this.map.getTileWidthInMeters()
    if (heightCoeffitient) {
      result /= heightCoeffitient
    }
    return result
  }
}

function iterateDate(center: ILatLng, execute: (date: Date) => void) {
  let date = new Date()
  setInterval(() => {
    date = new Date(date.getTime() + 1000 * 60 * 1)

    const times = getTimes(date, center.lat, center.lng)
    if (date.getTime() > times.sunset.getTime() + 1000 * 60 * 30) {
      date.setDate(date.getDate() + 1)
      date = getTimes(date, center.lat, center.lng).sunrise
    }

    // date = new Date(date.getTime() + 1000 * 60 * 60 * 9);

    execute(date)
  }, 50)

  execute(date)
}
