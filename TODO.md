# Drei 演示 TODO

基准：本项目已安装的 `@react-three/drei 10.7.9`，Web 主入口 `@react-three/drei`。共 **218 个运行时导出，其中 39 个 Hook**；不包含 TypeScript 类型和额外子路径。升级依赖后重新核对清单。

按功能组建设演示页；同一页可以覆盖多个导出。下方逐项勾选表示该导出的行为已经得到验证，不只是完成 import。实现类、Context、默认配置和工具函数可以放在相关功能页中验证，并记录对应位置。

## 公共基础

- [x] 建立分类导航、功能搜索和独立页面路由。
- [ ] 建立功能目录，记录导出名、页面路径、完成状态和官方文档链接。
- [ ] 统一页面结构：可操作场景、参数、重置、效果对照和相关结果指标。
- [ ] 准备模型、字体、纹理、视频、音频、精灵和 Splat 素材，记录来源与许可。
- [ ] 场景按需加载，切换页面时释放资源、停止媒体并恢复全局渲染设置。
- [ ] UI 使用 react-i18next；共享状态使用 Zustand；控件遵循 docs/headless-ui.md。
- [ ] 遵守 1 单位 = 1 米、默认无环境光、纹理 hex tiling 等 AGENTS.md 规则。

## 当前进度

- 首页：分组卡片目录，桌面 6 列、超宽屏 8 列。
- 详情：左侧可折叠分组导航；全部导出具有独立地址，未实现项显示待办状态。
- 首个演示：`/#/demo/PerspectiveCamera`，已实现 FOV、距离、近远裁剪面、镜头预设与重置。
- 学习页：已按「概念初识、设计缘由、交互演示、应用场景、使用边界、代码解读、参数解析」组织，附章节导航、实验步骤和实时相机代码。
- 相机组已实现 15 个导出的独立学习页；13 项已验证主要桌面交互，设备方向真机与鼠标锁定仍有环境相关验收项。
- 交互组已实现 15 个导出的独立学习页，覆盖拖拽、选择、键盘、滚动、路径和变换；主要桌面操作已验证，框选、触屏、窄屏及部分输入边界仍待验收。

## 功能演示与导出覆盖

### 01 相机与相机控制

- [ ] 演示目标：比较透视与正交；验证旋转、缩放、平移、飞行、第一人称和相机切换。
- [ ] 记录页面路径、操作步骤和可观察结果。

- [x] `OrthographicCamera`
- [x] `PerspectiveCamera`
- [x] `CubeCamera`
- [x] `useCubeCamera`
- [ ] `DeviceOrientationControls`
- [x] `FlyControls`
- [x] `MapControls`
- [x] `OrbitControls`
- [x] `TrackballControls`
- [x] `ArcballControls`
- [ ] `PointerLockControls`
- [x] `FirstPersonControls`
- [x] `CameraControls`
- [x] `CameraControlsImpl`
- [x] `useCamera`

### 02 交互、滚动与运动路径

- [ ] 演示目标：验证拖拽和变换、键盘响应、重叠物体拾取、框选、滚动进度与路径运动。

- [x] `CycleRaycast`
- [x] `useCursor`
- [x] `DragControls`
- [x] `Scroll`
- [x] `ScrollControls`
- [x] `useScroll`
- [x] `PresentationControls`
- [x] `KeyboardControls`
- [x] `useKeyboardControls`
- [ ] `Select`
- [x] `useSelect`
- [x] `TransformControls`
- [x] `MotionPathControls`
- [x] `useMotion`
- [x] `PivotControls`

### 03 几何体与曲线

- [x] 演示目标：为每种形状提供参数；验证圆角、曲线控制点、融合曲面及沿曲线变形。

- [x] `QuadraticBezierLine`
- [x] `CubicBezierLine`
- [x] `CatmullRomLine`
- [x] `Line`
- [x] `MarchingCube`
- [x] `MarchingCubes`
- [x] `MarchingPlane`
- [x] `CurveModifier`
- [x] `Box`
- [x] `Capsule`
- [x] `Circle`
- [x] `Cone`
- [x] `Cylinder`
- [x] `Dodecahedron`
- [x] `Extrude`
- [x] `Icosahedron`
- [x] `Lathe`
- [x] `Octahedron`
- [x] `Plane`
- [x] `Polyhedron`
- [x] `Ring`
- [x] `Shape`
- [x] `Sphere`
- [x] `Tetrahedron`
- [x] `Torus`
- [x] `TorusKnot`
- [x] `Tube`
- [x] `RoundedBox`
- [x] `RoundedBoxGeometry`
- [x] `ScreenQuad`

