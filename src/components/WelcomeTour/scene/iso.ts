/* =========================================================
   Isometric drawing helpers
   World axes: x → down-right, y → down-left, z → up.
   ========================================================= */
export type P2 = [number, number];
export type P3 = [number, number, number];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type El = any; // SVG elements built at runtime; GSAP targets them directly

export const NS = 'http://www.w3.org/2000/svg';
export const C30 = Math.cos(Math.PI / 6);
export const r2 = (n: number) => Math.round(n * 100) / 100;

export function mk(tag: string, attrs: Record<string, string | number | null | undefined>, parent?: Element | null): El {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(e);
  return e;
}

export class Iso {
  constructor(public u = 10, public ox = 0, public oy = 0) {}
  P(x: number, y: number, z = 0): P2 { return [this.ox + (x - y) * C30 * this.u, this.oy + (x + y) * 0.5 * this.u - z * this.u]; }
  S(list: P3[]) { return list.map(p => this.P(...p).map(r2).join(',')).join(' '); }
  d(list: P3[], closed?: boolean) { return 'M' + list.map(p => this.P(...p).map(r2).join(',')).join('L') + (closed ? 'Z' : ''); }
  g(parent: Element, attrs = {}) { return mk('g', attrs, parent); }
  poly(parent: Element, list: P3[], cls?: string) { return mk('polygon', { points: this.S(list), class: cls }, parent); }
  path(parent: Element, list: P3[], cls?: string, closed?: boolean, id?: string) { return mk('path', { d: this.d(list, closed), class: cls, id }, parent); }
  box(parent: Element, x: number, y: number, z: number, w: number, d: number, h: number, cls = 'solid') {
    const g = mk('g', { class: cls }, parent);
    this.poly(g, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
    this.poly(g, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]);
    this.poly(g, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);
    return g;
  }
  rectY(p: Element, y: number, x1: number, z1: number, x2: number, z2: number, cls = 'win') { return this.poly(p, [[x1, y, z1], [x2, y, z1], [x2, y, z2], [x1, y, z2]], cls); }
  rectX(p: Element, x: number, y1: number, z1: number, y2: number, z2: number, cls = 'win') { return this.poly(p, [[x, y1, z1], [x, y2, z1], [x, y2, z2], [x, y1, z2]], cls); }
  rectZ(p: Element, z: number, x1: number, y1: number, x2: number, y2: number, cls = 'win') { return this.poly(p, [[x1, y1, z], [x2, y1, z], [x2, y2, z], [x1, y2, z]], cls); }
  circY(p: Element, cx: number, y: number, cz: number, r: number, cls: string, n = 48) {
    const pts: P3[] = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); }
    return this.path(p, pts, cls, true);
  }
  circZ(p: Element, cx: number, cy: number, z: number, r: number, cls: string, n = 40) {
    const pts: P3[] = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); }
    return this.path(p, pts, cls, true);
  }
  roundRectY(p: Element, y: number, x1: number, z1: number, x2: number, z2: number, rad: number, cls: string) {
    const pts: P3[] = [], seg = 6;
    const corners: P3[] = [[x2 - rad, z1 + rad, -Math.PI / 2], [x2 - rad, z2 - rad, 0], [x1 + rad, z2 - rad, Math.PI / 2], [x1 + rad, z1 + rad, Math.PI]];
    for (const [cx, cz, a0] of corners) for (let i = 0; i <= seg; i++) { const a = a0 + i / seg * Math.PI / 2; pts.push([cx + rad * Math.cos(a), y, cz + rad * Math.sin(a)]); }
    return this.path(p, pts, cls, true);
  }
}

/** Convex hull (monotone chain) of 2D points */
export function hull(points: P2[]): P2[] {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: P2[] = [], up: P2[] = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

export interface Box3 { x1: number; x2: number; y1: number; y2: number; z1: number; z2: number }
export interface Rect { x: number; y: number; w: number; h: number }

/** 8 corners of a world-space box */
export const corners = (b: Box3): P3[] =>
  [b.x1, b.x2].flatMap(x => [b.y1, b.y2].flatMap(y => [b.z1, b.z2].map(z => [x, y, z] as P3)));

/** 2D bounding box (svg units) of a set of world points */
export function isoBox(iso: Iso, pts: P3[]): Rect {
  const q = pts.map(p => iso.P(...p)), xs = q.map(p => p[0]), ys = q.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
