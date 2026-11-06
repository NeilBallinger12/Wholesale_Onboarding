/* =========================================================
   Camera: each scene SVG's viewBox is the camera.
   Fits a box (svg units) into the "subject area" of the stage:
   the right 58% on desktop, the lower half on narrow containers,
   so subjects never sit under the copy.
   ========================================================= */
import { Iso, r2, P3 } from './iso';

export const NARROW = 760;   // container width (px) at which the layout stacks

export function makeCamera(stage: HTMLElement) {
  const size = () => [stage.clientWidth || 1, stage.clientHeight || 1] as const;
  const isNarrow = () => size()[0] <= NARROW;
  function camXY(cx: number, cy: number, bw: number, bh: number, centred = false) {
    const [W, H] = size(), r = H / W, m = isNarrow();
    const fracW = m ? 0.95 : 0.58, fracH = m ? 0.52 : 0.86;
    const fx = centred ? 0.5 : (m ? 0.5 : 0.69), fy = centred ? 0.5 : (m ? 0.7 : 0.5);
    const w = Math.max(bw / fracW, bh / (fracH * r)), h = w * r;
    return `${r2(cx - w * fx)} ${r2(cy - h * fy)} ${r2(w)} ${r2(h)}`;
  }
  const cam = (iso: Iso, pt: P3, bw: number, bh: number, centred = false) => { const [cx, cy] = iso.P(...pt); return camXY(cx, cy, bw, bh, centred); };
  return { size, isNarrow, camXY, cam };
}
