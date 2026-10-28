import { lazy, Suspense } from 'react'
import { HashRouter, Link, NavLink, Route, Routes, useParams } from 'react-router'
import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import { groups } from '@/catalog'

// Load the first lesson and its WebGL scene only when its page is opened.
const PerspectiveLesson = lazy(() => import('@/lessons/perspective-camera'))

// The box-selection frame owns a separate document for Drei's global drag listeners.
const SelectionBoxFrame = lazy(() => import('@/scenes/selection-box-frame'))

// The capture frame isolates media requests and their document lifetime.
const MediaCaptureFrame = lazy(() => import('@/scenes/media-capture-frame'))

// The face detector runs in an isolated document with a separate lifetime.
const FaceLandmarkerFrame = lazy(() => import('@/scenes/face-landmarker-frame'))

// The live face-control page owns its detector and camera session.
const FaceControlsLive = lazy(() => import('@/scenes/face-controls-live'))

// The splat frame gives the loader and its worker an isolated document lifetime.
const SplatFrame = lazy(() => import('@/scenes/splat-lesson').then((module) => ({ default: module.SplatFrame })))

// Each implemented lesson is loaded only when its route is opened.
const lessons = {
  PerspectiveCamera: PerspectiveLesson,
  isWebGL2Available: lazy(() => import('@/lessons/webgl2-lesson')),
  RenderTexture: lazy(() => import('@/lessons/render-texture-lesson')),
  RenderCubeTexture: lazy(() => import('@/lessons/render-cube-texture-lesson')),
  Hud: lazy(() => import('@/lessons/hud-lesson')),
  Segment: lazy(() => import('@/lessons/segments-lessons')),
  SegmentObject: lazy(() => import('@/lessons/segments-lessons')),
  Segments: lazy(() => import('@/lessons/segments-lessons')),
  Merged: lazy(() => import('@/lessons/instance-groups-lessons')),
  createInstances: lazy(() => import('@/lessons/instance-groups-lessons')),
  InstancedAttribute: lazy(() => import('@/lessons/instanced-attribute-lesson')),
  Sampler: lazy(() => import('@/lessons/sampler-lessons')),
  useSurfaceSampler: lazy(() => import('@/lessons/sampler-lessons')),
  useContextBridge: lazy(() => import('@/lessons/context-example-lessons')),
  Example: lazy(() => import('@/lessons/context-example-lessons')),
  PerformanceMonitor: lazy(() => import('@/lessons/performance-monitor-lessons')),
  usePerformanceMonitor: lazy(() => import('@/lessons/performance-monitor-lessons')),
  AdaptiveDpr: lazy(() => import('@/lessons/adaptive-lessons')),
  AdaptiveEvents: lazy(() => import('@/lessons/adaptive-lessons')),
  meshBounds: lazy(() => import('@/lessons/mesh-bounds-lesson')),
  Bvh: lazy(() => import('@/lessons/bvh-lessons')),
  useBVH: lazy(() => import('@/lessons/bvh-lessons')),
  DetectGPU: lazy(() => import('@/lessons/detect-gpu-lessons')),
  useDetectGPU: lazy(() => import('@/lessons/detect-gpu-lessons')),
  Stats: lazy(() => import('@/lessons/stats-lessons')),
  StatsGl: lazy(() => import('@/lessons/stats-lessons')),
  BakeShadows: lazy(() => import('@/lessons/bake-shadows-lesson')),
  useIntersect: lazy(() => import('@/lessons/intersect-lesson')),
  Detailed: lazy(() => import('@/lessons/detailed-lesson')),
  Grid: lazy(() => import('@/lessons/debug-helper-lessons')),
  Helper: lazy(() => import('@/lessons/debug-helper-lessons')),
  useHelper: lazy(() => import('@/lessons/debug-helper-lessons')),
  GizmoHelper: lazy(() => import('@/lessons/gizmo-lessons')),
  useGizmoContext: lazy(() => import('@/lessons/gizmo-lessons')),
  GizmoViewcube: lazy(() => import('@/lessons/gizmo-lessons')),
  GizmoViewport: lazy(() => import('@/lessons/gizmo-lessons')),
  Splat: lazy(() => import('@/lessons/splat-lesson')),
  ComputedAttribute: lazy(() => import('@/lessons/computed-attribute-lesson')),
  Instance: lazy(() => import('@/lessons/instances-lessons')),
  Instances: lazy(() => import('@/lessons/instances-lessons')),
  PositionMesh: lazy(() => import('@/lessons/instances-lessons')),
  Point: lazy(() => import('@/lessons/points-lessons')),
  Points: lazy(() => import('@/lessons/points-lessons')),
  PointsBuffer: lazy(() => import('@/lessons/points-lessons')),
  PositionPoint: lazy(() => import('@/lessons/points-lessons')),
  View: lazy(() => import('@/lessons/view-lesson')),
  Effects: lazy(() => import('@/lessons/effects-lesson')),
  AsciiRenderer: lazy(() => import('@/lessons/ascii-lesson')),
  useDepthBuffer: lazy(() => import('@/lessons/depth-buffer-lesson')),
  Fbo: lazy(() => import('@/lessons/fbo-lessons')),
  useFBO: lazy(() => import('@/lessons/fbo-lessons')),
  MeshPortalMaterial: lazy(() => import('@/lessons/portal-material-lesson')),
  Fisheye: lazy(() => import('@/lessons/fisheye-lesson')),
  Mask: lazy(() => import('@/lessons/mask-lessons')),
  useMask: lazy(() => import('@/lessons/mask-lessons')),
  OrthographicCamera: lazy(() => import('@/lessons/orthographic-camera')),
  CubeCamera: lazy(() => import('@/lessons/cube-camera')),
  useCubeCamera: lazy(() => import('@/lessons/cube-camera')),
  DeviceOrientationControls: lazy(() => import('@/lessons/device-orientation')),
  FlyControls: lazy(() => import('@/lessons/fly-controls')),
  MapControls: lazy(() => import('@/lessons/orbit-controls')),
  OrbitControls: lazy(() => import('@/lessons/orbit-controls')),
  TrackballControls: lazy(() => import('@/lessons/trackball-controls')),
  ArcballControls: lazy(() => import('@/lessons/trackball-controls')),
  PointerLockControls: lazy(() => import('@/lessons/first-person-controls')),
  FirstPersonControls: lazy(() => import('@/lessons/first-person-controls')),
  CameraControls: lazy(() => import('@/lessons/camera-controls')),
  CameraControlsImpl: lazy(() => import('@/lessons/camera-controls')),
  useCamera: lazy(() => import('@/lessons/use-camera')),
  CycleRaycast: lazy(() => import('@/lessons/interaction-basics')),
  useCursor: lazy(() => import('@/lessons/interaction-basics')),
  DragControls: lazy(() => import('@/lessons/interaction-basics')),
  Scroll: lazy(() => import('@/lessons/scroll-lessons')),
  ScrollControls: lazy(() => import('@/lessons/scroll-lessons')),
  useScroll: lazy(() => import('@/lessons/scroll-lessons')),
  KeyboardControls: lazy(() => import('@/lessons/keyboard-lessons')),
  useKeyboardControls: lazy(() => import('@/lessons/keyboard-lessons')),
  PresentationControls: lazy(() => import('@/lessons/presentation-controls')),
  Select: lazy(() => import('@/lessons/select-lessons')),
  useSelect: lazy(() => import('@/lessons/select-lessons')),
  MotionPathControls: lazy(() => import('@/lessons/motion-lessons')),
  useMotion: lazy(() => import('@/lessons/motion-lessons')),
  TransformControls: lazy(() => import('@/lessons/transform-controls')),
  PivotControls: lazy(() => import('@/lessons/pivot-controls')),
  QuadraticBezierLine: lazy(() => import('@/lessons/quadratic-bezier')),
  CubicBezierLine: lazy(() => import('@/lessons/cubic-bezier')),
  CatmullRomLine: lazy(() => import('@/lessons/catmull-rom')),
  Line: lazy(() => import('@/lessons/line-lesson')),
  MarchingCube: lazy(() => import('@/lessons/marching-lessons')),
  MarchingCubes: lazy(() => import('@/lessons/marching-lessons')),
  MarchingPlane: lazy(() => import('@/lessons/marching-lessons')),
  CurveModifier: lazy(() => import('@/lessons/curve-modifier')),
  Box: lazy(() => import('@/lessons/box-lesson')),
  Capsule: lazy(() => import('@/lessons/capsule-lesson')),
  Circle: lazy(() => import('@/lessons/circle-lesson')),
  Cone: lazy(() => import('@/lessons/cone-cylinder')),
  Cylinder: lazy(() => import('@/lessons/cone-cylinder')),
  Dodecahedron: lazy(() => import('@/lessons/platonic-lessons')),
  Icosahedron: lazy(() => import('@/lessons/platonic-lessons')),
  Octahedron: lazy(() => import('@/lessons/platonic-lessons')),
  Tetrahedron: lazy(() => import('@/lessons/platonic-lessons')),
  Shape: lazy(() => import('@/lessons/shape-extrude')),
  Extrude: lazy(() => import('@/lessons/shape-extrude')),
  Lathe: lazy(() => import('@/lessons/lathe-lesson')),
  Plane: lazy(() => import('@/lessons/plane-lesson')),
  Polyhedron: lazy(() => import('@/lessons/polyhedron-lesson')),
  Ring: lazy(() => import('@/lessons/ring-lesson')),
  Sphere: lazy(() => import('@/lessons/sphere-lesson')),
  Torus: lazy(() => import('@/lessons/torus-lessons')),
  TorusKnot: lazy(() => import('@/lessons/torus-lessons')),
  Tube: lazy(() => import('@/lessons/tube-lesson')),
  RoundedBox: lazy(() => import('@/lessons/rounded-box-lessons')),
  RoundedBoxGeometry: lazy(() => import('@/lessons/rounded-box-lessons')),
  ScreenQuad: lazy(() => import('@/lessons/screen-quad')),
  Html: lazy(() => import('@/lessons/html-lesson')),
  Text: lazy(() => import('@/lessons/text-lessons')),
  Text3D: lazy(() => import('@/lessons/text-lessons')),
  Image: lazy(() => import('@/lessons/image-lessons')),
  useAspect: lazy(() => import('@/lessons/image-lessons')),
  Svg: lazy(() => import('@/lessons/svg-lesson')),
  Center: lazy(() => import('@/lessons/layout-lessons')),
  Resize: lazy(() => import('@/lessons/layout-lessons')),
  BBAnchor: lazy(() => import('@/lessons/layout-lessons')),
  Bounds: lazy(() => import('@/lessons/bounds-lessons')),
  useBounds: lazy(() => import('@/lessons/bounds-lessons')),
  Billboard: lazy(() => import('@/lessons/screen-lessons')),
  ScreenSpace: lazy(() => import('@/lessons/screen-lessons')),
  ScreenSizer: lazy(() => import('@/lessons/screen-lessons')),
  calculateScaleFactor: lazy(() => import('@/lessons/screen-lessons')),
  Sky: lazy(() => import('@/lessons/atmosphere-lessons')),
  calcPosFromAngles: lazy(() => import('@/lessons/atmosphere-lessons')),
  Stars: lazy(() => import('@/lessons/atmosphere-lessons')),
  Sparkles: lazy(() => import('@/lessons/atmosphere-lessons')),
  Cloud: lazy(() => import('@/lessons/cloud-lessons')),
  CloudInstance: lazy(() => import('@/lessons/cloud-lessons')),
  Clouds: lazy(() => import('@/lessons/cloud-lessons')),
  Environment: lazy(() => import('@/lessons/environment-lessons')),
  EnvironmentCube: lazy(() => import('@/lessons/environment-lessons')),
  EnvironmentMap: lazy(() => import('@/lessons/environment-lessons')),
  EnvironmentPortal: lazy(() => import('@/lessons/environment-lessons')),
  useEnvironment: lazy(() => import('@/lessons/environment-lessons')),
  useBoxProjectedEnv: lazy(() => import('@/lessons/box-projection-lesson')),
  Decal: lazy(() => import('@/lessons/decal-lesson')),
  MeshRefractionMaterial: lazy(() => import('@/lessons/refraction-lesson')),
  MeshReflectorMaterial: lazy(() => import('@/lessons/optical-material-lessons')),
  MeshTransmissionMaterial: lazy(() => import('@/lessons/optical-material-lessons')),
  MeshDiscardMaterial: lazy(() => import('@/lessons/material-layers-lessons')),
  MultiMaterial: lazy(() => import('@/lessons/material-layers-lessons')),
  shaderMaterial: lazy(() => import('@/lessons/shader-shadow-lessons')),
  ShadowAlpha: lazy(() => import('@/lessons/shader-shadow-lessons')),
  Wireframe: lazy(() => import('@/lessons/wireframe-lesson')),
  PointMaterial: lazy(() => import('@/lessons/point-material-lessons')),
  PointMaterialImpl: lazy(() => import('@/lessons/point-material-lessons')),
  useFont: lazy(() => import('@/lessons/font-load-lesson')),
  IsObject: lazy(() => import('@/lessons/is-object-lesson')),
  Preload: lazy(() => import('@/lessons/preload-lesson')),
  Loader: lazy(() => import('@/lessons/progress-lessons')),
  Progress: lazy(() => import('@/lessons/progress-lessons')),
  useProgress: lazy(() => import('@/lessons/progress-lessons')),
  MatcapTexture: lazy(() => import('@/lessons/matcap-lessons')),
  useMatcapTexture: lazy(() => import('@/lessons/matcap-lessons')),
  ScreenVideoTexture: lazy(() => import('@/lessons/media-capture-lessons')),
  WebcamVideoTexture: lazy(() => import('@/lessons/media-capture-lessons')),
  FaceLandmarker: lazy(() => import('@/lessons/face-landmarker-lessons')),
  FaceLandmarkerDefaults: lazy(() => import('@/lessons/face-landmarker-lessons')),
  useFaceLandmarker: lazy(() => import('@/lessons/face-landmarker-lessons')),
  FaceControls: lazy(() => import('@/lessons/face-controls-lessons')),
  useFaceControls: lazy(() => import('@/lessons/face-controls-lessons')),
  Facemesh: lazy(() => import('@/lessons/facemesh-lessons')),
  FacemeshDatas: lazy(() => import('@/lessons/facemesh-lessons')),
  FacemeshEye: lazy(() => import('@/lessons/facemesh-lessons')),
  FacemeshEyeDefaults: lazy(() => import('@/lessons/facemesh-lessons')),
  NormalTexture: lazy(() => import('@/lessons/normal-texture-lessons')),
  useNormalTexture: lazy(() => import('@/lessons/normal-texture-lessons')),
  Ktx2: lazy(() => import('@/lessons/ktx2-lessons')),
  useKTX2: lazy(() => import('@/lessons/ktx2-lessons')),
  Fbx: lazy(() => import('@/lessons/fbx-lessons')),
  useFBX: lazy(() => import('@/lessons/fbx-lessons')),
  Clone: lazy(() => import('@/lessons/gltf-lessons')),
  Gltf: lazy(() => import('@/lessons/gltf-lessons')),
  useGLTF: lazy(() => import('@/lessons/gltf-lessons')),
  CubeTexture: lazy(() => import('@/lessons/cube-texture-lessons')),
  useCubeTexture: lazy(() => import('@/lessons/cube-texture-lessons')),
  PositionalAudio: lazy(() => import('@/lessons/positional-audio-lesson')),
  VideoTexture: lazy(() => import('@/lessons/video-texture-lessons')),
  useVideoTexture: lazy(() => import('@/lessons/video-texture-lessons')),
  Texture: lazy(() => import('@/lessons/texture-load-lessons')),
  useTexture: lazy(() => import('@/lessons/texture-load-lessons')),
  GradientTexture: lazy(() => import('@/lessons/gradient-lessons')),
  GradientType: lazy(() => import('@/lessons/gradient-lessons')),
  Edges: lazy(() => import('@/lessons/surface-basics')),
  Outlines: lazy(() => import('@/lessons/surface-basics')),
  MeshDistortMaterial: lazy(() => import('@/lessons/surface-basics')),
  MeshWobbleMaterial: lazy(() => import('@/lessons/surface-basics')),
  Caustics: lazy(() => import('@/lessons/caustics-lesson')),
  Lightformer: lazy(() => import('@/lessons/lightformer-lesson')),
  SpotLight: lazy(() => import('@/lessons/spotlight-lessons')),
  SpotLightShadow: lazy(() => import('@/lessons/spotlight-lessons')),
  Stage: lazy(() => import('@/lessons/stage-lesson')),
  AccumulativeShadows: lazy(() => import('@/lessons/accumulative-lessons')),
  RandomizedLight: lazy(() => import('@/lessons/accumulative-lessons')),
  accumulativeContext: lazy(() => import('@/lessons/accumulative-lessons')),
  Shadow: lazy(() => import('@/lessons/shadow-basics')),
  ContactShadows: lazy(() => import('@/lessons/shadow-basics')),
  SoftShadows: lazy(() => import('@/lessons/shadow-basics')),
  Backdrop: lazy(() => import('@/lessons/shadow-basics')),
  useAnimations: lazy(() => import('@/lessons/use-animations')),
  Float: lazy(() => import('@/lessons/animation-basics')),
  CameraShake: lazy(() => import('@/lessons/animation-basics')),
  Trail: lazy(() => import('@/lessons/animation-basics')),
  useTrail: lazy(() => import('@/lessons/animation-basics')),
  TrailTexture: lazy(() => import('@/lessons/trail-texture-lessons')),
  useTrailTexture: lazy(() => import('@/lessons/trail-texture-lessons')),
  checkIfFrameIsEmpty: lazy(() => import('@/lessons/sprite-lessons')),
  getFirstFrame: lazy(() => import('@/lessons/sprite-lessons')),
  useSpriteLoader: lazy(() => import('@/lessons/sprite-lessons')),
  SpriteAnimator: lazy(() => import('@/lessons/sprite-lessons')),
  useSpriteAnimator: lazy(() => import('@/lessons/sprite-lessons'))
}

