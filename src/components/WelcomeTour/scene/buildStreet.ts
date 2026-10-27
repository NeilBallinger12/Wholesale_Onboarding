import { Iso, hull, mk, pts2, type V2, type V3 } from './svg';

/** Office block front face (set back from the kerb so its base reads clearly). */
export const FY = 31.5;
/** The router window. */
export const WIN = { x1: 74.5, x2: 77.7, z1: 26, z2: 29.2, back: 30.3 };

export interface StreetScene {
  iso: Iso;
  cable: SVGPathElement;
  joint: SVGPathElement;
  outline: SVGPathElement;
  risers: SVGPathElement[];
  rings: SVGPathElement[];
  routerC: V3;
  /** Router window corners in SVG user space — used to clip the office layer during the fly-through. */
  windowPts: V2[];
}

/** Router redrawn from the reference: wide pill-shaped body, shallow depth, big ring, three feet. */
function drawRouter(I: Iso, parent: Element, cx: number, yf: number, z0: number, w: number, h: number, d: number) {
  const g = mk('g', {}, parent);
  const x1 = cx - w / 2, x2 = cx + w / 2, z1 = z0, z2 = z0 + h, rad = h * 0.34, cz = z0 + h / 2;
  const rr = (y: number) => {
    const pts: V3[] = [];
    const seg = 10;
    ([[x2 - rad, z1 + rad, -Math.PI / 2], [x2 - rad, z2 - rad, 0], [x1 + rad, z2 - rad, Math.PI / 2], [x1 + rad, z1 + rad, Math.PI]] as V3[]).forEach(([qx, qz, a0]) => {
      for (let i = 0; i <= seg; i++) { const a = a0 + (i / seg) * (Math.PI / 2); pts.push([qx + rad * Math.cos(a), y, qz + rad * Math.sin(a)]); }
    });
    return pts;
  };
  [x1 + w * 0.17, cx, x2 - w * 0.17].forEach((fx) => I.roundRectY(g, yf - d * 0.5, fx - 0.2, z0 - 0.08, fx + 0.2, z0 + 0.05, 0.04, 'foot'));
  mk('polygon', { points: pts2(hull([...rr(yf), ...rr(yf - d)].map((p) => I.P(...p)))), class: 'fillw' }, g);
  I.path(g, rr(yf), 'fillw', true);
  I.circY(g, cx, yf, cz, h * 0.36, 'halo', 56);
  I.circY(g, cx, yf, cz, h * 0.3, 'fillw', 56);
  I.circY(g, cx, yf, cz, h * 0.12, 'ln', 40);
  I.path(g, [[cx - 0.04, yf, z2], [cx + 0.04, yf, z2]], 'notch');
  return g;
}

