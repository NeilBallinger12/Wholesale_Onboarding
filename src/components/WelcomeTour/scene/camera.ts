import { r2, type Iso, type V3 } from './svg';

/** Width (px) of the component at which it switches to the stacked mobile layout. */
export const MOBILE_BREAKPOINT = 760;

/**
 * Returns a viewBox that fits a world-space box (bw × bh, in projected SVG units) around `pt`
 * into the "subject area" of the stage: the right side on desktop, the lower part on mobile,
 * so the subject never sits under the copy. `centred` puts it in the middle instead.
 */
export function cam(stage: HTMLElement, iso: Iso, pt: V3, bw: number, bh: number, centred = false): string {
  const W = stage.clientWidth || 1, H = stage.clientHeight || 1, r = H / W;
  const m = W <= MOBILE_BREAKPOINT;
  const fracW = m ? 0.95 : 0.58, fracH = m ? 0.52 : 0.86;
  const fx = centred ? 0.5 : m ? 0.5 : 0.69;
  const fy = centred ? 0.5 : m ? 0.7 : 0.5;
  const [cx, cy] = iso.P(...pt);
  const w = Math.max(bw / fracW, bh / (fracH * r)), h = w * r;
  return `${r2(cx - w * fx)} ${r2(cy - h * fy)} ${r2(w)} ${r2(h)}`;
}
