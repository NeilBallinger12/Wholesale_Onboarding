/* =========================================================
   PARTS 5–8 — one network diagram that evolves with scroll
   (you → sub-resellers → end customers)
   ========================================================= */
import { mk, El, P2 } from './iso';

const RESELLERS = [
  { name: 'Northline Comms', rx: 115, customers: ['Ashford Dental', 'Mill Lane Bakery', 'Corran Legal'] },
  { name: 'Brightwave IT', rx: 315, customers: ['Peak Logistics', 'Elm Street Vets'] },
  { name: 'Harbour Networks', rx: 515, customers: ['Quayside Hotel', 'Tidewell Surveys', 'Fenwick & Co'] },
  { name: 'Kestrel Digital', rx: 715, customers: ['Orchard Pharmacy', 'Lumen Studios'] },
];
type Reseller = typeof RESELLERS[number];
const NODE_Y = { you: 70, res: 240, cust0: 350, custStep: 56 };

export interface NetNode { g: El; bg: El; shadow: El | null; content: El; cx: number; cy: number; w: number; h: number; line?: El; r?: Reseller; i?: number }
export interface Chip { g: El; dot: El; pts: P2[] }
export interface NetScene {
  lines: El; you: NetNode; res: NetNode[]; cust: NetNode[]; resLines: El[]; custLines: El[];
  outline: El; track: El; countNum: El; steps: El[]; chips: Chip[];
  hit: NetNode; badge: El; tick: El; ring: El; ticketLine: El; ticket: El; pills: El[]; thread: El[];
}

type Icon = (g: Element, cx: number, cy: number, s: number, cls: string) => void;
const iconBuilding: Icon = (g, cx, cy, s, cls) => {
  mk('path', { d: `M${cx - s * .45},${cy + s * .5}V${cy - s * .3}L${cx},${cy - s * .55}L${cx + s * .45},${cy - s * .3}V${cy + s * .5}Z`, class: cls }, g);
  ([[-.2, -.12], [.2, -.12], [-.2, .2], [.2, .2]] as P2[]).forEach(([dx, dy]) => mk('rect', { x: cx + dx * s - s * .07, y: cy + dy * s - s * .07, width: s * .14, height: s * .14, class: cls }, g));
};
const iconPerson: Icon = (g, cx, cy, s, cls) => {
  mk('circle', { cx, cy: cy - s * .18, r: s * .2, class: cls }, g);
  mk('path', { d: `M${cx - s * .4},${cy + s * .48}C${cx - s * .4},${cy + s * .1} ${cx + s * .4},${cy + s * .1} ${cx + s * .4},${cy + s * .48}`, class: cls }, g);
};
const iconHub: Icon = (g, cx, cy, s, cls) => {
  mk('circle', { cx, cy, r: s * .16, class: cls }, g);
  ([[-.38, -.3], [.38, -.3], [0, .42]] as P2[]).forEach(([dx, dy]) => {
    mk('line', { x1: cx, y1: cy, x2: cx + dx * s, y2: cy + dy * s, class: cls }, g);
    mk('circle', { cx: cx + dx * s, cy: cy + dy * s, r: s * .1, class: cls }, g);
  });
};

