# 12–15 验收记录

以下记录为浏览器中实际观察到的结果；设备相关的性能数值仅用于本次对照。

## 12 离屏渲染、多视图与合成

- `/#/demo/Fbo`：将目标尺寸降至 64、旋转速度设为 0，画面呈现低分辨率的静止纹理；重置恢复默认设置。
- `/#/demo/useFBO`：将目标尺寸降至 64、旋转速度设为 0，画面呈现低分辨率的静止纹理。
- `/#/demo/useDepthBuffer`：移动球体靠近捕获相机，深度图中的球体变亮、变大；修正相机比例后球体不再被压扁。
- `/#/demo/RenderTexture`：方形纹理中的独立场景正常显示，捕获相机使用 1:1 比例。
- `/#/demo/RenderCubeTexture`：移动橙色方块，金属球上的橙色反射随之移动。
- `/#/demo/Mask`：切换内外遮罩，条纹分别显示在圆内和圆外。
- `/#/demo/useMask`：切换遮罩方向后，条纹显示在圆外。
- `/#/demo/Hud`：切换 HUD，右上角标记出现或消失。
- `/#/demo/Fisheye`：切换鱼眼与普通视图，网格及物体边缘的投影发生变化。
- `/#/demo/MeshPortalMaterial`：将 blend 从 0 调至 1，圆形入口过渡为完整子场景。
- `/#/demo/Effects`：关闭灰度处理后，球体和方块恢复颜色。
- `/#/demo/isWebGL2Available`：当前浏览器返回 true，重新检测后仍显示 true。
- `/#/demo/AsciiRenderer`：开启时场景以字符画显示。
- `/#/demo/View`：窄屏下两个视图纵向排列，各自内容可见。

## 13 实例化、点云与表面采样

- `/#/demo/Instance`：50 个物体由实例化切换为独立网格后，绘制调用从 1 变为 50。
- `/#/demo/PositionMesh`：实例模式的 ref 类型检查为真，绘制调用为 1。
- `/#/demo/Merged`、`/#/demo/createInstances`：将每种物体数量从 12 增至 14，两个批次仍为 2 次绘制。
- `/#/demo/Instances`：100 个独立网格为 100 次绘制，切换实例化后为 1 次；`PositionMesh` 类型检查为真。
- `/#/demo/InstancedAttribute`：提高热度偏移后，实例由渐变色变为橙色，绘制调用保持 1 次。
- `/#/demo/Points`：选中第 100 个点，再将数量减少至 20，选中编号清除；`PositionPoint` 类型检查为真。
- `/#/demo/Point`、`/#/demo/PositionPoint`：点云显示 100 个点、1 次绘制，ref 类型检查为真。
- `/#/demo/PointsBuffer`：缓冲点云正常显示，绘制调用为 1 次。
- `/#/demo/Segments`：线段正常显示，绘制调用为 1 次，`SegmentObject` 类型检查为真。
- `/#/demo/Segment`：线段数量从 24 增至 28，绘制调用仍为 1 次。
- `/#/demo/SegmentObject`：线段 ref 类型检查为真，绘制调用为 1 次。
- `/#/demo/Sampler`、`/#/demo/useSurfaceSampler`：球面显示采样点；数量调整与重新采样会改变分布。
- `/#/demo/ComputedAttribute`：移动阈值后，平面颜色边界随之移动。
- `/#/demo/Splat`：资源正常显示；模拟资源校验失败时显示错误。离开页面后嵌入文档被移除，返回后重新渲染；worker 和内存释放未直接测量。

## 14 性能、检测与调试

- `/#/demo/GizmoHelper`：切换按钮后，方向辅助从坐标轴切换为视图立方体。
- `/#/demo/GizmoViewcube`、`/#/demo/GizmoViewport`：点击立方体正面或 Z 轴后，场景相机转向正面。
- `/#/demo/Grid`：网格间距从 1 m 调至 1.25 m。
- `/#/demo/Helper`：关闭辅助线后，按钮状态切换为隐藏。
- `/#/demo/useHelper`：光源水平位置从 3 m 调至 3.5 m，辅助线保持开启。
- `/#/demo/Stats`、`/#/demo/StatsGl`：将独立网格从 100 增至 120 后，每帧绘制调用随之变为 120；StatsGl 面板显示实时指标。
- `/#/demo/Bvh`：100 条射线两种模式均命中 40 次；本次普通拾取约 570 ms，BVH 约 1.2 ms，不含构建时间。
- `/#/demo/useBVH`：同一组 100 条射线两种模式均命中 24 次；本次普通拾取 65.50 ms，BVH 0.40 ms，不含构建时间。
- `/#/demo/meshBounds`：射线指向圆环中心孔时，精确拾取未命中、包围体拾取命中；200 条射线分别命中 104 次和 136 次。
- `/#/demo/Detailed`：距离 5、10、20 米时分别显示高、中、低层级，三角面数为 2976、352、20。
- `/#/demo/AdaptiveDpr`：触发降级后性能系数从 1 变为 0.5，DPR 从 2 变为 1，随后恢复。
- `/#/demo/AdaptiveEvents`：触发降级后事件状态显示关闭。
- `/#/demo/BakeShadows`：冻结后移动物体，阴影留在原位；恢复后阴影跟随，绘制调用从 2 回到 3。
- `/#/demo/useIntersect`：物体移出视野后状态为未渲染，重置后恢复已渲染。
- `/#/demo/useGizmoContext`：点击方向辅助，点击计数增加且相机转向正 Z。
- `/#/demo/DetectGPU`：检测完成并显示等级、结果类型和设备信息；估计帧率不是该场景的实时帧率。
- `/#/demo/useDetectGPU`：检测完成，显示性能等级、检测类型和 GPU 等字段。
- `/#/demo/PerformanceMonitor`、`/#/demo/usePerformanceMonitor`：开启人工负载后，采样约 28 FPS，最近回调变为下降，质量系数降低。

## 15 上下文与辅助导出

- `/#/demo/useContextBridge`：将外部上下文颜色切换为橙色，Canvas 中方块随之变橙；重置恢复靛蓝。
- `/#/demo/Example`：点击加一，面板计数与三维数字都从 0 变为 1。
