import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { r2, corners, isoBox, El, P2 } from './scene/iso';
import { buildMap } from './scene/buildMap';
import { buildStreet, FY, OFFICE, WIN } from './scene/buildStreet';
import { buildOffice } from './scene/buildOffice';
import { buildNetwork } from './scene/buildNetwork';
import { makeCamera } from './scene/camera';
import { ZOOM_BUILDING } from './scene/mapData';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Builds every scene and timeline inside `root` (the .wt-root element).
 * Returns a cleanup function that reverts all tweens, ScrollTriggers and SplitTexts and empties the SVGs.
 */
export function initWelcomeTour(root: HTMLElement, uid: string): () => void {
  const reduce = prefersReducedMotion();
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const scroller = $<HTMLDivElement>('.wt-scroller');
  const introSection = $('.wt-p1'), introInner = $('.wt-p1 .wt-sticky');
  const tourSection = $('.wt-p2'), netSection = $('.wt-p3');
  const stage = $('.wt-stage');
  const mapSvg = $<SVGSVGElement>('.wt-map'), zoomSvg = $<SVGSVGElement>('.wt-mapZoom');
  const streetSvg = $<SVGSVGElement>('.wt-street'), officeSvg = $<SVGSVGElement>('.wt-office');
  const netSvg = $<SVGSVGElement>('.wt-netSvg');
  const allSvgs = [mapSvg, zoomSvg, streetSvg, officeSvg, netSvg];

  // Sections are sized in multiples of the component's height (CSS var --wt-vh)
  const setVh = () => root.style.setProperty('--wt-vh', `${scroller.clientHeight || window.innerHeight}px`);
  setVh();

  let applyMorph: () => void = () => {};

  const ctx = gsap.context(() => {
    const mapScene = buildMap(mapSvg, `${uid}-m`);
    const zoomMap = buildMap(zoomSvg, `${uid}-z`);
    const street = buildStreet(streetSvg, `${uid}-s`);
    const office = buildOffice(officeSvg);
    const net = buildNetwork(netSvg);
    const { camXY, cam, size } = makeCamera(stage);

    const split = (sel: string) => SplitText.create($(sel), { type: 'words,chars', mask: 'words' });
    const charsIn = { yPercent: 110, opacity: 0, stagger: 0.022, ease: 'power3.out' };
    const scrub = reduce ? true : 1;
    const st = (trigger: Element, extra: ScrollTrigger.Vars = {}): ScrollTrigger.Vars =>
      ({ trigger, scroller, start: 'top top', end: 'bottom bottom', scrub, ...extra });

    /* ---------- PART 1 intro (plays on load) ---------- */
    const welcome = split('.wt-welcome');
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.wt-hey', { y: 18, opacity: 0, duration: 0.6 }, 0.2)
      .from(welcome.chars, { ...charsIn, duration: 0.7 }, 0.5)
      .from(mapScene.lines.children, { drawSVG: 0, duration: 2.2, ease: 'power1.inOut' }, '>-0.1')
      .from(mapScene.base.querySelectorAll('.mapTop'), { opacity: 0, duration: 0.8, ease: 'power1.out' }, '>-0.7')
      .from(mapScene.base.querySelectorAll('.mapShadow'), { opacity: 0, y: -12, duration: 0.8 }, '<')
      .from('.wt-scrollHint', { opacity: 0, y: 10, duration: 0.5 }, '>-0.2');
    if (reduce) intro.progress(1);

    /* ---------- PART 1 on scroll: buildings rise through the map, then CTA, then exit ---------- */
    const p1 = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st(introSection) });
    p1.to('.wt-scrollHint', { opacity: 0, y: -10, duration: 0.4 }, 0);
    mapScene.buildings.forEach((b, i) => {
      const at = 0.2 + i * 0.42;
      p1.fromTo(b.lift, { y: b.h }, { y: -b.h * 0.16, duration: 0.7, ease: 'power3.out' }, at)   // push up through the surface
        .to(b.lift, { y: 0, duration: 0.5, ease: 'bounce.out' }, at + 0.7)                      // drop into place
        .fromTo(b.shadow, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, at + 0.35);
    });
    p1.from('.wt-cta > *', { y: 18, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, '>+0.1')
      .to({}, { duration: 0.8 })
      .addLabel('exit')
      .to('.wt-exit', { opacity: 0, y: -40, stagger: 0.05, duration: 1 }, 'exit')
      .to('.wt-exitHead', { opacity: 0, y: -60, duration: 1 }, 'exit+=0.25')
      .to('.wt-brandTitle', { opacity: 1, duration: 0.6 }, 'exit+=0.6')
      .to({}, { duration: 0.5 });   // brief hold on the map before the tour takes over

    /* ---------- People working (ambient loops, independent of scroll) ---------- */
    if (!reduce) {
      office.people.forEach((p, i) => {
        const d = i * 0.37;
        gsap.to(p.arms[0], { y: -2.2, duration: 0.16, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: d });
        gsap.to(p.arms[1], { y: -2.2, duration: 0.19, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: d + 0.09 });
        gsap.to(p.head, { y: 1.6, x: i % 2 ? 1.2 : -1.2, duration: 1.4 + i * 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: d });
        gsap.to(p.body, { rotation: i % 2 ? 1.5 : -1.5, svgOrigin: p.hip.join(' '), duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
      if (office.display) gsap.to(office.display, { fill: '#d9f2e4', duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    /* ---------- PARTS 2–4: one sticky, scrubbed scene ---------- */
    const SI = street.iso, OI = office.iso;
    const OB = isoBox(SI, corners(OFFICE));                                         // office block, street svg units
    const K = {
      kz: () => camXY(OB.x + OB.w / 2, OB.y + OB.h / 2, OB.w * 1.25, OB.h * 1.1),  // tight on the office block
      kc: () => cam(SI, [6, 31, -5], 360, 280),                                    // where the cable starts, under the road
      k1: () => cam(SI, [50, 28, 0], 520, 380),
      k2: () => cam(SI, [76, 28, 5], 230, 230),          // close on the building's base as the cable arrives
      k2b: () => cam(SI, [78, 28, 21], 330, 520),        // tilt up with the green risers
      k3: () => cam(SI, street.routerC, 78, 64),
      k4: () => cam(SI, [76.1, FY, 27.6], 5, 5, true),   // window fills the screen
      oFar: () => cam(OI, [31, 23, 6], 2600, 2200, true),
      o0: () => cam(OI, [31, 23, 6], 880, 760),
      o1: () => cam(OI, office.handsetC, 120, 90),
    };
    const t1 = split('.wt-t1'), t2 = split('.wt-t2'), s1 = split('.wt-s1'), s2 = split('.wt-s2');
    streetSvg.setAttribute('viewBox', K.kz());
    officeSvg.setAttribute('viewBox', K.oFar());
    gsap.set(street.rings, { scale: 0.2, opacity: 0, transformOrigin: '50% 50%' });

    // The office layer is clipped to the router window's on-screen shape, so we fly through it
    const winPts = ([[WIN.x1, FY, WIN.z1], [WIN.x2, FY, WIN.z1], [WIN.x2, FY, WIN.z2], [WIN.x1, FY, WIN.z2]] as const).map(p => SI.P(...p));
    const pt = streetSvg.createSVGPoint();
    const setK = (svg: SVGSVGElement) => {
      const vb = svg.viewBox.baseVal;
      if (vb && svg.clientWidth) svg.style.setProperty('--k', String(r2(Math.max(vb.width / svg.clientWidth, vb.height / svg.clientHeight) * 1000) / 1000));
    };

    /* ---------- Map → street hand-off ----------
       The tour opens on a copy of the intro map, drawn at exactly the same spot on screen,
       so the moment Part 1 unpins nothing appears to change. It then zooms into the mini office tower,
       which lands exactly on the street's office block; the street grows out around it. */
    const zb = zoomMap.buildings[ZOOM_BUILDING];
    // Where the intro map sits while stuck (screen px per map unit + origin, relative to the sticky frame)
    const introMapFrame = () => {
      const m = mapSvg.getScreenCTM(), ir = introInner.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      return m ? { s: m.a, ox: m.e - sr.left, oy: m.f - ir.top } : { s: 1, ox: 0, oy: 0 };
    };
    const vbFrom = (s: number, ox: number, oy: number) => { const [W, H] = size(); return `${r2(-ox / s)} ${r2(-oy / s)} ${r2(W / s)} ${r2(H / s)}`; };
    const MZ = {
      start: () => { const f = introMapFrame(); return vbFrom(f.s, f.ox, f.oy); },
      // Map tower lands on the office block: same centre line, same base, same width
      end: () => {
        const [W] = size(), [vx, vy, vw] = K.kz().split(' ').map(Number), k = W / vw;
        const oCx = (OB.x + OB.w / 2 - vx) * k, oBase = (OB.y + OB.h - vy) * k, oW = OB.w * k;
        const b = zb.box, s = oW / b.w;
        return vbFrom(s, oCx - (b.x + b.w / 2) * s, oBase - (b.y + b.h) * s);
      },
    };
    // If the map building's shape ever differs from the office block, the block grows from its height
    const riseFrom = () => { const r = (zb.box.h / zb.box.w) / (OB.h / OB.w); return r > 0.95 ? 1 : r; };
    const baseOrigin = SI.P((OFFICE.x1 + OFFICE.x2) / 2, (OFFICE.y1 + OFFICE.y2) / 2, 0).map(r2).join(' ');
    zoomSvg.setAttribute('viewBox', MZ.start());

    const Z = 3.4;   // the street / cable sequence starts here
    const T = (n: number) => Z + n;
    const showTour = (on: boolean) => {
      tourSection.style.visibility = on ? 'visible' : 'hidden';
      introSection.style.visibility = on ? 'hidden' : 'visible';
    };
    function clipOffice(t: number) {
      setK(streetSvg); setK(officeSvg);
      if (t >= T(9.15)) { officeSvg.style.clipPath = 'none'; return; }
      const m = streetSvg.getScreenCTM(), sr = stage.getBoundingClientRect();
      if (!m) return;
      officeSvg.style.clipPath = 'polygon(' + winPts.map(([x, y]) => { pt.x = x; pt.y = y; const q = pt.matrixTransform(m); return `${r2(q.x - sr.left)}px ${r2(q.y - sr.top)}px`; }).join(',') + ')';
    }

    /* Two timelines share the same scroll range and length:
       · tl     — everything that is drawn, revealed or faded. Never invalidated, so every from() keeps its start state.
       · camTl  — only the camera moves (viewBox). Its values are functions of the container size, so it is
                  invalidated and re-measured on every refresh/resize. Keep from()/staggers out of it. */
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: st(tourSection, {
        onToggle: self => { if (self.isActive) showTour(true); },
        onLeaveBack: () => showTour(false),
      }),
    });
    const camTl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: () => clipOffice(camTl.time()),
      scrollTrigger: st(tourSection, { invalidateOnRefresh: true }),
    });
    camTl
      .fromTo(zoomSvg, { attr: { viewBox: MZ.start } }, { attr: { viewBox: MZ.end }, duration: 1.4, ease: 'power2.inOut' }, 0)
      .fromTo(streetSvg, { attr: { viewBox: K.kz } }, { attr: { viewBox: K.kz }, duration: 1.9 }, 0)
      // straight from the tower to the cable's starting point, arriving as the line begins to draw
      .to(streetSvg, { attr: { viewBox: K.kc }, duration: 1.8, ease: 'power2.inOut' }, 1.9)
      .to(streetSvg, { attr: { viewBox: K.k1 }, duration: 1.3, ease: 'sine.inOut' }, T(0.3))
      .to(streetSvg, { attr: { viewBox: K.k2 }, duration: 1.2, ease: 'power1.inOut' }, T(1.6))
      .to(streetSvg, { attr: { viewBox: K.k2b }, duration: 1.4, ease: 'sine.inOut' }, T(3.4))
      .to(streetSvg, { attr: { viewBox: K.k3 }, duration: 1.5, ease: 'power2.inOut' }, T(5.0))
      .to(streetSvg, { attr: { viewBox: K.k4 }, duration: 1.2, ease: 'power2.in' }, T(7.9))
      .fromTo(officeSvg, { attr: { viewBox: K.oFar } }, { attr: { viewBox: K.o0 }, duration: 1.4, ease: 'power1.inOut' }, T(7.9))
      .to(officeSvg, { attr: { viewBox: K.o1 }, duration: 1.4, ease: 'power2.inOut' }, T(9.6));

    tl
      // Hand-off — dive into the map, the tower becomes the office block, the street grows around it
      .to(zoomMap.buildings.filter(b => b !== zb).map(b => b.g), { opacity: 0, duration: 0.35, stagger: 0.04 }, 0.05)
      .fromTo('.wt-stageFade', { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0.2)
      .to([zoomMap.lines, zoomMap.base], { opacity: 0, duration: 0.45 }, 1.05)
      // swap once the zoom has landed: map tower out, office block in (exact overlay)
      .from(street.office, { opacity: 0, duration: 0.25 }, 1.4)
      .to(zb.g, { opacity: 0, duration: 0.25 }, 1.4)
      .from(street.office, { scaleY: riseFrom(), svgOrigin: baseOrigin, duration: 0.7, ease: 'power2.inOut' }, 1.3)
      .from(street.ground, { scale: 0.15, opacity: 0, svgOrigin: baseOrigin, duration: 0.9, ease: 'power3.out' }, 1.5);
    street.props.forEach(({ el, x, kind }) => {
      const at = 1.85 + Math.abs(x - 78) * 0.012;   // closest to the office first
      if (kind === 'car') tl.from(el, { opacity: 0, x: x < 78 ? -40 : 40, duration: 0.5, ease: 'power2.out' }, at + 0.2);
      else tl.from(el, { scaleY: 0, scaleX: kind === 'pop' ? 0 : 1, opacity: 0, transformOrigin: '50% 100%', duration: 0.45, ease: 'back.out(1.6)' }, at);
    });
    tl.from(t1.chars, { ...charsIn, duration: 0.8 }, 2.5)
      // Exit t1 before s1 enters
      .to(t1.chars, { yPercent: -110, opacity: 0, stagger: 0.01, duration: 0.4 }, T(3.2))
      // Part 2 — the cable runs underneath the street and into the office block
      .from(street.cable, { drawSVG: 0, duration: 3.3 }, T(0.3))
      .from(street.joint, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.3 }, T(2.7))
      .from(street.outline, { drawSVG: 0, duration: 1.0 }, T(3.3))
      .from(street.risers, { drawSVG: 0, duration: 1.1, stagger: 0.12 }, T(3.4))
      .from(s1.chars, { ...charsIn, duration: 0.7 }, T(3.8))
      // Part 3 — camera up to the router
      .to(s1.chars, { yPercent: -110, opacity: 0, stagger: 0.01, duration: 0.4 }, T(6.0))
      .from(s2.chars, { ...charsIn, duration: 0.6 }, T(6.4))
      .to(street.rings, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.2, ease: 'back.out(2)' }, T(6.5))
      .to(street.rings, { opacity: 0.35, duration: 0.25, stagger: 0.2, yoyo: true, repeat: 1 }, T(7.0))
      // Part 4 — through the window into the office, then onto the handset
      .to(s2.chars, { yPercent: -110, opacity: 0, stagger: 0.006, duration: 0.4 }, T(7.6))
      .to(street.rings, { opacity: 0, duration: 0.3 }, T(7.6))
      .to(officeSvg, { opacity: 1, duration: 0.4 }, T(7.9))
      .to(streetSvg, { opacity: 0, duration: 0.05 }, T(9.1))
      .from(t2.chars, { ...charsIn, duration: 0.8 }, T(9.7))
      .to({}, { duration: 0.5 }, T(11.4));
    camTl.set({}, {}, tl.duration());   // same length, so both timelines map scroll → time identically
    clipOffice(0);

    /* ---------- PARTS 5–8: network diagram (Manage → Track → Issues → Explore) ---------- */
    const nb = ['m', 't', 'i', 'e'].map(k => ({
      eb: $(`.wt-nb[data-k="${k}"] .wt-eyebrow`), h: split(`.wt-nb[data-k="${k}"] h2`), p: $(`.wt-nb[data-k="${k}"] p`),
    }));
    const cards = [...root.querySelectorAll<HTMLElement>('.wt-card')];
    const nt = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: st(netSection) });
    type Block = typeof nb[number];
    const blockIn = (b: Block, at: number) => nt.from(b.eb, { opacity: 0, y: 10, duration: 0.3 }, at).from(b.h.chars, { ...charsIn, duration: 0.7 }, at + 0.1).from(b.p, { opacity: 0, y: 12, duration: 0.5 }, at + 0.4);
    const blockOut = (b: Block, at: number) => nt.to(b.eb, { opacity: 0, duration: 0.25 }, at).to(b.h.chars, { yPercent: -110, opacity: 0, stagger: 0.006, duration: 0.35 }, at).to(b.p, { opacity: 0, y: -10, duration: 0.3 }, at);
    const pop = { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', ease: 'back.out(1.8)', duration: 0.4 };

    // 1 · Manage — the tree builds itself
    blockIn(nb[0], 0);
    nt.from(net.you.g, { ...pop, duration: 0.5 }, 0.3);
    net.resLines.forEach((l, i) => nt.from(l, { drawSVG: 0, duration: 0.6 }, 0.8 + i * 0.15));
    net.res.forEach((n, i) => nt.from(n.g, pop, 1.3 + i * 0.15));
    net.custLines.forEach((l, j) => nt.from(l, { drawSVG: 0, duration: 0.45 }, 2.0 + j * 0.06));
    net.cust.forEach((n, j) => nt.from(n.g, { ...pop, duration: 0.35 }, 2.35 + j * 0.06));
    nt.from(net.outline, { drawSVG: 0, duration: 0.9, ease: 'power1.inOut' }, 3.0);

    // 2 · Track orders — chips travel up the branches, timeline + counter respond
    blockOut(nb[0], 4.3); blockIn(nb[1], 4.7);
    nt.to(net.outline, { opacity: 0, duration: 0.4 }, 4.3)
      .from(net.track, { opacity: 0, y: 12, duration: 0.4 }, 4.6)
      .to(net.steps[0], { opacity: 1, duration: 0.2 }, 5.1);
    net.chips.forEach((c, k) => {
      gsap.set(c.g, { x: c.pts[0][0], y: c.pts[0][1] });
      nt.from(c.g, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(2)' }, 5.0 + k * 0.1);
      const segs = c.pts.slice(1).map((p: P2, i: number) => Math.hypot(p[0] - c.pts[i][0], p[1] - c.pts[i][1]));
      const total = segs.reduce((a, b) => a + b, 0), D = 1.5, start = 5.5 + k * 0.35;
      nt.to(c.g, { keyframes: c.pts.slice(1).map((p: P2, i: number) => ({ x: p[0], y: p[1], duration: D * segs[i] / total })), ease: 'none' }, start);
      const tRes = start + D * segs.slice(0, 3).reduce((a, b) => a + b, 0) / total;
      nt.to(c.dot, { attr: { fill: '#e8a317' }, duration: 0.15 }, tRes)
        .to(c.dot, { attr: { fill: '#00A651' }, duration: 0.15 }, start + D - 0.1)
        .to(c.g, { opacity: 0, scale: 0.6, duration: 0.25 }, start + D + 0.05);
      if (k === 0) nt.to(net.steps[1], { opacity: 1, duration: 0.2 }, tRes).to(net.steps[2], { opacity: 1, duration: 0.2 }, start + D - 0.1);
    });
    const counter = { v: 0 };
    nt.to(counter, { v: 12, duration: 1.4, onUpdate: () => { net.countNum.textContent = String(Math.round(counter.v)); } }, 6.9)
      .fromTo(net.you.bg, { attr: { 'stroke-width': 0 } }, { attr: { 'stroke-width': 6 }, duration: 0.2, yoyo: true, repeat: 1 }, 8.1);

    // 3 · Raise issues — one node flagged, ticket slides out, steps to resolved
    blockOut(nb[1], 8.6); blockIn(nb[2], 9.0);
    const dimmed: El[] = [net.lines, net.you.g, ...net.res.map(n => n.g), ...net.cust.filter(n => n !== net.hit).map(n => n.g)];
    nt.to(net.track, { opacity: 0, duration: 0.4 }, 8.6)
      .to(dimmed, { opacity: 0.28, duration: 0.4 }, 9.0)
      .from(net.badge, { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.5)' }, 9.3)
      .fromTo(net.ring, { scale: 1, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 2.6, opacity: 0, duration: 0.5, ease: 'power1.out', immediateRender: false }, 9.6)
      .from(net.ticketLine, { drawSVG: 0, duration: 0.4 }, 9.8)
      .from(net.ticket, { opacity: 0, x: -24, duration: 0.5, ease: 'power2.out' }, 10.0)
      .from(net.pills[0], { opacity: 0, duration: 0.2 }, 10.2)
      .from(net.thread[0], { opacity: 0, x: -8, duration: 0.3 }, 10.3)
      .to(net.pills[0], { opacity: 0, duration: 0.2 }, 10.9)
      .from(net.pills[1], { opacity: 0, duration: 0.2 }, 10.9)
      .from(net.thread[1], { opacity: 0, x: -8, duration: 0.3 }, 11.0)
      .to(net.pills[1], { opacity: 0, duration: 0.2 }, 11.6)
      .from(net.pills[2], { opacity: 0, duration: 0.2 }, 11.6)
      .from(net.thread[2], { opacity: 0, x: -8, duration: 0.3 }, 11.7)
      .to(net.badge, { scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 11.9)
      .from(net.tick, { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.5)' }, 12.0)
      .to(dimmed, { opacity: 1, duration: 0.4 }, 12.1);

    // 4 · Ready to explore — nodes break away and become the link cards
    blockOut(nb[2], 12.9); blockIn(nb[3], 13.3);
    const morphNodes = [net.you, ...net.res];
    const fromR = morphNodes.map(n => ({ x: n.cx - n.w / 2, y: n.cy - n.h / 2, w: n.w, h: n.h }));
    const sp = netSvg.createSVGPoint();
    const toSvg = (x: number, y: number, inv: DOMMatrix): P2 => { sp.x = x; sp.y = y; const q = sp.matrixTransform(inv); return [q.x, q.y]; };
    const morph = { v: 0 };
    applyMorph = () => {
      const m = netSvg.getScreenCTM(); if (!m) return;
      const inv = m.inverse(), v = morph.v, L = (a: number, b: number) => r2(a + (b - a) * v);
      morphNodes.forEach((n, i) => {
        const r = cards[i].getBoundingClientRect(), f = fromR[i];
        const [x1, y1] = toSvg(r.left, r.top, inv), [x2, y2] = toSvg(r.right, r.bottom, inv);
        n.bg.setAttribute('x', L(f.x, x1)); n.bg.setAttribute('y', L(f.y, y1));
        n.bg.setAttribute('width', L(f.w, x2 - x1)); n.bg.setAttribute('height', L(f.h, y2 - y1));
      });
    };
    nt.to([net.ticket, net.ticketLine, net.tick], { opacity: 0, duration: 0.3 }, 12.9)
      .to([...net.cust.map(n => n.g), net.lines], { opacity: 0, duration: 0.4, stagger: 0.01 }, 13.1)
      .to([...morphNodes.map(n => n.content), ...morphNodes.map(n => n.shadow)], { opacity: 0, duration: 0.3 }, 13.3)
      .to(morph, { v: 1, duration: 1.2, ease: 'power2.inOut', onUpdate: applyMorph }, 13.4)
      .fromTo(cards, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }, 14.45)
      .to(morphNodes.map(n => n.bg), { opacity: 0, duration: 0.3 }, 14.9)
      .to({}, { duration: 0.8 }, 15.2);
  }, root);

  ScrollTrigger.addEventListener('refresh', applyMorph);

  // Re-measure on any size change (modal resize, orientation change, etc.)
  let raf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { setVh(); ScrollTrigger.refresh(); });
  });
  ro.observe(root);
  ScrollTrigger.refresh();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    ScrollTrigger.removeEventListener('refresh', applyMorph);
    ctx.revert();
    allSvgs.forEach(svg => {
      svg.replaceChildren();
      svg.removeAttribute('viewBox');
      svg.style.removeProperty('clip-path');
      svg.style.removeProperty('--k');
    });
    tourSection.style.removeProperty('visibility');
    introSection.style.removeProperty('visibility');
    root.style.removeProperty('--wt-vh');
  };
}
