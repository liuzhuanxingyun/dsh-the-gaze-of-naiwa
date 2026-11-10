window.__ModuleLoader__.load({
  id: 'dsh-the-gaze-of-naiwa',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useRef, useState } = React;

    const NS = 'the-gaze-of-naiwa';
    const ZH = {
      'aria.idle': '奶娃空闲中',
      'aria.thinking': '奶娃正在思考',
      'bubble.idle': '在呢，等你派活~',
      'bubble.thinking': '让我想想…',
    };
    const EN = {
      'aria.idle': 'Naiwa is idle',
      'aria.thinking': 'Naiwa is thinking',
      'bubble.idle': 'Here. What are we making?',
      'bubble.thinking': 'Let me think…',
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
    const IDLE_SRC = asset('idle-ff4644c1.png');
    const THINKING_SRC = asset('thinking-ae35492d.png');

    const CSS = `
.naiwa-float{position:absolute;right:24px;bottom:24px;z-index:40;width:160px;height:160px;pointer-events:none;font-family:var(--dsw-font-family-ui,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif);}
.naiwa-button{position:relative;display:block;width:160px;height:160px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;pointer-events:auto;transition:transform .26s cubic-bezier(.2,.8,.3,1.2);-webkit-tap-highlight-color:transparent;}
.naiwa-button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#5b8def);outline-offset:7px;border-radius:50%;}
.naiwa-button:active{transform:scale(.975);}
.naiwa-aura{position:absolute;inset:-12px;border-radius:50%;background:conic-gradient(from 0deg,rgba(120,170,255,0),rgba(120,170,255,.55),rgba(185,160,255,.35),rgba(120,170,255,0) 72%);filter:blur(18px);opacity:0;z-index:0;animation:naiwa-spin 8s linear infinite;transition:opacity .45s ease;pointer-events:none;}
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
.naiwa-status{position:absolute;right:18px;bottom:18px;width:10px;height:10px;border-radius:50%;background:#69D39A;box-shadow:0 0 0 2px rgba(255,255,255,.45),0 0 12px rgba(105,211,154,.65);z-index:6;transition:background .3s ease,box-shadow .3s ease;}
.naiwa-float[data-thinking="true"] .naiwa-status{background:#7FB6FF;box-shadow:0 0 0 2px rgba(255,255,255,.45),0 0 16px rgba(127,182,255,.80);animation:naiwa-status-pulse 1.6s ease-in-out infinite;}
.naiwa-think-pill{position:absolute;top:-10px;right:-8px;display:flex;align-items:center;gap:4px;padding:7px 9px;border-radius:14px;background:rgba(255,255,255,.62);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(255,255,255,.72);box-shadow:0 8px 22px rgba(30,40,60,.18);opacity:0;transform:translateY(5px) scale(.88);transform-origin:bottom right;transition:opacity .24s ease,transform .24s cubic-bezier(.2,.9,.3,1.2);pointer-events:none;z-index:7;}
.naiwa-float[data-thinking="true"] .naiwa-think-pill{opacity:1;transform:translateY(0) scale(1);}
.naiwa-think-pill i{display:block;width:4.5px;height:4.5px;border-radius:50%;background:#7FA8FF;animation:naiwa-tdot 1.2s ease-in-out infinite;}
.naiwa-think-pill i:nth-child(2){animation-delay:.16s;}
.naiwa-think-pill i:nth-child(3){animation-delay:.32s;}
.naiwa-bubble{position:absolute;right:4px;bottom:calc(100% + 16px);box-sizing:border-box;width:max-content;max-width:260px;padding:10px 14px;border-radius:16px;background:rgba(28,30,36,.78);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);border:1px solid rgba(255,255,255,.16);color:#F6F8FB;font-size:13px;line-height:1.5;text-align:left;white-space:normal;box-shadow:0 18px 44px rgba(0,0,0,.30);pointer-events:none;animation:naiwa-bubble-in .22s ease-out;}
.naiwa-bubble::after{content:"";position:absolute;right:28px;top:100%;border:7px solid transparent;border-top-color:rgba(28,30,36,.78);}
.naiwa-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;}
body[data-ds-dark-theme] .naiwa-disc{background:rgba(24,28,38,.35);border-color:rgba(255,255,255,.22);box-shadow:0 24px 56px -18px rgba(0,0,0,.65),0 8px 20px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(255,255,255,.05);}
body[data-ds-dark-theme] .naiwa-button:hover .naiwa-disc{box-shadow:0 30px 68px -18px rgba(0,0,0,.75),0 10px 24px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(255,255,255,.06);}
body[data-ds-dark-theme] .naiwa-vignette{background:radial-gradient(circle at 50% 44%,rgba(0,0,0,0) 48%,rgba(14,20,30,.25) 72%,rgba(10,14,22,.58) 100%);box-shadow:inset 0 0 34px rgba(0,0,0,.35);}
body[data-ds-dark-theme] .naiwa-sheen{opacity:.35;}
body[data-ds-dark-theme] .naiwa-think-pill{background:rgba(30,34,44,.62);border-color:rgba(255,255,255,.20);box-shadow:0 8px 22px rgba(0,0,0,.35);}
body[data-ds-dark-theme] .naiwa-think-pill i{background:#A9C6FF;}
body[data-ds-dark-theme] .naiwa-bubble{background:rgba(20,22,28,.82);border-color:rgba(255,255,255,.14);}
body[data-ds-dark-theme] .naiwa-bubble::after{border-top-color:rgba(20,22,28,.82);}
@media (hover:hover){.naiwa-button:hover{transform:translateY(-2px) scale(1.02);}}
@media (max-width:720px){
  .naiwa-float{right:14px;bottom:14px;width:120px;height:120px;}
  .naiwa-button{width:120px;height:120px;}
  .naiwa-aura{inset:-9px;filter:blur(14px);}
  .naiwa-status{right:14px;bottom:14px;width:9px;height:9px;}
  .naiwa-think-pill{top:-8px;right:-6px;padding:6px 8px;border-radius:12px;}
  .naiwa-bubble{max-width:220px;font-size:12px;padding:9px 12px;}
}
@keyframes naiwa-idle-breathe{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.012) translateY(-1px)}}
@keyframes naiwa-think-breathe{0%,100%{transform:scale(1.008)}50%{transform:scale(1.02)}}
@keyframes naiwa-spin{to{transform:rotate(360deg)}}
@keyframes naiwa-tdot{0%,100%{opacity:.35;transform:translateY(0)}45%{opacity:1;transform:translateY(-1.5px)}}
@keyframes naiwa-status-pulse{0%,100%{box-shadow:0 0 0 2px rgba(255,255,255,.40),0 0 12px rgba(127,182,255,.55)}50%{box-shadow:0 0 0 3px rgba(255,255,255,.55),0 0 20px rgba(127,182,255,.90)}}
@keyframes naiwa-bubble-in{from{opacity:0;transform:translateY(4px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
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

    function NaiwaFloat({ useThinking, t }) {
      const thinking = useThinking((value) => value === true);
      const [bubble, setBubble] = useState(false);
      const timer = useRef(0);

      useEffect(() => () => {
        if (timer.current !== 0) clearTimeout(timer.current);
      }, []);

      const say = () => {
        setBubble(true);
        if (timer.current !== 0) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          timer.current = 0;
          setBubble(false);
        }, 2800);
      };

      const idleLabel = tr(t, 'aria.idle', '奶娃空闲中');
      const thinkingLabel = tr(t, 'aria.thinking', '奶娃正在思考');
      const label = thinking ? thinkingLabel : idleLabel;

      return h('div', {
        className: 'naiwa-float',
        'data-thinking': thinking ? 'true' : 'false',
        style: { pointerEvents: 'none' },
      },
      h('style', null, CSS),
      h('span', { className: 'naiwa-sr', 'aria-live': 'polite' }, label),
      bubble && h('div', { className: 'naiwa-bubble', 'aria-hidden': 'true' },
        thinking ? tr(t, 'bubble.thinking', '让我想想…') : tr(t, 'bubble.idle', '在呢，等你派活~'),
      ),
      h('button', {
        type: 'button',
        className: 'naiwa-button',
        title: label,
        'aria-label': label,
        onClick: say,
        style: { pointerEvents: 'auto' },
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
      h('span', { className: 'naiwa-status', 'aria-hidden': 'true' }),
      h('span', { className: 'naiwa-think-pill', 'aria-hidden': 'true' },
        h('i'), h('i'), h('i'))),
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
