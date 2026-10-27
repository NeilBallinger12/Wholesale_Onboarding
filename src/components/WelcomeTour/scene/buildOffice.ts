import { Iso, mk, r2, type V3 } from './svg';

export interface Person {
  head: SVGCircleElement;
  body: SVGGElement;
  arms: SVGGElement[];
  hip: [number, number];
}
export interface OfficeScene {
  iso: Iso;
  people: Person[];
  display: SVGPolygonElement | null;
  handsetC: V3;
}

function plant(root: Element, I: Iso, x: number, y: number) {
  const g = mk('g', {}, root);
  I.box(g, x - 1, y - 1, 0, 2, 2, 2.4);
  const [cx, cy] = I.P(x, y, 4.6);
  [[0, 0, 15], [-9, 6, 10], [9, 5, 10]].forEach(([dx, dy, r]) => mk('circle', { cx: cx + dx, cy: cy + dy, r, class: 'fillw' }, g));
}

/** A desk with a seated person facing the viewer, typing on a laptop. */
function workstation(root: Element, I: Iso, scene: OfficeScene, x: number, y: number, focus = false) {
  const g = mk('g', {}, root);
  const u = I.u;
  const px = x + 6.5, py = y - 2.6;
  I.box(g, px - 1.6, py - 1.6, 3.6, 3.2, 0.5, 5); // chair back
  I.box(g, px - 1.5, py - 1.2, 3.6, 3, 2.6, 0.5); // seat
  I.path(g, [[px, py, 0], [px, py, 3.6]], 'ln');
  const body = mk('g', {}, g);
  const [tx, ty] = I.P(px, py, 6.6);
  mk('rect', { x: tx - 1.4 * u, y: ty - 2.4 * u, width: 2.8 * u, height: 4.6 * u, rx: 1.3 * u, class: 'fillw' }, body);
  const [hx, hy] = I.P(px, py, 10.4);
  const head = mk('circle', { cx: hx, cy: hy, r: 1.05 * u, class: 'fillw' }, body);
  // desk
  I.box(g, x, y, 0, 0.5, 6, 7);
  I.box(g, x + 12.5, y, 0, 0.5, 6, 7);
  I.box(g, x, y, 7, 13, 6, 0.5);
  I.box(g, x + 4.5, y + 1.2, 7.5, 4, 2.4, 0.22); // laptop base
  // arms (over the desk, under the laptop screen)
  const arms = [-1, 1].map((side) => {
    const a = mk('g', {}, g);
    const [sx, sy] = I.P(px + side * 1.05, py + 0.3, 8.4);
    const [ex, ey] = I.P(x + 6.5 + side * 0.9, y + 2.2, 7.8);
    mk('path', { d: `M${r2(sx)},${r2(sy)} Q${r2((sx + ex) / 2 + side * 6)},${r2((sy + ey) / 2 + 4)} ${r2(ex)},${r2(ey)}`, class: 'arm' }, a);
    mk('circle', { cx: ex, cy: ey, r: 0.32 * u, class: 'fillw' }, a);
    return a;
  });
  I.box(g, x + 4.5, y + 3.6, 7.6, 4, 0.22, 3); // laptop screen (back faces us)
  I.circY(g, x + 6.5, y + 3.82, 9.1, 0.35, 'ln faint', 20);
  if (focus) {
    const hx2 = x + 9.6, hy2 = y + 1.6;
    const hg = mk('g', {}, g);
    I.box(hg, hx2, hy2, 7.5, 2.2, 1.8, 0.45);
    I.box(hg, hx2 + 0.1, hy2 + 0.15, 7.95, 0.55, 1.5, 0.4); // receiver
    scene.display = I.rectZ(hg, 7.95, hx2 + 0.9, hy2 + 0.25, hx2 + 2, hy2 + 0.75, 'glass');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) I.rectZ(hg, 7.95, hx2 + 0.95 + i * 0.36, hy2 + 0.95 + j * 0.36, hx2 + 1.17 + i * 0.36, hy2 + 1.17 + j * 0.36, 'win');
    scene.handsetC = [hx2 + 1.1, hy2 + 0.9, 7.9];
  } else {
    I.box(g, x + 9.4, y + 1.4, 7.5, 2.4, 1.6, 0.08); // papers
  }
  I.box(g, x + 1.5, y + 3.8, 7.5, 0.7, 0.7, 0.9); // mug
  const [shx, shy] = I.P(px, py, 8.6);
  scene.people.push({ head, body, arms, hip: [shx, shy + 2.4 * u] });
}

