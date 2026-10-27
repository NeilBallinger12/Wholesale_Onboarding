import { BLD, MAPD, PLACES } from './mapData';
import { hull, mk, pts2, r2, type V2 } from './svg';

export interface MapBuilding {
  lift: SVGGElement;
  shadow: SVGGElement;
  /** Height of the building in map units — how far below the surface it starts. */
  h: number;
}
export interface MapScene {
  tops: SVGPathElement[];
  shadows: SVGPathElement[];
  lines: SVGPathElement[];
  buildings: MapBuilding[];
}

/** Part 1: the UK map plus the seven buildings, each clipped so it can rise up *through* the map surface. */
export function buildMap(svg: SVGSVGElement, uid: string): MapScene {
  svg.setAttribute('viewBox', '0 -24 673 470');
  const defs = mk('defs', {}, svg);
  const base = mk('g', {}, svg);
  const shadows = [mk('path', { d: MAPD.niShadow, class: 'mapShadow' }, base), mk('path', { d: MAPD.gbShadow, class: 'mapShadow' }, base)];
  const tops = [mk('path', { d: MAPD.gbTop, class: 'mapTop' }, base), mk('path', { d: MAPD.niTop, class: 'mapTop' }, base)];
  const lineG = mk('g', {}, svg);
  const lines = [mk('path', { d: MAPD.gbTop, class: 'mapLine' }, lineG), mk('path', { d: MAPD.niTop, class: 'mapLine' }, lineG)];
  const holder = mk('g', {}, svg);

  const buildings = PLACES.map(([key, x, y, sc], i): MapBuilding => {
    const g = mk('g', { transform: `translate(${x} ${y}) scale(${sc})`, fill: 'none' }, holder);
    const tmp = mk('g', {}, g);
    tmp.innerHTML = BLD[key].svg;
    const kids = Array.from(tmp.children) as SVGGraphicsElement[];
    const isShadow = (k: Element) => k.getAttribute('fill') === '#D9D9D9';
    const shadow = mk('g', { class: 'bShadow' }, g);
    kids.filter(isShadow).forEach((k) => shadow.appendChild(k));
    const body = kids.filter((k) => !isShadow(k));

    // White silhouette behind the line work (the assets have no face fills)
    const pts: V2[] = [];
    body.forEach((k) => {
      if (!(k instanceof SVGGeometryElement)) return;
      const L = k.getTotalLength();
      for (let t = 0; t <= L; t += 1.5) { const p = k.getPointAtLength(t); pts.push([p.x, p.y]); }
    });
    const H = hull(pts);
    const xs = H.map((p) => p[0]);
    const ys = H.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);

    // Clip = everything above the building's footprint (the lower edge of its hull)
    const iL = xs.indexOf(minX), iR = xs.indexOf(maxX), n = H.length;
    const walk = (from: number, to: number, step: number) => { const out: V2[] = []; for (let k = from; ; k = (k + step + n) % n) { out.push(H[k]); if (k === to) break; } return out; };
    const c1 = walk(iL, iR, 1), c2 = walk(iL, iR, -1);
    const avg = (c: V2[]) => c.reduce((s, p) => s + p[1], 0) / c.length;
    const lower = (avg(c1) > avg(c2) ? c1 : c2).slice().reverse();
    const clip: V2[] = [[maxX + 40, -400], [maxX + 40, H[iR][1]], ...lower, [minX - 40, H[iL][1]], [minX - 40, -400]];
    const cpId = `${uid}-bclip${i}`;
    const cp = mk('clipPath', { id: cpId, clipPathUnits: 'userSpaceOnUse' }, defs);
    mk('polygon', { points: pts2(clip) }, cp);

    const clipG = mk('g', { 'clip-path': `url(#${cpId})` }, g);
    const lift = mk('g', {}, clipG);
    mk('polygon', { points: pts2(H), class: 'bHull' }, lift);
    body.forEach((k) => lift.appendChild(k));
    tmp.remove();
    return { lift, shadow, h: r2(maxY - minY + 6) };
  });

  return { tops, shadows, lines, buildings };
}