### 04 文字、图像与 DOM

- [x] 演示目标：验证文字排版、立体文字、HTML 跟随与遮挡、图片裁切、SVG 和宽高比适配。

- [x] `Html`
- [x] `Text`
- [x] `Text3D`
- [x] `Image`
- [x] `Svg`
- [x] `useAspect`

### 05 布局、取景与屏幕空间

- [x] 演示目标：切换模型尺寸和视口，验证居中、尺寸适配、自动取景、边界锚点、朝向相机与屏幕尺寸。

- [x] `Billboard`
- [x] `ScreenSpace`
- [x] `ScreenSizer`
- [x] `BBAnchor`
- [x] `Center`
- [x] `Resize`
- [x] `Bounds`
- [x] `useBounds`
- [x] `calculateScaleFactor`

### 06 材质与表面效果

- [x] 演示目标：对照启用前后效果；提供形变、反射、折射、透射、贴花、轮廓及自定义材质参数。

- [x] `Edges`
- [x] `Outlines`
- [x] `Decal`
- [x] `MeshDistortMaterial`
- [x] `MeshWobbleMaterial`
- [x] `MeshReflectorMaterial`
- [x] `MeshRefractionMaterial`
- [x] `MeshTransmissionMaterial`
- [x] `MeshDiscardMaterial`
- [x] `MultiMaterial`
- [x] `PointMaterial`
- [x] `PointMaterialImpl`
- [x] `shaderMaterial`
- [x] `Wireframe`
- [x] `ShadowAlpha`

### 07 光照、阴影与舞台

- [x] 演示目标：通过移动光源和物体验证接触阴影、累积阴影、软阴影、聚光灯、焦散和舞台组合；遵守项目的环境光约束。

- [x] `SoftShadows`
- [x] `Stage`
- [x] `Backdrop`
- [x] `Shadow`
- [x] `Caustics`
- [x] `ContactShadows`
- [x] `AccumulativeShadows`
- [x] `RandomizedLight`
- [x] `accumulativeContext`
- [x] `SpotLight`
- [x] `SpotLightShadow`
- [x] `Lightformer`

### 08 环境、天空与粒子

- [x] 演示目标：分别验证背景和环境反射、盒投影修正、太阳位置、星空、云和闪烁粒子。

- [x] `useBoxProjectedEnv`
- [x] `Environment`
- [x] `EnvironmentCube`
- [x] `EnvironmentMap`
- [x] `EnvironmentPortal`
- [x] `Sky`
- [x] `calcPosFromAngles`
- [x] `Stars`
- [x] `Cloud`
- [x] `CloudInstance`
- [x] `Clouds`
- [x] `Sparkles`
- [x] `useEnvironment`

### 09 动画、拖尾与精灵

- [x] 演示目标：验证漂浮、镜头抖动、运动拖尾、交互纹理、精灵播放和模型动画切换。

- [x] `Trail`
- [x] `useTrail`
- [x] `checkIfFrameIsEmpty`
- [x] `getFirstFrame`
- [x] `useSpriteLoader`
- [x] `useAnimations`
- [x] `TrailTexture`
- [x] `useTrailTexture`
- [x] `SpriteAnimator`
- [x] `useSpriteAnimator`
- [x] `CameraShake`
- [x] `Float`

### 10 模型、纹理与加载

- [x] 演示目标：使用明确的模型和贴图资源，验证加载、克隆、缓存、预加载、进度及失败状态。

- [x] `Loader`
- [x] `GradientTexture`
- [x] `GradientType`
- [x] `Clone`
- [x] `Gltf`
- [x] `useGLTF`
- [x] `CubeTexture`
- [x] `useCubeTexture`
- [x] `Fbx`
- [x] `useFBX`
- [x] `Ktx2`
- [x] `useKTX2`
- [x] `Progress`
- [x] `useProgress`
- [x] `IsObject`
- [x] `Texture`
- [x] `useTexture`
- [x] `VideoTexture`
- [x] `useVideoTexture`
- [x] `useFont`
- [x] `MatcapTexture`
- [x] `useMatcapTexture`
- [x] `NormalTexture`
- [x] `useNormalTexture`
- [x] `Preload`