/** Part 4: office interior laid out in zones. */
export function buildOffice(svg: SVGSVGElement): OfficeScene {
  const I = new Iso(10);
  const scene: OfficeScene = { iso: I, people: [], display: null, handsetC: [0, 0, 0] };
  mk('rect', { x: -20000, y: -20000, width: 40000, height: 40000, class: 'bgfill' }, svg);
  const root = mk('g', {}, svg);
  I.box(root, -1, -1, 0, 66, 1, 22); // back wall
  I.box(root, -1, 0, 0, 1, 47, 22); // side wall
  I.box(root, 0, 0, -1, 65, 47, 1); // floor
  I.rectY(root, 0, 20, 7, 40, 17, 'glass');
  [26.67, 33.33].forEach((x) => I.path(root, [[x, 0, 7], [x, 0, 17]], 'ln'));
  I.rectX(root, 0, 12, 7, 24, 17, 'glass');
  I.path(root, [[0, 18, 7], [0, 18, 17]], 'ln');
  // Clock + shelving
  I.circY(root, 10, 0, 13, 1.3, 'fillw', 40);
  I.path(root, [[10, 0, 13], [10, 0, 13.9]], 'ln');
  I.path(root, [[10, 0, 13], [10.6, 0, 13]], 'ln');
  const sh = mk('g', {}, root);
  I.box(sh, 47, 0, 0, 13, 2.2, 9.5);
  [3.2, 6.4].forEach((z) => I.path(sh, [[47, 2.2, z], [60, 2.2, z]], 'ln'));
  [[48, 3.4, 1.4], [49.7, 3.4, 1.8], [53, 6.6, 1.3], [57, 0.2, 1.6], [55.5, 6.6, 2.2]].forEach(([x, z, hh]) => I.rectY(sh, 2.2, x, z, x + 0.9, z + hh, 'win'));
  I.rectZ(root, 0.01, 1.5, 28, 15, 45, 'ln faint dash'); // lounge rug

  workstation(root, I, scene, 6, 8);
  workstation(root, I, scene, 37, 9);
  // Meeting table with two chairs
  const mt = mk('g', {}, root);
  [[26, 17.2], [32, 17.2]].forEach(([x, y]) => { I.box(mt, x - 1.3, y - 1.3, 3.6, 2.6, 2.4, 0.5); I.box(mt, x - 1.3, y - 1.6, 3.6, 2.6, 0.4, 4.2); });
  I.path(mt, [[29, 20.5, 0], [29, 20.5, 6.8]], 'ln');
  I.circZ(mt, 29, 20.5, 7, 3.4, 'fillw', 56);
  I.box(mt, 27.6, 20, 7, 0.6, 0.6, 0.8);
  I.box(mt, 30.4, 21.2, 7, 0.6, 0.6, 0.8);
  plant(root, I, 3, 25);
  // Sofa + coffee table
  const so = mk('g', {}, root);
  I.box(so, 0.2, 30, 0, 1.4, 11, 5);
  I.box(so, 1.6, 30, 0, 3.6, 11, 2.4);
  I.box(so, 1.6, 29, 0, 3.6, 1, 3.6);
  I.box(so, 1.6, 41, 0, 3.6, 1, 3.6);
  I.path(so, [[1.6, 35.5, 2.4], [5.2, 35.5, 2.4]], 'ln faint');
  I.path(root, [[10, 36, 0], [10, 36, 2.8]], 'ln');
  I.circZ(root, 10, 36, 3, 2.2, 'fillw', 48);
  workstation(root, I, scene, 19, 29, true); // focus desk
  workstation(root, I, scene, 43, 30);
  plant(root, I, 61, 43);
  [[12.5, 11], [43.5, 12], [25.5, 32], [49.5, 33]].forEach(([x, y]) => {
    I.path(root, [[x, y, 22], [x, y, 17.5]], 'ln faint');
    I.circZ(root, x, y, 17.2, 1.1, 'fillw', 28);
  });
  return scene;
}
