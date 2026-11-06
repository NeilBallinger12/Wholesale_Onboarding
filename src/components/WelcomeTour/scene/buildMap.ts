/* =========================================================
   PART 1 — UK map + buildings (from the supplied Figma assets)
   Built twice: once for the intro, once as the copy the tour zooms into.
   ========================================================= */
import { Iso, mk, hull, r2, El, P2, P3, Rect } from './iso';
import { MAPD, BLD, PLACES } from './mapData';
import { FY } from './buildStreet';

export interface MapBuilding {
  g: El;          // whole building group (transform = map position)
  lift: El;       // the part that rises through the map surface
  shadow: El;     // ground shadow
  h: number;      // rise distance (local units)
  box: Rect;      // body bounds in map units
}
export interface MapScene { base: El; lines: El; buildings: MapBuilding[] }

/* The building the tour zooms into: a small copy of the street's office block, same proportions and
   window grid, drawn in the map assets' style (flat elements, purple strokes, grey ground shadow). */
function towerMarkup(parent: Element) {
  const u = 1.6, C = { x: 78, y: 27.75 };                      // world units → map units; base centre
  const I = new Iso(u, 0, 0), [bx, by] = I.P(C.x, C.y, 0);
  I.ox = 55 - bx; I.oy = 74 - by;                               // base centre lands where the old building stood
  const P = '#5514B4', fy = FY;
  const face = (pts: P3[], sw = 1.6, fill = '#fff') =>
    mk('polygon', { points: I.S(pts), fill, stroke: P, 'stroke-width': sw, 'stroke-linejoin': 'round' }, parent);
  const box = (x: number, y: number, z: number, w: number, d: number, h: number, sw: number) => {
    face([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], sw);
    face([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], sw);
    face([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], sw);
  };
  // ground shadow (picked up as the shadow layer by buildMap)
  mk('polygon', { points: I.S([[68, fy, 0], [88, fy, 0], [88, fy + 9, 0], [68, fy + 9, 0]]), fill: '#D9D9D9' }, parent);
  box(68, 24, 0, 20, fy - 24, 46, 2);
  box(68.6, 24.4, 46, 18.8, fy - 24.8, 0.8, 1.4);
  box(80, 25.5, 46.8, 4, 3, 2, 1.4);
  for (let z = 9.5; z < 44; z += 5.5) [70, 74.5, 79, 83.5].forEach(x => face([[x, fy, z], [x + 3.2, fy, z], [x + 3.2, fy, z + 3.2], [x, fy, z + 3.2]], 1));
  for (let z = 9.5; z < 44; z += 5.5) [25, 28.4].forEach(y => face([[88, y, z], [88, y + 2.4, z], [88, y + 2.4, z + 3.2], [88, y, z + 3.2]], 1));
  face([[77, fy, 0], [82, fy, 0], [82, fy, 5.5], [77, fy, 5.5]], 1, '#efe8fb');
  box(76.2, fy, 6.2, 6.6, 1.6, 0.4, 1);
  face([[69.4, fy, 2], [72.9, fy, 2], [72.9, fy, 5.6], [69.4, fy, 5.6]], 1);
}

/** @param pre id prefix, so several copies can live on one page */
export function buildMap(svg: SVGSVGElement, pre: string): MapScene {
  svg.setAttribute('viewBox', '0 -24 673 470');
  const defs = mk('defs', {}, svg);
  const base = mk('g', { class: 'mapBase' }, svg);
  mk('path', { d: MAPD.niShadow, class: 'mapShadow' }, base);
  mk('path', { d: MAPD.gbShadow, class: 'mapShadow' }, base);
  mk('path', { d: MAPD.gbTop, class: 'mapTop' }, base);
  mk('path', { d: MAPD.niTop, class: 'mapTop' }, base);
  const lines = mk('g', { class: 'mapLines' }, svg);
  mk('path', { d: MAPD.gbTop, class: 'mapLine' }, lines);
  mk('path', { d: MAPD.niTop, class: 'mapLine' }, lines);
  const holder = mk('g', {}, svg);

  const buildings = PLACES.map(([key, x, y, sc], i): MapBuilding => {
    const g = mk('g', { transform: `translate(${x} ${y}) scale(${sc})`, fill: 'none' }, holder);
    const tmp = mk('g', {}, g);
    if (key === 'tower') towerMarkup(tmp); else tmp.innerHTML = BLD[key].svg;
    const kids = [...tmp.children] as SVGGeometryElement[];
    const isShadow = (k: Element) => k.getAttribute('fill') === '#D9D9D9';
    const shadowG = mk('g', { class: 'bShadow' }, g);
    kids.filter(isShadow).forEach(k => shadowG.appendChild(k));
    const body = kids.filter(k => !isShadow(k));
    // White silhouette behind the line work (the assets have no face fills)
    const pts: P2[] = [];
    body.forEach(k => {
      if (!k.getTotalLength) return;
      const L = k.getTotalLength();
      for (let t = 0; t <= L; t += 1.5) { const p = k.getPointAtLength(t); pts.push([p.x, p.y]); }
    });
    const H = hull(pts);
    const xs = H.map(p => p[0]), ys = H.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    // Clip = everything above the building's footprint, so it rises up *through* the map surface
    const iL = xs.indexOf(minX), iR = xs.indexOf(maxX), n = H.length;
    const walk = (from: number, to: number, step: number) => { const out: P2[] = []; for (let k = from; ; k = (k + step + n) % n) { out.push(H[k]); if (k === to) break; } return out; };
    const c1 = walk(iL, iR, 1), c2 = walk(iL, iR, -1);
    const avg = (c: P2[]) => c.reduce((s, p) => s + p[1], 0) / c.length;
    const lower = (avg(c1) > avg(c2) ? c1 : c2).slice().reverse();
    const clip: P2[] = [[maxX + 40, -400], [maxX + 40, H[iR][1]], ...lower, [minX - 40, H[iL][1]], [minX - 40, -400]];
    const cp = mk('clipPath', { id: `${pre}-bclip${i}`, clipPathUnits: 'userSpaceOnUse' }, defs);
    mk('polygon', { points: clip.map(p => p.map(r2).join(',')).join(' ') }, cp);
    const clipG = mk('g', { 'clip-path': `url(#${pre}-bclip${i})` }, g);
    const lift = mk('g', {}, clipG);
    mk('polygon', { points: H.map(p => p.map(r2).join(',')).join(' '), class: 'bHull' }, lift);
    body.forEach(k => lift.appendChild(k));
    tmp.remove();
    const box = { x: x + minX * sc, y: y + minY * sc, w: (maxX - minX) * sc, h: (maxY - minY) * sc };
    return { g, lift, shadow: shadowG, h: maxY - minY + 6, box };
  });
  return { base, lines, buildings };
}