// Catalog search is shared between the home grid and detail navigation.
const useCatalogStore = create((set) => ({ query: '', setQuery: (query) => set({ query }) }))

// A single completion list drives both card badges and navigation indicators.
const ready = new Set(Object.keys(lessons))

// Shared focus styling keeps links and controls visible during keyboard navigation.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500'

// Filter names and translated descriptions with the same rules on both layouts.
function useFilteredGroups () {
  const { t } = useTranslation()
  const query = useCatalogStore((state) => state.query).trim().toLowerCase()
  return groups.map((group) => ({
    ...group,
    items: group.items.filter((name) => `${name} ${t(`exports.${name}`)} ${t(`groups.${group.id}`)}`.toLowerCase().includes(query))
  })).filter((group) => group.items.length)
}

// The header provides a persistent home link, search and language toggle.
function Header () {
  const { t, i18n } = useTranslation()
  const { query, setQuery } = useCatalogStore()
  const chinese = i18n.resolvedLanguage === 'zh'

  return (
    <header className='sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-9'>
      <Link to='/' className={`flex items-center gap-3 ${focus}`}>
        <span className='flex size-9 items-center justify-center rounded-xl bg-indigo-600 font-black text-white shadow-sm shadow-indigo-200'>d</span>
        <span className='text-lg font-semibold tracking-tight'>drei<span className='font-normal text-slate-500'> / 101</span></span>
      </Link>
      <Input type='search' aria-label={t('ui.search')} placeholder={t('ui.search')} value={query} onChange={(event) => setQuery(event.target.value)} className={`order-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm placeholder:text-slate-400 md:order-none md:w-80 ${focus}`} />
      <div className='flex items-center gap-5 text-xs text-slate-600'>
        <span className='hidden font-mono sm:inline'>v10.7.9</span>
        <Button onClick={() => i18n.changeLanguage(chinese ? 'en' : 'zh')} className={`cursor-pointer rounded px-2 py-1 hover:text-indigo-700 ${focus}`}>{chinese ? 'EN' : '中文'}</Button>
      </div>
    </header>
  )
}

