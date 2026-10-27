import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { buildMap } from './scene/buildMap';
import { buildStreet, FY } from './scene/buildStreet';
import { buildOffice } from './scene/buildOffice';
import { cam } from './scene/camera';
import { r2 } from './scene/svg';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Builds the three SVG scenes and wires up every animation.
 * The component's root element is the scroll container; both scroll sections use
 * `position: sticky` for pinning, so this works inside a modal as well as full-page.
 * Returns a cleanup function that reverts everything (safe for React StrictMode).
 */
export function initWelcomeTour(root: HTMLElement, uid: string): () => void {
  const q = <T extends Element = HTMLElement>(name: string) => {
    const el = root.querySelector(`[data-wt="${name}"]`);
    if (!el) throw new Error(`WelcomeTour: missing [data-wt="${name}"]`);
    return el as T;
  };
  const reduce = prefersReducedMotion();
  const scrub = reduce ? true : 1;

  const setVh = () => root.style.setProperty('--wt-vh', `${root.clientHeight}px`);
  setVh();

  const p1 = q('p1'), p2 = q('p2'), stage = q('stage');
  const mapSvg = q<SVGSVGElement>('map'), streetSvg = q<SVGSVGElement>('street'), officeSvg = q<SVGSVGElement>('office');
  const map = buildMap(mapSvg, uid);
  const street = buildStreet(streetSvg, uid);
  const office = buildOffice(officeSvg);

  let refreshCamera = () => {};
  const ctx = gsap.context(() => {
    const split = (el: Element) => SplitText.create(el, { type: 'words,chars', mask: 'words' });
    const charsIn = { yPercent: 110, opacity: 0, stagger: 0.022, ease: 'power3.out' };

    /* ---------- PART 1: plays on load ---------- */
    const welcome = split(q('welcome'));
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from(q('introLogo'), { opacity: 0, scale: 0.8, duration: 0.5 }, 0)
      .from(q('hey'), { y: 18, opacity: 0, duration: 0.6 }, 0.3)
      .from(welcome.chars, { ...charsIn, duration: 0.7 }, 0.6)
      .from(map.lines, { drawSVG: 0, duration: 2.2, ease: 'power1.inOut' }, '>-0.1')
      .from(map.tops, { opacity: 0, duration: 0.8, ease: 'power1.out' }, '>-0.7')
      .from(map.shadows, { opacity: 0, y: -12, duration: 0.8 }, '<');

    // Buildings rise on load (staggered), ~1 second total
    const buildingsStart = intro.duration();
    const buildingCount = map.buildings.length;
    const totalBuildingsDuration = 1.0;
    const staggerGap = buildingCount > 1 ? (totalBuildingsDuration - 0.4) / (buildingCount - 1) : 0;
    map.buildings.forEach((b, i) => {
      const at = buildingsStart + i * staggerGap;
      intro
        .fromTo(b.lift, { y: b.h }, { y: -b.h * 0.16, duration: 0.25, ease: 'power3.out' }, at)
        .to(b.lift, { y: 0, duration: 0.2, ease: 'bounce.out' }, at + 0.25)
        .fromTo(b.shadow, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, at + 0.1);
    });

    // Tagline + Start tour button animate in after buildings
    intro
      .fromTo(q('tagline'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, '>+0.1')
      .fromTo(q('startBtn'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, '>-0.2')
      .from(q('scrollHint'), { opacity: 0, y: 10, duration: 0.5 }, '>-0.2');
    if (reduce) intro.progress(1);

    /* ---------- PART 1: on scroll — exit animations only (buildings already visible) ---------- */
    const t1p = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: p1, scroller: root, start: 'top top', end: 'bottom bottom', scrub },
    });
    t1p.to(q('scrollHint'), { opacity: 0, y: -10, duration: 0.4 }, 0);
    // CTA items are already visible from intro, just keep them until exit
    t1p
      .to({}, { duration: 1.5 })
      .addLabel('exit')
      .to(p1.querySelectorAll('.wt-exit'), { opacity: 0, y: -40, stagger: 0.05, duration: 1 }, 'exit')
      .to(q('exitHead'), { opacity: 0, y: -60, duration: 1 }, 'exit+=0.25')
      .to(q('brandTitle'), { opacity: 1, duration: 0.6 }, 'exit+=0.6');

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

    /* ---------- PARTS 2–4: one scrubbed scene ---------- */
    const SI = street.iso, OI = office.iso;
    const K = {
      k0: () => cam(stage, SI, [24, 24, -2], 540, 400),
      k1: () => cam(stage, SI, [50, 28, 0], 520, 380),
      k2: () => cam(stage, SI, [76, 28, 5], 230, 230), // close on the building's base as the cable arrives
      k2b: () => cam(stage, SI, [78, 28, 21], 330, 520), // tilt up with the green risers
      k3: () => cam(stage, SI, street.routerC, 78, 64),
      k4: () => cam(stage, SI, [76.1, FY, 27.6], 5, 5, true), // window fills the screen
      oFar: () => cam(stage, OI, [31, 23, 6], 2600, 2200, true),
      o0: () => cam(stage, OI, [31, 23, 6], 880, 760),
      o1: () => cam(stage, OI, office.handsetC, 120, 90),
    };
    const t1 = split(q('t1')), t2 = split(q('t2')), s1 = split(q('s1')), s2 = split(q('s2'));
    // Cameras are driven by a keyframe index (camS / camO) rather than tweening the viewBox directly.
    // The viewBox is recomputed from the live stage size on every update, so resizing never needs
    // the timeline to be invalidated (invalidating breaks the staggered text reveals).
    const streetKeys = [K.k0, K.k1, K.k2, K.k2b, K.k3, K.k4];
    const officeKeys = [K.oFar, K.o0, K.o1];
    const camS = { v: 0 }, camO = { v: 0 };
    const lerpVB = (keys: (() => string)[], v: number) => {
      const i = Math.min(Math.floor(v), keys.length - 2), f = v - i;
      const a = keys[i]().split(' ').map(Number), b = keys[i + 1]().split(' ').map(Number);
      return a.map((n, j) => r2(n + (b[j] - n) * f)).join(' ');
    };
    gsap.set(street.rings, { scale: 1, opacity: 1, transformOrigin: '50% 50%' });

    // Ambient green ring pulse — always running, independent of scroll
    if (!reduce) {
      gsap.to(street.rings, {
        scale: 1.15,
        opacity: 0.5,
        duration: 0.8,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Lines animated with DrawSVG can't use non-scaling-stroke, so their width is counter-scaled by zoom (--k).
    const setK = (svg: SVGSVGElement) => {
      const vb = svg.viewBox.baseVal;
      if (vb && svg.clientWidth) svg.style.setProperty('--k', String(r2(Math.max(vb.width / svg.clientWidth, vb.height / svg.clientHeight) * 1000) / 1000));
    };
    // During the fly-through the office layer is clipped to the router window's on-screen shape.
    const pt = streetSvg.createSVGPoint();
    const update = (t: number) => {
      streetSvg.setAttribute('viewBox', lerpVB(streetKeys, camS.v));
      officeSvg.setAttribute('viewBox', lerpVB(officeKeys, camO.v));
      setK(streetSvg);
      setK(officeSvg);
      if (t >= 9.15) { officeSvg.style.clipPath = 'none'; return; }
      const m = streetSvg.getScreenCTM();
      if (!m) return;
      const sr = stage.getBoundingClientRect();
      officeSvg.style.clipPath = 'polygon(' + street.windowPts.map(([x, y]) => { pt.x = x; pt.y = y; const p = pt.matrixTransform(m); return `${r2(p.x - sr.left)}px ${r2(p.y - sr.top)}px`; }).join(',') + ')';
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: () => update(tl.time()),
      scrollTrigger: { trigger: p2, scroller: root, start: 'top top', end: 'bottom bottom', scrub },
    });
    tl
      // Part 2 — street level, cable runs to the office block
      .from(t1.chars, { ...charsIn, duration: 0.8 }, 0)
      .from(street.cable, { drawSVG: 0, duration: 3.3 }, 0.3)
      .to(camS, { v: 1, duration: 1.3, ease: 'sine.inOut' }, 0.3)
      .to(camS, { v: 2, duration: 1.2, ease: 'power1.inOut' }, 1.6)
      .from(street.joint, { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.3 }, 2.7)
      .from(street.outline, { drawSVG: 0, duration: 1.0 }, 3.3)
      .from(street.risers, { drawSVG: 0, duration: 1.1, stagger: 0.12 }, 3.4)
      .to(camS, { v: 3, duration: 1.4, ease: 'sine.inOut' }, 3.4)
      .from(s1.chars, { ...charsIn, duration: 0.7 }, 3.8)
      // Part 3 — up to the router
      .to(camS, { v: 4, duration: 1.5, ease: 'power2.inOut' }, 5.0)
      .to(s1.chars, { yPercent: -110, opacity: 0, stagger: 0.01, duration: 0.4 }, 6.0)
      .from(s2.chars, { ...charsIn, duration: 0.6 }, 6.4)
      // Part 4 — through the window into the office, then onto the handset
      .to([...t1.chars, ...s2.chars], { yPercent: -110, opacity: 0, stagger: 0.006, duration: 0.4 }, 7.6)
      .to(street.rings, { opacity: 0, duration: 0.3 }, 7.6)
      .to(officeSvg, { opacity: 1, duration: 0.4 }, 7.9)
      .to(camS, { v: 5, duration: 1.2, ease: 'power2.in' }, 7.9)
      .to(camO, { v: 1, duration: 1.4, ease: 'power1.inOut' }, 7.9)
      .to(streetSvg, { opacity: 0, duration: 0.05 }, 9.1)
      .to(camO, { v: 2, duration: 1.4, ease: 'power2.inOut' }, 9.6)
      .from(t2.chars, { ...charsIn, duration: 0.8 }, 9.7)
      .fromTo(q('finish'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 10.6)
      .to({}, { duration: 0.5 }, 11.4);
    update(0);
    refreshCamera = () => update(tl.time());
  }, root);

  // Keep the sticky sections sized to the container and re-measure triggers on resize.
  let raf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { setVh(); ScrollTrigger.refresh(); refreshCamera(); });
  });
  ro.observe(root);

  // Scroll progress indicator
  const progressFill = root.querySelector('[data-wt="progressFill"]') as HTMLElement | null;
  const onScroll = () => {
    if (!progressFill) return;
    const scrollTop = root.scrollTop;
    const scrollHeight = root.scrollHeight - root.clientHeight;
    const pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
    progressFill.style.height = `${pct}%`;
  };
  root.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  ScrollTrigger.refresh();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    root.removeEventListener('scroll', onScroll);
    ctx.revert();
    [mapSvg, streetSvg, officeSvg].forEach((svg) => {
      svg.replaceChildren();
      svg.removeAttribute('viewBox');
      svg.style.removeProperty('clip-path');
      svg.style.removeProperty('--k');
    });
  };
}
