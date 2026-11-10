# The Gaze of Naiwa（dsh-the-gaze-of-naiwa）

右下角的一枚大面积圆形毛玻璃头像，跟着当前会话的智能体状态切换：

- **空闲**：侧脸奶娃（用户提供的图二），轻微呼吸缩放，薄荷绿状态点。
- **思考**：托腮奶娃（用户提供的图一），冷色柔光环绕，右上角毛玻璃三点气泡，冰蓝状态点。

点击头像会冒出一句深色毛玻璃气泡；鼠标悬停有状态提示。全部界面文字走 DSH locale（中文／英文）。

## 状态来源

Client 半从 `ctx.get('uiSession')` 读取：

- `uiSession.current`：主视图当前绑定的会话；
- `uiSession.sessionStatus`：该会话的 `running` 标记。

两者都变化时重新取快照，因此新建会话、切会话、发出消息、任务结束都会立即反映到表情上。打开设置页（Conversation 卸载）时会记住最后一个主会话，不会误判为空闲。没有 `uiSession` 服务时退化为永久空闲，不影响页面其他部分。

## 尺寸与质感

- 悬浮窗面积约为上一版的 **2 倍**：160×160 的正圆（窄屏 120×120），固定在右下角。
- **单层**：没有内外两层容器，头像直接铺满整圆；只有一层圆形玻璃盘。
- 玻璃盘：`backdrop-filter: blur(22px) saturate(150%)`、冷白半透明底、1px 白色高光边、内外双层阴影，再加一层极淡的噪点纹理。
- 圆内有一层柔和的环形渐变，把头像边缘晕进玻璃；左上角有一道很淡的玻璃高光。没有橙色边框或橙色点缀。
- 两张素材都归一化为 `256×256`，头部轮廓宽度约 65%，头部中心落在画布正中心；切换时交叉淡入淡出。

## 结构

| 文件 | 作用 |
| --- | --- |
| `client.js` | 浏览器半：注册 `shell.overlay` 条目、状态源、React 组件与毛玻璃样式。 |
| `assets/idle-ff4644c1.png` | 待机头像（256×256，用户提供的图二）。 |
| `assets/thinking-ae35492d.png` | 思考头像（256×256，用户提供的图一）。 |
| `index.js` | Host 半为空实现（纯 Client 插件）。 |
| `cordis.patch.yml` | 向 profile 插入 `the-gaze-of-naiwa` 行。 |
| `locale/{zh,en}.json` | 插件管理页的标题、描述与文案。 |
| `icon.png` | 插件管理页图标（同款圆形玻璃头像）。 |

## 素材

头像素材由用户提供；只做了等比缩放、头部居中和轻微锐化，没有拉伸。插件本身不引用任何外链图片。

## 安装

```powershell
dsh plugin --profile desktop add "file:C:\path\to\dsh-the-gaze-of-naiwa-1.0.0.tgz"
```

或直接把这个目录交给 profile 的插件管理器安装。

## 说明

- 悬浮窗固定在视口右下角（`right/bottom: 24px`，窄屏 14px），不占用布局空间。
- 头像用 `overflow: hidden` 裁成正圆；光晕、状态气泡可以溢出圆外。
- 深色主题会自动切换为深色玻璃底和更深的边缘渐变。
- 所有动画都遵守 `prefers-reduced-motion`。