// Each export has a stable route even while its demonstration is still pending.
function Catalog () {
  const { t } = useTranslation()
  const filtered = useFilteredGroups()

  return (
    <main className='mx-auto max-w-[1920px] px-5 py-12 md:px-9'>
      <div className='mb-12 flex flex-wrap items-end justify-between gap-6'>
        <div>
          <p className='mb-4 font-mono text-xs tracking-[0.2em] text-indigo-600'>THE DREI COLLECTION</p>
          <h1 className='text-3xl font-medium tracking-tight md:text-5xl'>{t('ui.title')}</h1>
          <p className='mt-4 text-sm text-slate-600'>{t('ui.subtitle')}</p>
        </div>
        <p className='rounded-full border border-indigo-100 bg-white px-4 py-2 font-mono text-xs text-slate-500'><span className='text-indigo-600'>{String(ready.size).padStart(3, '0')}</span> / 218 · {t('ui.ready')}</p>
      </div>
      <div className='space-y-12'>
        {filtered.map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <h2 id={`group-${group.id}`} className='mb-4 flex items-center gap-3 text-sm font-medium'><span className='font-mono text-xs text-slate-500'>{group.id}</span>{t(`groups.${group.id}`)}<span className='rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500'>{group.items.length}</span></h2>
            <div className='grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 min-[1800px]:grid-cols-8'>
              {group.items.map((name) => (
                <Link key={name} to={`/demo/${name}`} className={`group flex min-h-36 min-w-0 flex-col rounded-xl border p-4 transition motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none hover:border-indigo-300 hover:bg-indigo-50/60 hover:shadow-md hover:shadow-indigo-100/60 ${ready.has(name) ? 'border-indigo-300 bg-indigo-50 shadow-sm shadow-indigo-100/60' : 'border-slate-200 bg-white shadow-sm shadow-slate-200/30'} ${focus}`}>
                  <div className='mb-4 flex items-center justify-between text-[10px] text-slate-500'><span className={ready.has(name) ? 'text-indigo-600' : ''}>{t(ready.has(name) ? 'ui.ready' : 'ui.planned')}</span><span className='text-base group-hover:text-indigo-700'>↗</span></div>
                  <h3 className='break-words font-mono text-xs font-medium text-slate-900'>{name}</h3>
                  <p className='mt-2 text-xs leading-relaxed text-slate-500'>{t(`exports.${name}`)}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {!filtered.length && <p className='py-20 text-center text-slate-500'>{t('ui.empty')}</p>}
      </div>
    </main>
  )
}

// Collapsible category navigation reuses the complete catalog on every detail page.
function Sidebar () {
  const { t } = useTranslation()
  const { name } = useParams()
  const filtered = useFilteredGroups()

  return (
    <aside className='border-b border-slate-200 bg-white p-5 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0'>
      <Link to='/' className={`mb-6 inline-block text-xs text-slate-600 hover:text-indigo-700 ${focus}`}>← {t('ui.all')}</Link>
      <nav aria-label={t('ui.navigation')} className='max-h-64 space-y-2 overflow-y-auto lg:max-h-none'>
        {filtered.map((group) => (
          <Disclosure key={`${group.id}-${name}`} defaultOpen={group.items.includes(name)}>
            <DisclosureButton className={`group flex w-full cursor-pointer items-center justify-between rounded py-2 text-left text-xs text-slate-700 ${focus}`}><span>{t(`groups.${group.id}`)}</span><span className='text-slate-500 group-data-open:rotate-90'>›</span></DisclosureButton>
            <DisclosurePanel className='space-y-1 border-l border-slate-200 pl-2'>
              {group.items.map((item) => <NavLink key={item} to={`/demo/${item}`} aria-current={item === name ? 'page' : undefined} className={({ isActive }) => `flex items-center gap-2 break-all rounded px-2 py-2 font-mono text-[11px] ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-700'} ${focus}`}><span className={`size-1 shrink-0 rounded-full ${ready.has(item) ? 'bg-indigo-500' : 'bg-slate-300'}`} />{item}</NavLink>)}
            </DisclosurePanel>
          </Disclosure>
        ))}
        {!filtered.length && <p className='text-xs text-slate-500'>{t('ui.empty')}</p>}
      </nav>
    </aside>
  )
}

// Detail routes preserve navigation and clearly distinguish live demos from planned exports.
function Detail () {
  const { name } = useParams()
  const { t } = useTranslation()
  const group = groups.find((group) => group.items.includes(name))
  const Lesson = lessons[name]
  const docPath = { PerformanceMonitor: 'performances/performance-monitor', usePerformanceMonitor: 'performances/performance-monitor', AdaptiveDpr: 'performances/adaptive-dpr', AdaptiveEvents: 'performances/adaptive-events', meshBounds: 'performances/mesh-bounds', Bvh: 'performances/bvh', useBVH: 'performances/bvh', DetectGPU: 'performances/detect-gpu-use-detect-gpu', useDetectGPU: 'performances/detect-gpu-use-detect-gpu', Stats: 'performances/stats', StatsGl: 'performances/stats-gl', BakeShadows: 'performances/bake-shadows', useIntersect: 'misc/use-intersect', Detailed: 'performances/detailed', useContextBridge: 'misc/use-context-bridge', Grid: 'gizmos/grid', Helper: 'gizmos/helper', useHelper: 'gizmos/helper', GizmoHelper: 'gizmos/gizmo-helper', useGizmoContext: 'gizmos/gizmo-helper', GizmoViewcube: 'gizmos/gizmo-helper', GizmoViewport: 'gizmos/gizmo-helper', Splat: 'loaders/splat', Sampler: 'abstractions/sampler', useSurfaceSampler: 'abstractions/sampler', InstancedAttribute: 'performances/instances', Merged: 'performances/instances', createInstances: 'performances/instances', Instance: 'performances/instances', Instances: 'performances/instances', PositionMesh: 'performances/instances', Segment: 'performances/segments', SegmentObject: 'performances/segments', Segments: 'performances/segments', Point: 'performances/points', Points: 'performances/points', PointsBuffer: 'performances/points', PositionPoint: 'performances/points', View: 'portals/view', MeshPortalMaterial: 'portals/mesh-portal-material', AsciiRenderer: 'misc/ascii-renderer', Effects: 'abstractions/effects', useDepthBuffer: 'misc/use-depth-buffer', Fbo: 'misc/fbo-use-fbo', useFBO: 'misc/fbo-use-fbo', Fisheye: 'portals/fisheye', Hud: 'portals/hud', Mask: 'portals/mask', useMask: 'portals/mask', RenderCubeTexture: 'portals/render-cube-texture', RenderTexture: 'portals/render-texture', PerspectiveCamera: 'cameras/perspective-camera', OrthographicCamera: 'cameras/orthographic-camera', CubeCamera: 'cameras/cube-camera', useCubeCamera: 'cameras/cube-camera', DeviceOrientationControls: 'controls/introduction', FlyControls: 'controls/introduction', MapControls: 'controls/introduction', OrbitControls: 'controls/introduction', TrackballControls: 'controls/introduction', ArcballControls: 'controls/introduction', PointerLockControls: 'controls/introduction', FirstPersonControls: 'controls/introduction', CameraControls: 'controls/camera-controls', CameraControlsImpl: 'controls/camera-controls', useCamera: 'misc/use-camera', CycleRaycast: 'misc/cycle-raycast', useCursor: 'misc/use-cursor', DragControls: 'gizmos/drag-controls', Scroll: 'controls/scroll-controls', ScrollControls: 'controls/scroll-controls', useScroll: 'controls/scroll-controls', KeyboardControls: 'controls/keyboard-controls', useKeyboardControls: 'controls/keyboard-controls', PresentationControls: 'controls/presentation-controls', Select: 'misc/select', useSelect: 'misc/select', MotionPathControls: 'controls/motion-path-controls', useMotion: 'controls/motion-path-controls', TransformControls: 'gizmos/transform-controls', PivotControls: 'gizmos/pivot-controls', QuadraticBezierLine: 'shapes/quadratic-bezier-line', CubicBezierLine: 'shapes/cubic-bezier-line', CatmullRomLine: 'shapes/catmull-rom-line', Line: 'shapes/line', MarchingCube: 'abstractions/marching-cubes', MarchingCubes: 'abstractions/marching-cubes', MarchingPlane: 'abstractions/marching-cubes', CurveModifier: 'modifiers/curve-modifier', Box: 'shapes/mesh', Capsule: 'shapes/mesh', Circle: 'shapes/mesh', Cone: 'shapes/mesh', Cylinder: 'shapes/mesh', Dodecahedron: 'shapes/mesh', Icosahedron: 'shapes/mesh', Octahedron: 'shapes/mesh', Tetrahedron: 'shapes/mesh', Shape: 'shapes/mesh', Extrude: 'shapes/mesh', Lathe: 'shapes/mesh', Plane: 'shapes/mesh', Polyhedron: 'shapes/mesh', Ring: 'shapes/mesh', Sphere: 'shapes/mesh', Torus: 'shapes/mesh', TorusKnot: 'shapes/mesh', Tube: 'shapes/mesh', RoundedBox: 'shapes/rounded-box', RoundedBoxGeometry: 'shapes/rounded-box', ScreenQuad: 'shapes/screen-quad', Html: 'misc/html', Text: 'abstractions/text', Text3D: 'abstractions/text3d', Image: 'abstractions/image', useAspect: 'misc/use-aspect', Svg: 'abstractions/svg', Center: 'staging/center', Resize: 'staging/resize', BBAnchor: 'staging/bb-anchor', Bounds: 'staging/bounds', useBounds: 'staging/bounds', Billboard: 'abstractions/billboard', ScreenSpace: 'abstractions/screen-space', ScreenSizer: 'abstractions/screen-sizer', calculateScaleFactor: 'abstractions/screen-sizer', Sky: 'staging/sky', calcPosFromAngles: 'staging/sky', Stars: 'staging/stars', Sparkles: 'staging/sparkles', Cloud: 'staging/cloud', CloudInstance: 'staging/cloud', Clouds: 'staging/cloud', Environment: 'staging/environment', EnvironmentCube: 'staging/environment', EnvironmentMap: 'staging/environment', EnvironmentPortal: 'staging/environment', useEnvironment: 'staging/use-environment', useBoxProjectedEnv: 'misc/use-box-projected-env', Decal: 'abstractions/decal', FaceLandmarker: 'misc/face-landmarker', FaceLandmarkerDefaults: 'misc/face-landmarker', useFaceLandmarker: 'misc/face-landmarker', FaceControls: 'controls/face-controls', useFaceControls: 'controls/face-controls', Facemesh: 'shapes/facemesh', FacemeshDatas: 'shapes/facemesh', FacemeshEye: 'shapes/facemesh', FacemeshEyeDefaults: 'shapes/facemesh', NormalTexture: 'staging/normal-texture-use-normal-texture', useNormalTexture: 'staging/normal-texture-use-normal-texture', Loader: 'loaders/loader', Progress: 'loaders/progress-use-progress', useProgress: 'loaders/progress-use-progress', MatcapTexture: 'staging/matcap-texture-use-matcap-texture', useMatcapTexture: 'staging/matcap-texture-use-matcap-texture', Preload: 'performances/preload', useFont: 'loaders/use-font', Ktx2: 'loaders/ktx2-use-ktx2', useKTX2: 'loaders/ktx2-use-ktx2', Fbx: 'loaders/fbx-use-fbx', useFBX: 'loaders/fbx-use-fbx', shaderMaterial: 'shaders/shader-material', ShadowAlpha: 'shaders/shader-material', MeshRefractionMaterial: 'shaders/mesh-refraction-material', MeshReflectorMaterial: 'shaders/mesh-reflector-material', MeshTransmissionMaterial: 'shaders/mesh-transmission-material', Wireframe: 'abstractions/wireframe', MeshDiscardMaterial: 'shaders/mesh-discard-material', MultiMaterial: 'shaders/mesh-discard-material', PositionalAudio: 'abstractions/positional-audio', VideoTexture: 'loaders/video-texture-use-video-texture', useVideoTexture: 'loaders/video-texture-use-video-texture', Clone: 'abstractions/clone', Gltf: 'loaders/gltf-use-gltf', useGLTF: 'loaders/gltf-use-gltf', PointMaterial: 'shaders/point-material', PointMaterialImpl: 'shaders/point-material', CubeTexture: 'loaders/cube-texture-use-cube-texture', useCubeTexture: 'loaders/cube-texture-use-cube-texture', Texture: 'loaders/texture-use-texture', useTexture: 'loaders/texture-use-texture', GradientTexture: 'abstractions/gradient-texture', GradientType: 'abstractions/gradient-texture', Edges: 'abstractions/edges', Outlines: 'abstractions/outlines', MeshDistortMaterial: 'shaders/mesh-distort-material', MeshWobbleMaterial: 'shaders/mesh-wobble-material', Caustics: 'staging/caustics', Lightformer: 'staging/lightformer', SpotLight: 'staging/spot-light', SpotLightShadow: 'staging/spot-light-shadow', Stage: 'staging/stage', AccumulativeShadows: 'staging/accumulative-shadows', RandomizedLight: 'staging/randomized-light', accumulativeContext: 'staging/accumulative-shadows', Shadow: 'staging/shadow', ContactShadows: 'staging/contact-shadows', SoftShadows: 'shaders/soft-shadows', Backdrop: 'staging/backdrop', useAnimations: 'abstractions/use-animations', Float: 'staging/float', CameraShake: 'staging/camera-shake', Trail: 'abstractions/trail', useTrail: 'abstractions/trail', TrailTexture: 'misc/trail-texture', useTrailTexture: 'misc/trail-texture', checkIfFrameIsEmpty: 'loaders/use-sprite-loader', getFirstFrame: 'loaders/use-sprite-loader', useSpriteLoader: 'loaders/use-sprite-loader', SpriteAnimator: 'misc/sprite-animator', useSpriteAnimator: 'misc/sprite-animator' }[name]

  return (
    <div className='lg:flex'>
      <Sidebar />
      <main className='min-w-0 flex-1 p-5 md:p-9'>
        <p className='mb-4 text-xs text-slate-500'>{t('ui.catalog')} / {group ? t(`groups.${group.id}`) : '404'}</p>
        <div className='mb-7 flex flex-wrap items-start justify-between gap-4'>
          <div><h1 className='break-all font-mono text-2xl font-medium md:text-3xl'>{name}</h1><p className='mt-3 text-sm text-slate-600'>{group ? t(`exports.${name}`) : t('ui.empty')}</p></div>
          {ready.has(name) && <a href={name === 'ScreenVideoTexture' ? 'https://drei.docs.pmnd.rs/loaders/screen-video-texture' : name === 'WebcamVideoTexture' ? 'https://drei.docs.pmnd.rs/loaders/webcam-video-texture' : name === 'Example' ? 'https://github.com/pmndrs/drei/blob/master/src/core/Example.tsx' : name === 'ComputedAttribute' ? 'https://github.com/pmndrs/drei/blob/master/src/core/ComputedAttribute.tsx' : name === 'isWebGL2Available' ? 'https://github.com/pmndrs/drei/blob/master/src/core/Effects.tsx' : name === 'IsObject' ? 'https://github.com/pmndrs/drei/blob/master/src/core/Texture.tsx' : name === 'ShadowAlpha' ? 'https://github.com/pmndrs/drei/blob/master/src/core/ShadowAlpha.tsx' : name === 'Wireframe' ? 'https://github.com/pmndrs/drei/blob/master/src/core/Wireframe.tsx' : name === 'MultiMaterial' ? 'https://github.com/pmndrs/drei/blob/master/src/core/MultiMaterial.tsx' : name === 'TrailTexture' || name === 'useTrailTexture' ? 'https://github.com/pmndrs/drei/blob/master/src/core/TrailTexture.tsx' : `https://drei.docs.pmnd.rs/${docPath}`} target='_blank' rel='noreferrer' className={`rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:text-indigo-700 ${focus}`}>{t('ui.docs')}</a>}
        </div>
        {ready.has(name)
          ? <Suspense fallback={<p className='p-20 text-slate-500'>{t('ui.loading')}</p>}><Lesson key={name} /></Suspense>
          : <div className='flex min-h-96 flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500'><span className='font-mono text-xs uppercase tracking-widest'>{t('ui.planned')}</span><p>{t(group ? 'ui.pending' : 'ui.empty')}</p><Link to='/demo/PerspectiveCamera' className={`text-indigo-600 ${focus}`}>PerspectiveCamera →</Link></div>}
      </main>
    </div>
  )
}

// Hash routing supports direct links and browser history on static hosting.
export function App () {
  if (window.location.hash === '#/face-live') return <Suspense fallback={null}><FaceControlsLive /></Suspense>
  if (window.location.hash === '#/splat-frame') return <Suspense fallback={null}><SplatFrame /></Suspense>
  if (window.location.hash === '#/face-detector') return <Suspense fallback={null}><FaceLandmarkerFrame /></Suspense>
  if (window.location.hash === '#/capture-screen' || window.location.hash === '#/capture-camera') return <Suspense fallback={null}><MediaCaptureFrame /></Suspense>
  if (window.location.hash === '#/selection-box') return <Suspense fallback={null}><SelectionBoxFrame /></Suspense>
  return <HashRouter><div className='min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900'><Header /><Routes><Route path='/' element={<Catalog />} /><Route path='/demo/:name' element={<Detail />} /><Route path='*' element={<Catalog />} /></Routes></div></HashRouter>
}
