'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { BrandLogo } from '@arc-ui/components/BrandLogo';
import { initWelcomeTour, prefersReducedMotion } from './animations';
import './WelcomeTour.css';

export type TourDestination = 'order' | 'orders' | 'billing' | 'inventory' | 'training';

export interface WelcomeTourContentProps {
  /** Called by "Skip tour", and after a destination card is chosen (once onNavigate has run) */
  onComplete: () => void;
  /** Called when the user picks one of the "Ready to explore?" cards. Route here (e.g. router.push). */
  onNavigate?: (destination: TourDestination) => void;
  /** User's first name for "Hey {name}," */
  userName?: string;
}

const CARDS: { key: TourDestination; label: string; micro: string; primary?: boolean; icon: ReactNode }[] = [
  { key: 'order', label: 'Order a service', micro: 'Place a new order for any customer', primary: true,
    icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path className="ic-v" d="M12 8v8" /><path d="M8 12h8" /></> },
  { key: 'orders', label: 'View orders', micro: 'Check progress across your network',
    icon: <><circle className="ic-d" cx="5" cy="7" r="1.6" /><circle className="ic-d" cx="5" cy="12" r="1.6" /><circle className="ic-d" cx="5" cy="17" r="1.6" /><path d="M9 7h11M9 12h11M9 17h11" /></> },
  { key: 'billing', label: 'View billing', micro: 'Invoices, statements and payments',
    icon: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path className="ic-r" d="M9 8h6M9 12h6M9 16h3" /></> },
  { key: 'inventory', label: 'My inventory', micro: 'Everything your customers have active',
    icon: <><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" /><rect x="13" y="13" width="7.5" height="7.5" rx="1.2" /><rect className="ic-b" x="8.25" y="3.5" width="7.5" height="7.5" rx="1.2" /></> },
  { key: 'training', label: 'Training', micro: 'Guides and courses to get the most from the portal',
    icon: <><circle cx="12" cy="12" r="8.5" /><path className="ic-p" d="M10.4 8.6l5 3.4-5 3.4z" /></> },
];

const NET_BLOCKS = [
  { k: 'm', eyebrow: 'Manage', h: 'Your whole network, in one place', p: 'Manage your sub-resellers and their end customers from a single portal, with no switching between systems and no gaps in the picture.' },
  { k: 't', eyebrow: 'Track orders', h: 'See every order, wherever it sits', p: 'Follow every order across your sub-resellers and end customers in real time, from placed to provisioned to complete.' },
  { k: 'i', eyebrow: 'Raise issues', h: 'Raise issues with complete clarity', p: 'Raise issues against any product or service and see exactly where things stand, with full visibility from first report to resolution.' },
  { k: 'e', eyebrow: 'Get started', h: 'Ready to explore?', p: 'Jump straight into the parts of the portal you’ll use most.' },
];

/**
 * Scroll-driven welcome tour.
 *
 * The component is its own scroll container and fills its parent, so the parent must have a
 * definite height (e.g. a full-screen modal, or a `position: fixed; inset: 0` wrapper).
 */
export function WelcomeTourContent({ onComplete, onNavigate, userName }: WelcomeTourContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tourRef = useRef<HTMLElement>(null);
  const uid = 'wt' + useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    // SplitText needs the final font metrics, so wait for web fonts before building.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => { if (!cancelled) cleanup = initWelcomeTour(root, uid); });
    return () => { cancelled = true; cleanup?.(); };
  }, [uid]);

  const startTour = () => {
    const scroller = scrollerRef.current, tour = tourRef.current;
    if (scroller && tour) scroller.scrollTo({ top: tour.offsetTop, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const choose = (d: TourDestination) => { onNavigate?.(d); onComplete(); };

  return (
    <div className="wt-root" ref={rootRef}>
      <header className="wt-brandbar">
        <div className="wt-logo" aria-hidden="true"><BrandLogo size={36} /></div>
        <span className="wt-brandTitle">Welcome to Wholesale</span>
        <button className="wt-skip" type="button" onClick={onComplete}>Skip tour</button>
      </header>

      <div className="wt-scroller" ref={scrollerRef}>
        {/* PART 1 — welcome + UK map */}
        <section className="wt-p1" aria-label="Welcome">
          <div className="wt-sticky wt-intro">
            <div className="wt-introCopy">
              <div className="wt-exit"><p className="wt-hey">Hey {userName?.trim() || 'there'},</p></div>
              <div className="wt-exitHead"><h1 className="wt-welcome">Welcome to Wholesale</h1></div>
              <div className="wt-exit">
                <div className="wt-cta">
                  <p className="wt-tagline">Powering connectivity and security</p>
                  <button className="wt-startBtn" type="button" onClick={startTour}>Start tour</button>
                </div>
              </div>
            </div>
            <div className="wt-mapWrap">
              <svg className="wt-map wt-mapSvg" role="img" aria-label="Map of the UK with businesses rising up across it" />
            </div>
            <p className="wt-scrollHint">Scroll to explore <span aria-hidden="true">↓</span></p>
          </div>
        </section>

        {/* PARTS 2–4 — map zoom → street → cable → router → office */}
        <section className="wt-p2" ref={tourRef} aria-label="Product tour">
          <div className="wt-sticky">
            <div className="wt-stage">
              <svg className="wt-street" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
              <svg className="wt-office" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
              <svg className="wt-mapZoom wt-mapSvg" preserveAspectRatio="xMinYMin meet" aria-hidden="true" />
              <div className="wt-stageFade" />
            </div>
            <div className="wt-copy">
              <div className="wt-copyInner">
                <div className="wt-headBlock">
                  <h2 className="wt-t1">Sell and serve connectivity for your customers</h2>
                  <h2 className="wt-s1">Whether dedicated internet access…</h2>
                  <h2 className="wt-t2">Help your customers connect with their customers, through Digital Voice for Business</h2>
                  <h2 className="wt-s2">or business-grade, fast broadband</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARTS 5–8 — network diagram → link cards */}
        <section className="wt-p3" aria-label="What you can do in the portal">
          <div className="wt-sticky">
            <div className="wt-netWrap">
              <svg className="wt-netSvg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Diagram of your account, your sub-resellers and their end customers" />
              <div className="wt-cards">
                {CARDS.map(c => (
                  <button key={c.key} className={'wt-card' + (c.primary ? ' is-primary' : '')} type="button" onClick={() => choose(c.key)}>
                    <span className="wt-ci"><svg viewBox="0 0 24 24" aria-hidden="true">{c.icon}</svg></span>
                    <span className="wt-ct"><span className="wt-cl">{c.label}</span><span className="wt-cm">{c.micro}</span></span>
                    <span className="wt-ca" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="wt-netCopy">
              {NET_BLOCKS.map(b => (
                <div className="wt-nb" data-k={b.k} key={b.k}>
                  <span className="wt-eyebrow">{b.eyebrow}</span><h2>{b.h}</h2><p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