/** Parts 2–3: high street with cut-away ground, office block, cable, router. */
export function buildStreet(svg: SVGSVGElement, uid: string): StreetScene {
  const I = new Iso(10);
  const root = mk('g', {}, svg);

  // Ground slab with cut-away front & right faces (shows underground)
  I.box(root, 0, 0, -10, 100, 34, 10);
  [-2.5, -8.5].forEach((z) => I.path(root, [[0, 34, z], [100, 34, z], [100, 0, z]], 'ln dots faint'));
  [-5.3, -6.7].forEach((z) => I.path(root, [[0, 34, z], [73.8, 34, z]], 'ln faint')); // duct

  // Street surface
  const s = mk('g', {}, root);
  I.path(s, [[0, 11, 0], [100, 11, 0]], 'ln');
  I.path(s, [[0, 12.5, 0], [100, 12.5, 0]], 'ln faint');
  I.path(s, [[0, 22.5, 0], [100, 22.5, 0]], 'ln');
  I.path(s, [[0, 17.5, 0], [100, 17.5, 0]], 'ln dash faint');
  for (let i = 0; i < 6; i++) I.rectZ(s, 0, 40 + i * 1.2, 13.5, 40.6 + i * 1.2, 21.5, 'win');
  for (let x = 4; x < 100; x += 8) I.path(s, [[x, 23.5, 0], [x, 34, 0]], 'ln faint');

  // High-street shops
  [{ x: 2, w: 9, h: 10 }, { x: 12, w: 8, h: 13 }, { x: 21, w: 10, h: 9 }, { x: 32, w: 8, h: 12 }, { x: 41, w: 10, h: 10 }, { x: 52, w: 9, h: 14 }].forEach(({ x, w, h }) => {
    const g = mk('g', {}, root);
    I.box(g, x, 2, 0, w, 9, h);
    I.rectY(g, 11, x + 0.8, 0.8, x + w - 3.2, 4.6, 'glass');
    I.rectY(g, 11, x + w - 2.6, 0, x + w - 0.9, 4.8);
    I.rectY(g, 11, x + 0.6, 6.0, x + w - 0.6, 7.2);
    if (h >= 10) for (let wx = x + 1.2; wx < x + w - 1.6; wx += 3) I.rectY(g, 11, wx, 8.4, wx + 1.8, h - 1.2);
    I.box(g, x + 0.4, 11, 5.2, w - 0.8, 1.6, 0.35);
  });
  const bb = mk('g', {}, root);
  I.box(bb, 64, 2, 0, 16, 9, 24);
  for (let z = 3; z < 23; z += 4) for (let x = 65.5; x < 79; x += 3.4) I.rectY(bb, 11, x, z, x + 2, z + 2.4);

  [9, 29, 49].forEach((x) => {
    const g = mk('g', {}, root);
    I.path(g, [[x, 12, 0], [x, 12, 3.2]], 'ln');
    const [cx, cy] = I.P(x, 12, 5.4);
    mk('circle', { cx, cy, r: 22, class: 'fillw' }, g);
    mk('circle', { cx: cx - 6, cy: cy + 4, r: 9, class: 'ln faint' }, g);
  });
  const car = (x: number, y: number) => {
    const g = mk('g', {}, root);
    I.box(g, x, y, 0.5, 7, 3.4, 1.8);
    I.box(g, x + 1.6, y + 0.3, 2.3, 3.6, 2.8, 1.4);
    [x + 1.4, x + 5.6].forEach((wx) => I.circY(g, wx, y + 3.4, 0.7, 0.7, 'fillw', 24));
  };
  car(14, 13.5);
  car(56, 18.2);
  [8, 28, 48].forEach((x) => {
    const g = mk('g', {}, root);
    I.path(g, [[x, 33, 0], [x, 33, 8], [x + 1.6, 33, 8]], 'ln');
    I.box(g, x + 1.2, 32.6, 7.4, 1.2, 0.8, 0.5);
  });

  // Office block
  const ob = mk('g', {}, root);
  I.box(ob, 68, 24, 0, 20, FY - 24, 46);
  I.box(ob, 68.6, 24.4, 46, 18.8, FY - 24.8, 0.8);
  I.box(ob, 80, 25.5, 46.8, 4, 3, 2);
  for (let z = 9.5; z < 44; z += 5.5) [70, 74.5, 79, 83.5].forEach((x) => { if (!(x === WIN.x1 && z === WIN.z1)) I.rectY(ob, FY, x, z, x + 3.2, z + 3.2); });
  for (let z = 9.5; z < 44; z += 5.5) [25, 28.4].forEach((y) => I.rectX(ob, 88, y, z, y + 2.4, z + 3.2));
  I.rectY(ob, FY, 77, 0, 82, 5.5, 'glass');
  I.box(ob, 76.2, FY, 6.2, 6.6, 1.6, 0.4);
  I.rectY(ob, FY, 69.4, 2, 72.9, 5.6);

  // Router window: a real opening with depth. Everything inside is clipped to the opening,
  // so the router reads as being inside the building.
  const winCorners: V3[] = [[WIN.x1, FY, WIN.z1], [WIN.x2, FY, WIN.z1], [WIN.x2, FY, WIN.z2], [WIN.x1, FY, WIN.z2]];
  const defs = mk('defs', {}, svg);
  const clipId = `${uid}-win`;
  I.poly(mk('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' }, defs), winCorners);
  const rec = mk('g', { 'clip-path': `url(#${clipId})` }, root);
  I.rectY(rec, WIN.back, WIN.x1, WIN.z1, WIN.x2, WIN.z2, 'glass');
  I.rectZ(rec, WIN.z1, WIN.x1, WIN.back, WIN.x2, FY, 'win');
  I.rectX(rec, WIN.x1, WIN.back, WIN.z1, FY, WIN.z2, 'win');
  const ryf = 31.1, rcx = 75.75, rz0 = WIN.z1 + 0.09, rh = 1.25;
  drawRouter(I, rec, rcx, ryf, rz0, 2.1, rh, 0.28);
  const rings = [0.5, 0.7, 0.9].map((r) => I.circY(rec, rcx, ryf + 0.02, rz0 + rh / 2, r, 'ring', 64));
  I.rectY(root, FY, WIN.x1, WIN.z1, WIN.x2, WIN.z2, 'pane');
  I.path(root, [[WIN.x1 + 0.4, FY, WIN.z2 - 0.5], [WIN.x1 + 1.1, FY, WIN.z2 - 0.2]], 'ln faint');

  // Cable: duct → up the cut face → across the pavement → up the facade → in through the window
  const cable = I.path(root, [[0, 34, -6], [73.8, 34, -6], [73.8, 34, 0], [73.8, FY, 0], [73.8, FY, WIN.z1 + 0.35], [WIN.x1, FY, WIN.z1 + 0.35], [74.75, 31.0, WIN.z1 + 0.35]], 'cable');
  const joint = I.circY(root, 73.8, FY, 0.5, 0.6, 'ring', 32);

  // Green "connected" lines — start at the building's base, never below it
  const gr = mk('g', {}, root);
  const outline = I.path(gr, [[68, FY, 0], [88, FY, 0], [88, 24, 0], [88, 24, 46], [68, 24, 46], [68, FY, 46]], 'green', true);
  const risers = [
    I.path(gr, [[69.3, FY, 0], [69.3, FY, 46]], 'green'),
    I.path(gr, [[78.35, FY, 0], [78.35, FY, 46]], 'green'),
    I.path(gr, [[82.85, FY, 0], [82.85, FY, 46]], 'green'),
    I.path(gr, [[88, 27.9, 0], [88, 27.9, 46]], 'green'),
  ];

  return { iso: I, cable, joint, outline, risers, rings, routerC: [rcx, ryf, rz0 + rh / 2], windowPts: winCorners.map((p) => I.P(...p)) };
}
