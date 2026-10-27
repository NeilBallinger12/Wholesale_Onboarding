/* Isometric SVG drawing helpers.
   World axes: x → down-right, y → down-left, z → up. */

export type V2 = [number, number];
export type V3 = [number, number, number];
type Attrs = Record<string, string | number | null | undefined>;

export const NS = 'http://www.w3.org/2000/svg';
const C30 = Math.cos(Math.PI / 6);

export const r2 = (n: number) => Math.round(n * 100) / 100;
export const pts2 = (p: V2[]) => p.map((q) => q.map(r2).join(',')).join(' ');

/** Create an SVG element. Class names are automatically prefixed with `wt-` so they can't clash with host styles. */
export function mk<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element | null): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (v == null) continue;
    e.setAttribute(k, k === 'class' ? String(v).split(/\s+/).filter(Boolean).map((c) => 'wt-' + c).join(' ') : String(v));
  }
  if (parent) parent.appendChild(e);
  return e;
}

/** Convex hull (monotone chain). */
export function hull(points: V2[]): V2[] {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: V2, a: V2, b: V2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: V2[] = [];
  const up: V2[] = [];
  for (const q of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of p.reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

export class Iso {
  constructor(public u = 10, public ox = 0, public oy = 0) {}

  P(x: number, y: number, z = 0): V2 {
    return [this.ox + (x - y) * C30 * this.u, this.oy + (x + y) * 0.5 * this.u - z * this.u];
  }
  S(list: V3[]) {
    return pts2(list.map((p) => this.P(...p)));
  }
  d(list: V3[], closed = false) {
    return 'M' + list.map((p) => this.P(...p).map(r2).join(',')).join('L') + (closed ? 'Z' : '');
  }
  poly(parent: Element, list: V3[], cls?: string) {
    return mk('polygon', { points: this.S(list), class: cls }, parent);
  }
  path(parent: Element, list: V3[], cls?: string, closed = false) {
    return mk('path', { d: this.d(list, closed), class: cls }, parent);
  }
  box(parent: Element, x: number, y: number, z: number, w: number, d: number, h: number, cls = 'solid') {
    const g = mk('g', { class: cls }, parent);
    this.poly(g, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
    this.poly(g, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]);
    this.poly(g, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);
    return g;
  }
  rectY(p: Element, y: number, x1: number, z1: number, x2: number, z2: number, cls = 'win') {
    return this.poly(p, [[x1, y, z1], [x2, y, z1], [x2, y, z2], [x1, y, z2]], cls);
  }
  rectX(p: Element, x: number, y1: number, z1: number, y2: number, z2: number, cls = 'win') {
    return this.poly(p, [[x, y1, z1], [x, y2, z1], [x, y2, z2], [x, y1, z2]], cls);
  }
  rectZ(p: Element, z: number, x1: number, y1: number, x2: number, y2: number, cls = 'win') {
    return this.poly(p, [[x1, y1, z], [x2, y1, z], [x2, y2, z], [x1, y2, z]], cls);
  }
  circY(p: Element, cx: number, y: number, cz: number, r: number, cls?: string, n = 48) {
    const pts: V3[] = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); }
    return this.path(p, pts, cls, true);
  }
  circZ(p: Element, cx: number, cy: number, z: number, r: number, cls?: string, n = 40) {
    const pts: V3[] = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); }
    return this.path(p, pts, cls, true);
  }
  roundRectY(p: Element, y: number, x1: number, z1: number, x2: number, z2: number, rad: number, cls?: string) {
    const pts: V3[] = [];
    const seg = 6;
    const corners: V3[] = [[x2 - rad, z1 + rad, -Math.PI / 2], [x2 - rad, z2 - rad, 0], [x1 + rad, z2 - rad, Math.PI / 2], [x1 + rad, z1 + rad, Math.PI]];
    for (const [cx, cz, a0] of corners) for (let i = 0; i <= seg; i++) { const a = a0 + (i / seg) * (Math.PI / 2); pts.push([cx + rad * Math.cos(a), y, cz + rad * Math.sin(a)]); }
    return this.path(p, pts, cls, true);
  }
}