function netNode(parent: Element, kind: 'you' | 'res' | 'cust', cx: number, cy: number, w: number, h: number, title: string, sub?: string): NetNode {
  const g = mk('g', { class: 'node node-' + kind }, parent);
  const shadow = kind === 'cust' ? null : mk('rect', { x: cx - w / 2 + 5, y: cy - h / 2 + 6, width: w, height: h, rx: 12, class: 'nshadow' }, g);
  const bg = mk('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: kind === 'cust' ? 9 : 12, class: 'nbg' }, g);
  const content = mk('g', {}, g);
  const icx = cx - w / 2 + h / 2, ir = h * 0.3;
  mk('circle', { cx: icx, cy, r: ir, class: 'nicon' }, content);
  (kind === 'you' ? iconHub : kind === 'res' ? iconPerson : iconBuilding)(content, icx, cy, ir * 1.25, 'nglyph');
  const tx = cx - w / 2 + h + (kind === 'cust' ? -2 : 4);
  const t = mk('text', { x: tx, y: sub ? cy - 2 : cy + 4.5, class: 'ntitle' }, content); t.textContent = title;
  if (sub) { const st = mk('text', { x: tx, y: cy + 14, class: 'nsub' }, content); st.textContent = sub; }
  return { g, bg, shadow, content, cx, cy, w, h };
}

const txt = (parent: Element, attrs: Record<string, string | number>, text: string) => { const t = mk('text', attrs, parent); t.textContent = text; return t; };

export function buildNetwork(svg: SVGSVGElement): NetScene {
  svg.setAttribute('viewBox', '0 0 820 620');
  const lines = mk('g', { class: 'nlines' }, svg);
  const custG = mk('g', {}, svg), resG = mk('g', {}, svg);
  const resLines: El[] = [], custLines: El[] = [], res: NetNode[] = [], cust: NetNode[] = [];
  const custByName: Record<string, NetNode> = {};
  RESELLERS.forEach((r, i) => {
    resLines.push(mk('path', { d: `M410,100V170H${r.rx}V212`, class: 'nline' }, lines));
    res.push(netNode(resG, 'res', r.rx, NODE_Y.res, 176, 56, r.name, 'Sub-reseller'));
    r.customers.forEach((c, j) => {
      const cy = NODE_Y.cust0 + j * NODE_Y.custStep;
      const line = mk('path', { d: `M${r.rx - 66},268V${cy}H${r.rx - 50}`, class: 'nline nline-c' }, lines);
      const node = netNode(custG, 'cust', r.rx + 15, cy, 130, 38, c);
      node.line = line; node.r = r; node.i = i;
      custLines.push(line); cust.push(node); custByName[c] = node;
    });
  });
  const you = netNode(svg, 'you', 410, NODE_Y.you, 200, 62, 'You', 'Your Wholesale account');
  // "One portal" outline
  const outline = mk('rect', { x: 18, y: 18, width: 784, height: 500, rx: 26, class: 'noutline' }, svg);

  // Track orders: status timeline + counter
  const track = mk('g', { class: 'ntrack' }, svg);
  mk('rect', { x: 18, y: 540, width: 784, height: 62, rx: 14, class: 'npanel' }, track);
  const ct = mk('text', { x: 44, y: 578, class: 'ncount' }, track);
  const countNum = mk('tspan', { class: 'ncountNum' }, ct); countNum.textContent = '0';
  const rest = mk('tspan', {}, ct); rest.textContent = ' active orders';
  const stepDefs: [string, number, string][] = [['Placed', 430, '#8f84a8'], ['In progress', 575, '#e8a317'], ['Complete', 730, '#00A651']];
  mk('line', { x1: 430, y1: 571, x2: 730, y2: 571, class: 'nstepLine' }, track);
  const steps = stepDefs.map(([label, x, col]) => {
    mk('circle', { cx: x, cy: 571, r: 7, class: 'nstepBase' }, track);
    const lit = mk('circle', { cx: x, cy: 571, r: 7, fill: col, class: 'nstepLit' }, track);
    txt(track, { x, y: 594, class: 'nstepLabel' }, label);
    return lit;
  });
  // Order chips on four customers, each travelling up the branches to "You"
  const chipData = [['Ashford Dental', 'ORD-48213'], ['Peak Logistics', 'ORD-48227'], ['Quayside Hotel', 'ORD-48231'], ['Orchard Pharmacy', 'ORD-48240']];
  const chips = chipData.map(([cname, ref]): Chip => {
    const n = custByName[cname], rx = n.r!.rx;
    const g = mk('g', { class: 'nchip' }, svg);
    mk('rect', { x: -40, y: -11, width: 80, height: 22, rx: 11, class: 'nchipBg' }, g);
    const dot = mk('circle', { cx: -27, cy: 0, r: 4.5, fill: '#b8b2c4' }, g);
    txt(g, { x: -18, y: 4, class: 'nchipText' }, ref);
    const pts: P2[] = [[n.cx + 26, n.cy - 26], [rx - 66, n.cy - 26], [rx - 66, 268], [rx, 240], [rx, 170], [410, 170], [410, 92]];
    return { g, dot, pts };
  });

  // Raise issues: badge + ticket on one customer
  const hit = custByName['Elm Street Vets'];
  const bx = hit.cx + hit.w / 2 - 4, by = hit.cy - hit.h / 2 + 2;
  const badge = mk('g', { class: 'nbadge' }, svg);
  mk('circle', { cx: bx, cy: by, r: 10, fill: '#e8a317' }, badge);
  txt(badge, { x: bx, y: by + 4.5, class: 'nbadgeMark' }, '!');
  const tick = mk('g', { class: 'nbadge' }, svg);
  mk('circle', { cx: bx, cy: by, r: 10, fill: '#00A651' }, tick);
  mk('path', { d: `M${bx - 4.5},${by}l3,3.2l6,-6.4`, class: 'ntickMark' }, tick);
  const ring = mk('circle', { cx: bx, cy: by, r: 10, class: 'nring' }, svg);
  const ticketLine = mk('path', { d: `M${hit.cx + hit.w / 2},${hit.cy}H${hit.cx + hit.w / 2 + 18}V372H${445}`, class: 'nline nticketLine' }, svg);
  const ticket = mk('g', { class: 'nticket' }, svg);
  mk('rect', { x: 445, y: 318, width: 250, height: 196, rx: 14, class: 'ntkBg' }, ticket);
  txt(ticket, { x: 465, y: 348, class: 'ntkRef' }, 'INC-20417');
  const pills = ([['Open', '#fdf1d6', '#9a6400'], ['In review', '#efe8fb', '#5514B4'], ['Resolved', '#ddf4e6', '#00753a']]).map(([label, bg, fg]) => {
    const g = mk('g', {}, ticket);
    mk('rect', { x: 598, y: 333, width: 80, height: 22, rx: 11, fill: bg }, g);
    txt(g, { x: 638, y: 348, class: 'ntkPill', fill: fg }, label);
    return g;
  });
  txt(ticket, { x: 465, y: 374, class: 'ntkProduct' }, 'Business Broadband 900');
  txt(ticket, { x: 465, y: 392, class: 'ntkMeta' }, 'Elm Street Vets · via Brightwave IT');
  mk('line', { x1: 465, y1: 406, x2: 675, y2: 406, class: 'ntkRule' }, ticket);
  const thread = [['09:12', 'Intermittent drop-outs reported'], ['10:05', 'Engineer assigned, line test booked'], ['13:40', 'Fault cleared at the exchange']].map(([time, msg], k) => {
    const g = mk('g', {}, ticket);
    const y = 430 + k * 26;
    mk('circle', { cx: 470, cy: y - 4, r: 3.5, class: 'ntkDot' }, g);
    txt(g, { x: 482, y, class: 'ntkTime' }, time);
    txt(g, { x: 522, y, class: 'ntkMsg' }, msg);
    return g;
  });
  return { lines, you, res, cust, resLines, custLines, outline, track, countNum, steps, chips, hit, badge, tick, ring, ticketLine, ticket, pills, thread };
}
