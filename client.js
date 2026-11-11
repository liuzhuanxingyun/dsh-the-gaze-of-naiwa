window.__ModuleLoader__.load({
  id: 'dsh-the-gaze-of-naiwa',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useLayoutEffect, useRef, useState } = React;

    const NS = 'the-gaze-of-naiwa';
    const ZH = {
      'aria.idle': '奶娃空闲中',
      'aria.thinking': '奶娃正在思考',
      'aria.drag': '拖动可移动',
      'aria.menu': '右键调整大小',
      'bubble.idle': '在呢，等你派活~',
      'bubble.thinking': '让我想想…',
      'menu.size': '大小',
      'menu.done': '完成',
      'menu.hint': '拖动头像移动位置',
    };
    const EN = {
      'aria.idle': 'Naiwa is idle',
      'aria.thinking': 'Naiwa is thinking',
      'aria.drag': 'Drag to move',
      'aria.menu': 'Right-click to resize',
      'bubble.idle': 'Here. What are we making?',
      'bubble.thinking': 'Let me think…',
      'menu.size': 'Size',
      'menu.done': 'Done',
      'menu.hint': 'Drag the avatar to move',
    };

    // The Host serves exported package assets under /plugins/<package>/assets/.
    // require.asset keeps that path correct for whichever mount the GUI uses.
    const asset = (file) => {
      const path = `plugins/dsh-the-gaze-of-naiwa/assets/${file}`;
      try {
        return typeof require.asset === 'function' ? require.asset(path) : path;
      } catch {
        return path;
      }
    };
    const IDLE_SRC = asset('idle-d8539753.png');
    const THINKING_SRC = asset('thinking-c402b758.png');

    const CSS = `
.naiwa-float{--naiwa-size:calc(clamp(120px,18vmin,250px) * var(--naiwa-scale, 1));position:absolute;left:0;top:0;z-index:40;width:var(--naiwa-size);height:var(--naiwa-size);pointer-events:none;will-change:left,top;font-family:var(--dsw-font-family-ui,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif);}
.naiwa-button{position:relative;display:block;width:100%;height:100%;padding:0;border:0;border-radius:50%;background:transparent;cursor:grab;touch-action:none;pointer-events:auto;transition:transform .26s cubic-bezier(.2,.8,.3,1.2);-webkit-tap-highlight-color:transparent;}
.naiwa-button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#5b8def);outline-offset:7px;border-radius:50%;}
.naiwa-button:active{transform:scale(.975);cursor:grabbing;}
.naiwa-float[data-dragging="true"] .naiwa-button{transform:none;cursor:grabbing;}
.naiwa-float[data-dragging="true"] .naiwa-photo{animation:none;}
.naiwa-aura{position:absolute;inset:calc(var(--naiwa-size) * -0.075);border-radius:50%;background:conic-gradient(from 0deg,rgba(120,170,255,0),rgba(120,170,255,.55),rgba(185,160,255,.35),rgba(120,170,255,0) 72%);filter:blur(calc(var(--naiwa-size) * .07));opacity:0;z-index:0;animation:naiwa-spin 8s linear infinite;transition:opacity .45s ease;pointer-events:none;}
.naiwa-float[data-thinking="true"] .naiwa-aura{opacity:.8;}
.naiwa-disc{position:absolute;inset:0;box-sizing:border-box;border-radius:50%;overflow:hidden;background:rgba(232,240,252,.30);backdrop-filter:blur(22px) saturate(150%);-webkit-backdrop-filter:blur(22px) saturate(150%);border:1px solid rgba(255,255,255,.65);box-shadow:0 24px 56px -18px rgba(18,22,30,.32),0 8px 20px rgba(18,22,30,.10),inset 0 1px 0 rgba(255,255,255,.70),inset 0 -1px 0 rgba(255,255,255,.15);z-index:1;transition:box-shadow .26s ease;}
.naiwa-button:hover .naiwa-disc{box-shadow:0 30px 68px -18px rgba(18,22,30,.38),0 10px 24px rgba(18,22,30,.12),inset 0 1px 0 rgba(255,255,255,.78),inset 0 -1px 0 rgba(255,255,255,.18);}
.naiwa-photo{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;border-radius:50%;transition:opacity .36s ease;will-change:opacity,transform;user-select:none;-webkit-user-drag:none;}
.naiwa-photo-idle{animation:naiwa-idle-breathe 5s ease-in-out infinite;}
.naiwa-photo-thinking{animation:naiwa-think-breathe 3.6s ease-in-out infinite;}
.naiwa-photo.naiwa-off{opacity:0;}
.naiwa-vignette{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 44%,rgba(255,255,255,0) 56%,rgba(226,236,252,.14) 76%,rgba(212,226,248,.40) 100%);box-shadow:inset 0 0 30px rgba(255,255,255,.40);pointer-events:none;z-index:2;}
.naiwa-sheen{position:absolute;inset:0;border-radius:50%;background:linear-gradient(135deg,rgba(255,255,255,.32),rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08));pointer-events:none;z-index:3;mix-blend-mode:screen;opacity:.55;}
.naiwa-grain{position:absolute;inset:0;border-radius:50%;pointer-events:none;opacity:.04;mix-blend-mode:overlay;z-index:4;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");background-size:120px 120px;}
.naiwa-think-pill{position:absolute;top:-10px;right:-8px;display:flex;align-items:center;gap:4px;padding:7px 9px;border-radius:14px;background:rgba(255,255,255,.62);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(255,255,255,.72);box-shadow:0 8px 22px rgba(30,40,60,.18);opacity:0;transform:translateY(5px) scale(.88);transform-origin:bottom right;transition:opacity .24s ease,transform .24s cubic-bezier(.2,.9,.3,1.2);pointer-events:none;z-index:7;}
.naiwa-float[data-thinking="true"] .naiwa-think-pill{opacity:1;transform:translateY(0) scale(1);}
.naiwa-think-pill i{display:block;width:4.5px;height:4.5px;border-radius:50%;background:#7FA8FF;animation:naiwa-tdot 1.2s ease-in-out infinite;}
.naiwa-think-pill i:nth-child(2){animation-delay:.16s;}
.naiwa-think-pill i:nth-child(3){animation-delay:.32s;}
.naiwa-bubble{position:absolute;right:4px;top:calc(100% + 16px);box-sizing:border-box;width:max-content;max-width:260px;padding:10px 14px;border-radius:16px;background:rgba(28,30,36,.78);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);border:1px solid rgba(255,255,255,.16);color:#F6F8FB;font-size:13px;line-height:1.5;text-align:left;white-space:normal;box-shadow:0 18px 44px rgba(0,0,0,.30);pointer-events:none;animation:naiwa-bubble-in .22s ease-out;}
.naiwa-bubble::after{content:"";position:absolute;right:28px;top:auto;bottom:100%;border:7px solid transparent;border-bottom-color:rgba(28,30,36,.78);}
.naiwa-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;}
body[data-ds-dark-theme] .naiwa-disc{background:rgba(24,28,38,.35);border-color:rgba(255,255,255,.22);box-shadow:0 24px 56px -18px rgba(0,0,0,.65),0 8px 20px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(255,255,255,.05);}
body[data-ds-dark-theme] .naiwa-button:hover .naiwa-disc{box-shadow:0 30px 68px -18px rgba(0,0,0,.75),0 10px 24px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(255,255,255,.06);}
body[data-ds-dark-theme] .naiwa-vignette{background:radial-gradient(circle at 50% 44%,rgba(0,0,0,0) 48%,rgba(14,20,30,.25) 72%,rgba(10,14,22,.58) 100%);box-shadow:inset 0 0 34px rgba(0,0,0,.35);}
body[data-ds-dark-theme] .naiwa-sheen{opacity:.35;}
body[data-ds-dark-theme] .naiwa-think-pill{background:rgba(30,34,44,.62);border-color:rgba(255,255,255,.20);box-shadow:0 8px 22px rgba(0,0,0,.35);}
body[data-ds-dark-theme] .naiwa-think-pill i{background:#A9C6FF;}
body[data-ds-dark-theme] .naiwa-bubble{background:rgba(20,22,28,.82);border-color:rgba(255,255,255,.14);}
body[data-ds-dark-theme] .naiwa-bubble::after{border-bottom-color:rgba(20,22,28,.82);}
.naiwa-float[data-bubble-up="true"] .naiwa-bubble{top:auto;bottom:calc(100% + 16px);}
.naiwa-float[data-bubble-up="true"] .naiwa-bubble::after{top:100%;bottom:auto;border-bottom-color:transparent;border-top-color:rgba(28,30,36,.78);}
body[data-ds-dark-theme] .naiwa-float[data-bubble-up="true"] .naiwa-bubble::after{border-top-color:rgba(20,22,28,.82);}
.naiwa-float[data-bubble-left="true"] .naiwa-bubble{right:auto;left:4px;}
.naiwa-float[data-bubble-left="true"] .naiwa-bubble::after{right:auto;left:28px;}
.naiwa-menu{position:absolute;right:0;top:calc(100% + 10px);box-sizing:border-box;width:220px;padding:12px;border-radius:16px;background:rgba(28,30,36,.88);backdrop-filter:blur(22px) saturate(150%);-webkit-backdrop-filter:blur(22px) saturate(150%);border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 48px rgba(0,0,0,.36);color:#F6F8FB;pointer-events:auto;z-index:20;animation:naiwa-menu-in .18s ease-out;}
.naiwa-float[data-bubble-up="true"] .naiwa-menu{top:auto;bottom:calc(100% + 10px);}
.naiwa-float[data-bubble-left="true"] .naiwa-menu{right:auto;left:0;}
.naiwa-menu-head{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:rgba(246,248,251,.68);}
.naiwa-menu-pct{font-variant-numeric:tabular-nums;color:#A9C6FF;font-size:12.5px;}
.naiwa-range{width:100%;height:20px;margin:8px 0 2px;accent-color:#7FB6FF;cursor:pointer;}
.naiwa-presets{display:flex;gap:6px;margin:6px 0 10px;}
.naiwa-preset{flex:1;padding:5px 0;border-radius:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#F6F8FB;font:inherit;font-size:11px;cursor:pointer;}
.naiwa-preset[data-active="true"]{border-color:rgba(127,182,255,.7);background:rgba(127,182,255,.22);color:#FFFFFF;}
.naiwa-menu-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid rgba(255,255,255,.10);padding-top:8px;}
.naiwa-menu-hint{font-size:10.5px;line-height:1.3;color:rgba(246,248,251,.42);}
.naiwa-done{border:0;background:rgba(127,182,255,.20);color:#DCE9FF;font:inherit;font-size:11.5px;padding:4px 9px;border-radius:8px;cursor:pointer;white-space:nowrap;}
@media (hover:hover){.naiwa-button:hover{transform:translateY(-2px) scale(1.02);}}
@media (max-width:720px){
  .naiwa-think-pill{top:-8px;right:-6px;padding:6px 8px;border-radius:12px;}
  .naiwa-bubble{max-width:min(220px,70vw);font-size:12px;padding:9px 12px;}
}
@keyframes naiwa-idle-breathe{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.012) translateY(-1px)}}
@keyframes naiwa-think-breathe{0%,100%{transform:scale(1.008)}50%{transform:scale(1.02)}}
@keyframes naiwa-spin{to{transform:rotate(360deg)}}
@keyframes naiwa-tdot{0%,100%{opacity:.35;transform:translateY(0)}45%{opacity:1;transform:translateY(-1.5px)}}
@keyframes naiwa-bubble-in{from{opacity:0;transform:translateY(4px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes naiwa-menu-in{from{opacity:0;transform:translateY(4px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@media (prefers-reduced-motion:reduce){
  .naiwa-float *, .naiwa-float *::before, .naiwa-float *::after{animation:none !important;transition:none !important;}
}
`;

    /**
     * A root-scoped boolean source for "the main Session's agent is running".
     * `uiSession.current` tracks the session shown in the main view; its
     * `sessionStatus` map carries the running flag for every session.
     */
    function createThinkingSource(session) {
      const current = session && session.current;
      const status = session && session.sessionStatus;
      if (!current || !status) {
        return { subscribe: () => () => {}, getSnapshot: () => false };
      }
      // Remember the last main-view session so opening Settings (which unmounts
      // the Conversation) does not make a running agent look idle.
      const currentId = () => {
        const snapshot = current.getSnapshot();
        return snapshot && snapshot.key;
      };
      let lastId = currentId();
      return {
        subscribe(listener) {
          const onCurrent = () => {
            const id = currentId();
            if (id !== undefined) lastId = id;
            listener();
          };
          const offCurrent = current.subscribe(onCurrent);
          const offStatus = status.subscribe(listener);
          return () => {
            offCurrent();
            offStatus();
          };
        },
        getSnapshot() {
          if (lastId === undefined) return false;
          const row = status.getSnapshot().get(lastId);
          return row !== undefined && row.running === true;
        },
      };
    }

    function tr(t, key, fallback) {
      if (typeof t !== 'function') return fallback;
      const value = t(key);
      return value === undefined || value === null || value === '' ? fallback : value;
    }

    const POS_KEY = 'dsh-the-gaze-of-naiwa:pos-v1';
    const PAD = 18;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function readPosition() {
      try {
        const raw = window.localStorage.getItem(POS_KEY);
        if (!raw) return null;
        const value = JSON.parse(raw);
        if (value && typeof value.x === 'number' && typeof value.y === 'number') {
          return { x: clamp(value.x, 0, 1), y: clamp(value.y, 0, 1) };
        }
      } catch {}
      return null;
    }

    function writePosition(value) {
      try {
        window.localStorage.setItem(POS_KEY, JSON.stringify(value));
      } catch {}
    }

    const SCALE_KEY = 'dsh-the-gaze-of-naiwa:scale-v1';

    function readScale() {
      try {
        const raw = window.localStorage.getItem(SCALE_KEY);
        if (raw !== null && raw !== '') {
          const value = Number(raw);
          if (Number.isFinite(value)) return clamp(value, 0.7, 1.5);
        }
      } catch {}
      return 1;
    }

    function writeScale(value) {
      try {
        window.localStorage.setItem(SCALE_KEY, String(value));
      } catch {}
    }

    function NaiwaFloat({ useThinking, t }) {
      const thinking = useThinking((value) => value === true);
      const [bubble, setBubble] = useState(false);
      const [dragging, setDragging] = useState(false);
      const [menu, setMenu] = useState(false);
      const [scale, setScale] = useState(readScale);
      const [place, setPlace] = useState({ x: 0, y: 0, ready: false, up: false, left: false });
      const timer = useRef(0);
      const rootRef = useRef(null);
      const menuRef = useRef(null);
      const scaleRef = useRef(scale);
      scaleRef.current = scale;
      const ratios = useRef(null);
      if (ratios.current === null) ratios.current = readPosition() || { x: 1, y: 0.2 };
      const drag = useRef({
        active: false,
        moved: false,
        pointerId: 0,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        width: 0,
        height: 0,
        size: 0,
        suppressClick: false,
      });

      useLayoutEffect(() => {
        const root = rootRef.current;
        const parent = root && (root.closest('[data-shell-overlay]') || root.parentElement);
        if (!root || !parent) return;
        const placeNow = () => {
          const rect = parent.getBoundingClientRect();
          if (rect.width < 1 || rect.height < 1) return;
          const size = root.offsetWidth;
          if (size < 1) return;
          const availX = Math.max(0, rect.width - size - PAD * 2);
          const availY = Math.max(0, rect.height - size - PAD * 2);
          const x = PAD + ratios.current.x * availX;
          const y = PAD + ratios.current.y * availY;
          setPlace({
            x,
            y,
            ready: true,
            up: y + size / 2 > rect.height / 2,
            left: x + size / 2 < rect.width / 2,
          });
        };
        placeNow();
        let observer;
        if (typeof ResizeObserver !== 'undefined') {
          observer = new ResizeObserver(placeNow);
          observer.observe(root);
          observer.observe(parent);
        }
        window.addEventListener('resize', placeNow);
        return () => {
          if (observer) observer.disconnect();
          window.removeEventListener('resize', placeNow);
        };
      }, []);

      useEffect(() => () => {
        if (timer.current !== 0) clearTimeout(timer.current);
      }, []);

      useEffect(() => {
        if (!menu) return;
        const onPointerDown = (event) => {
          if (menuRef.current && menuRef.current.contains(event.target)) return;
          setMenu(false);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setMenu(false);
        };
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown);
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true);
          document.removeEventListener('keydown', onKeyDown);
        };
      }, [menu]);

      const changeScale = (next) => {
        const value = clamp(Math.round(next * 100) / 100, 0.7, 1.5);
        if (Math.abs(value - scaleRef.current) < 0.001) return;
        const root = rootRef.current;
        const parent = root && (root.closest('[data-shell-overlay]') || root.parentElement);
        if (root && parent) {
          const rect = parent.getBoundingClientRect();
          const oldSize = root.offsetWidth;
          if (oldSize > 0 && rect.width > 0 && rect.height > 0) {
            const base = Math.min(250, Math.max(120, Math.min(window.innerWidth, window.innerHeight) * 0.18));
            const newSize = base * value;
            const centerX = place.x + oldSize / 2;
            const centerY = place.y + oldSize / 2;
            const maxX = Math.max(0, rect.width - newSize);
            const maxY = Math.max(0, rect.height - newSize);
            const minX = Math.min(PAD, maxX);
            const minY = Math.min(PAD, maxY);
            const limitX = Math.max(minX, maxX - PAD);
            const limitY = Math.max(minY, maxY - PAD);
            const x = clamp(centerX - newSize / 2, minX, limitX);
            const y = clamp(centerY - newSize / 2, minY, limitY);
            const availX = Math.max(0, maxX - PAD * 2);
            const availY = Math.max(0, maxY - PAD * 2);
            ratios.current = {
              x: availX > 0 ? clamp((x - PAD) / availX, 0, 1) : 0,
              y: availY > 0 ? clamp((y - PAD) / availY, 0, 1) : 0,
            };
            setPlace({
              x,
              y,
              ready: true,
              up: y + newSize / 2 > rect.height / 2,
              left: x + newSize / 2 < rect.width / 2,
            });
            writePosition(ratios.current);
          }
        }
        scaleRef.current = value;
        setScale(value);
        writeScale(value);
      };

      const say = () => {
        setBubble(true);
        if (timer.current !== 0) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          timer.current = 0;
          setBubble(false);
        }, 2800);
      };

      const beginDrag = (event) => {
        if (event.button !== 0 || !place.ready) return;
        const root = rootRef.current;
        const parent = root && (root.closest('[data-shell-overlay]') || root.parentElement);
        if (!root || !parent) return;
        const rect = parent.getBoundingClientRect();
        const d = drag.current;
        d.active = true;
        d.moved = false;
        d.pointerId = event.pointerId;
        d.startX = event.clientX;
        d.startY = event.clientY;
        d.originX = place.x;
        d.originY = place.y;
        d.width = rect.width;
        d.height = rect.height;
        d.size = root.offsetWidth;
        d.suppressClick = false;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {}
      };

      const moveDrag = (event) => {
        const d = drag.current;
        if (!d.active || event.pointerId !== d.pointerId) return;
        const dx = event.clientX - d.startX;
        const dy = event.clientY - d.startY;
        if (!d.moved && Math.hypot(dx, dy) < 4) return;
        if (!d.moved) {
          d.moved = true;
          d.suppressClick = true;
          setDragging(true);
        }
        event.preventDefault();
        const maxX = Math.max(0, d.width - d.size);
        const maxY = Math.max(0, d.height - d.size);
        const minX = Math.min(PAD, maxX);
        const minY = Math.min(PAD, maxY);
        const limitX = Math.max(minX, maxX - PAD);
        const limitY = Math.max(minY, maxY - PAD);
        const x = clamp(d.originX + dx, minX, limitX);
        const y = clamp(d.originY + dy, minY, limitY);
        const availX = Math.max(0, maxX - PAD * 2);
        const availY = Math.max(0, maxY - PAD * 2);
        ratios.current = {
          x: availX > 0 ? clamp((x - PAD) / availX, 0, 1) : 0,
          y: availY > 0 ? clamp((y - PAD) / availY, 0, 1) : 0,
        };
        setPlace({
          x,
          y,
          ready: true,
          up: y + d.size / 2 > d.height / 2,
          left: x + d.size / 2 < d.width / 2,
        });
      };

      const endDrag = (event) => {
        const d = drag.current;
        if (!d.active) return;
        if (event && event.pointerId !== d.pointerId) return;
        d.active = false;
        if (d.moved) {
          writePosition(ratios.current);
          setDragging(false);
        }
        try {
          event.currentTarget.releasePointerCapture(d.pointerId);
        } catch {}
      };

      const onClick = () => {
        if (drag.current.suppressClick) {
          drag.current.suppressClick = false;
          return;
        }
        if (menu) {
          setMenu(false);
          return;
        }
        say();
      };

      const onContextMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenu((value) => !value);
      };

      const idleLabel = tr(t, 'aria.idle', '奶娃空闲中');
      const thinkingLabel = tr(t, 'aria.thinking', '奶娃正在思考');
      const label = thinking ? thinkingLabel : idleLabel;
      const dragHint = tr(t, 'aria.drag', '拖动可移动');
      const menuHint = tr(t, 'aria.menu', '右键调整大小');
      const sizeLabel = tr(t, 'menu.size', '大小');
      const doneLabel = tr(t, 'menu.done', '完成');
      const moveHint = tr(t, 'menu.hint', '拖动头像移动位置');
      const pct = Math.round(scale * 100);

      return h('div', {
        ref: rootRef,
        className: 'naiwa-float',
        'data-thinking': thinking ? 'true' : 'false',
        'data-dragging': dragging ? 'true' : 'false',
        'data-bubble-up': place.up ? 'true' : 'false',
        'data-bubble-left': place.left ? 'true' : 'false',
        style: {
          pointerEvents: 'none',
          left: `${place.x}px`,
          top: `${place.y}px`,
          visibility: place.ready ? 'visible' : 'hidden',
          '--naiwa-scale': String(scale),
        },
      },
      h('style', null, CSS),
      h('span', { className: 'naiwa-sr', 'aria-live': 'polite' }, label),
      bubble && h('div', { className: 'naiwa-bubble', 'aria-hidden': 'true' },
        thinking ? tr(t, 'bubble.thinking', '让我想想…') : tr(t, 'bubble.idle', '在呢，等你派活~'),
      ),
      h('button', {
        type: 'button',
        className: 'naiwa-button',
        title: `${label} · ${dragHint} · ${menuHint}`,
        'aria-label': label,
        onClick,
        onContextMenu,
        onPointerDown: beginDrag,
        onPointerMove: moveDrag,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
        style: { pointerEvents: 'auto', touchAction: 'none' },
      },
      h('span', { className: 'naiwa-aura', 'aria-hidden': 'true' }),
      h('span', { className: 'naiwa-disc', 'aria-hidden': 'true' },
        h('img', {
          className: `naiwa-photo naiwa-photo-idle${thinking ? ' naiwa-off' : ''}`,
          src: IDLE_SRC,
          alt: '',
          draggable: false,
        }),
        h('img', {
          className: `naiwa-photo naiwa-photo-thinking${thinking ? '' : ' naiwa-off'}`,
          src: THINKING_SRC,
          alt: '',
          draggable: false,
        }),
        h('span', { className: 'naiwa-vignette', 'aria-hidden': 'true' }),
        h('span', { className: 'naiwa-sheen', 'aria-hidden': 'true' }),
        h('span', { className: 'naiwa-grain', 'aria-hidden': 'true' })),
      h('span', { className: 'naiwa-think-pill', 'aria-hidden': 'true' },
        h('i'), h('i'), h('i'))),
      menu && h('div', {
        ref: menuRef,
        className: 'naiwa-menu',
        role: 'dialog',
        'aria-label': sizeLabel,
        onPointerDown: (event) => event.stopPropagation(),
        onContextMenu: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
      },
      h('div', { className: 'naiwa-menu-head' },
        h('span', null, sizeLabel),
        h('span', { className: 'naiwa-menu-pct' }, `${pct}%`)),
      h('input', {
        className: 'naiwa-range',
        type: 'range',
        min: 70,
        max: 150,
        step: 5,
        value: pct,
        'aria-label': sizeLabel,
        onChange: (event) => changeScale(Number(event.target.value) / 100),
      }),
      h('div', { className: 'naiwa-presets' },
        [80, 100, 120].map((value) => h('button', {
          key: value,
          type: 'button',
          className: 'naiwa-preset',
          'data-active': pct === value ? 'true' : 'false',
          onClick: () => changeScale(value / 100),
        }, `${value}%`))),
      h('div', { className: 'naiwa-menu-foot' },
        h('span', { className: 'naiwa-menu-hint' }, moveHint),
        h('button', {
          type: 'button',
          className: 'naiwa-done',
          onClick: () => setMenu(false),
        }, doneLabel))),
      );
    }

    return {
      inject: ['slots', 'locale', 'uiSession'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'the-gaze-of-naiwa: locale');
        const session = ctx.get('uiSession');
        const thinking = createThinkingSource(session);

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'the-gaze-of-naiwa',
          order: 80,
          locale: NS,
          inject: () => ({ hooks: { thinking } }),
        }, NaiwaFloat));
      },
    };
  },
});