### 11 视频、音频与人脸

- [ ] 演示目标：通过用户操作启动音频或请求屏幕、摄像头权限；验证空间音频、视频纹理、人脸网格和头部控制，并处理拒绝权限的状态。
- [ ] 验收记录：[11 视频、音频与人脸](docs/11-validation.md)。

- [ ] `PositionalAudio`
- [ ] `ScreenVideoTexture`
- [x] `WebcamVideoTexture`
- [x] `FaceControls`
- [x] `useFaceControls`
- [x] `FaceLandmarker`
- [x] `FaceLandmarkerDefaults`
- [x] `useFaceLandmarker`
- [x] `Facemesh`
- [x] `FacemeshDatas`
- [x] `FacemeshEye`
- [x] `FacemeshEyeDefaults`

### 12 离屏渲染、多视图与合成

[12–15 验收记录](docs/12-15-validation.md)

- [x] 演示目标：展示渲染目标及深度结果；验证遮罩、多视图、HUD、鱼眼、传送门、后期和 ASCII 输出。
- [x] 记录页面路径、操作步骤和可观察结果。

- [x] `Effects`
- [x] `isWebGL2Available`
- [x] `AsciiRenderer`
- [x] `useDepthBuffer`
- [x] `Fbo`
- [x] `useFBO`
- [x] `RenderTexture`
- [x] `RenderCubeTexture`
- [x] `Mask`
- [x] `useMask`
- [x] `Hud`
- [x] `Fisheye`
- [x] `MeshPortalMaterial`
- [x] `View`

### 13 实例化、点云与表面采样

- [x] 演示目标：调整数量并观察 draw calls；验证实例属性、点云、线段、表面采样、自定义属性及高斯泼溅资源。
- [x] 记录页面路径、操作步骤和可观察结果。

- [x] `Sampler`
- [x] `useSurfaceSampler`
- [x] `ComputedAttribute`
- [x] `Splat`
- [x] `Point`
- [x] `Points`
- [x] `PointsBuffer`
- [x] `PositionPoint`
- [x] `Instance`
- [x] `InstancedAttribute`
- [x] `Instances`
- [x] `Merged`
- [x] `PositionMesh`
- [x] `createInstances`
- [x] `Segment`
- [x] `SegmentObject`
- [x] `Segments`

### 14 性能、检测与调试

- [x] 演示目标：用适当规模场景验证 LOD、拾取加速、DPR 和事件自适应、阴影烘焙；展示性能、GPU 检测、可见性和方向辅助。
- [x] 记录页面路径、操作步骤和可观察结果。

- [x] `GizmoHelper`
- [x] `useGizmoContext`
- [x] `GizmoViewcube`
- [x] `GizmoViewport`
- [x] `Grid`
- [x] `Helper`
- [x] `useHelper`
- [x] `Stats`
- [x] `StatsGl`
- [x] `DetectGPU`
- [x] `useDetectGPU`
- [x] `Bvh`
- [x] `useBVH`
- [x] `useIntersect`
- [x] `Detailed`
- [x] `BakeShadows`
- [x] `meshBounds`
- [x] `AdaptiveDpr`
- [x] `AdaptiveEvents`
- [x] `PerformanceMonitor`
- [x] `usePerformanceMonitor`

### 15 上下文与辅助导出

- [x] 演示目标：验证 React 上下文跨 Canvas 传递；检查 Example 的实际实现并展示其行为。
- [x] 记录页面路径、操作步骤和可观察结果。

- [x] `useContextBridge`
- [x] `Example`

## 完成检查

- [ ] 所有 218 个运行时导出均有对应演示位置和验证记录。
- [ ] 组件与 Hook 分别验证；组合页不能掩盖未覆盖的 API。
- [ ] 性能类功能提供前后指标；加载类功能提供加载状态；交互类功能提供状态反馈。
- [ ] 验证窄屏、视口变化、页面切换、重置和资源失败状态。
- [ ] 对设备、浏览器或权限有要求的功能，标明条件并提供状态提示。
- [ ] 只有用户明确要求时运行 build/lint/test；不运行 pnpm dev。

## 参考

- [官方文档](https://drei.docs.pmnd.rs/)
- [官方源码](https://github.com/pmndrs/drei)
- 精确版本依据：本地 node_modules/@react-three/drei/index.js 与 package.json。
