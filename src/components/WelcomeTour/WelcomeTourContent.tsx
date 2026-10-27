'use client';

import { useEffect, useId, useRef } from 'react';
import { BrandLogo } from '@arc-ui/components/BrandLogo';
import { ButtonV2 } from '@arc-ui/components/ButtonV2';
import { initWelcomeTour, prefersReducedMotion } from './animations';
import './WelcomeTour.css';

export interface WelcomeTourContentProps {
  onComplete: () => void;
  userName?: string;
}

export function WelcomeTourContent({ onComplete, userName }: WelcomeTourContentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tourRef = useRef<HTMLElement>(null);
  const uid = 'wt' + useId().replace(/[^a-zA-Z0-9_-]/g, '');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (!cancelled) cleanup = initWelcomeTour(root, uid);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [uid]);

  const startTour = () => {
    const root = rootRef.current, tour = tourRef.current;
    if (root && tour) root.scrollTo({ top: tour.offsetTop, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const name = userName?.trim();

  return (
    <div ref={rootRef} className="wt-root" role="region" aria-label="Welcome to Wholesale tour">
      {/* Progress indicator — right side */}
      <div className="wt-progress" data-wt="progress">
        <div className="wt-progressTrack">
          <div className="wt-progressFill" data-wt="progressFill" />
        </div>
      </div>

      <div className="wt-bar">
        <div className="wt-barInner">
          <span className="wt-brandTitle" data-wt="brandTitle" aria-hidden="true">Welcome to Wholesale</span>
          <button type="button" className="wt-close" onClick={onComplete}>
            Skip tour
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>
          </button>
        </div>
      </div>

      {/* Part 1 — welcome + map */}
      <section className="wt-p1" data-wt="p1">
        <div className="wt-sticky">
          <div className="wt-intro">
            <div className="wt-introCopy">
              <div className="wt-exit" data-wt="introLogo" style={{ marginBottom: '8px' }}>
                <BrandLogo size={108} />
              </div>
              <div className="wt-exit"><p className="wt-hey" data-wt="hey">Hey {name || 'there'},</p></div>
              <div data-wt="exitHead"><h1 className="wt-welcome" data-wt="welcome">Welcome to Wholesale</h1></div>
              <div className="wt-exit">
                <div className="wt-cta" data-wt="cta">
                  <p className="wt-tagline" data-wt="tagline">Powering connectivity and security for 800,000 businesses across the UK.</p>
                  <div data-wt="startBtn">
                    <ButtonV2
                      label="Start tour"
                      buttonStyle="primary"
                      size="m"
                      onClick={startTour}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="wt-mapWrap wt-exit">
              <svg className="wt-map" data-wt="map" role="img" aria-label="Map of the UK with businesses rising up across it" />
            </div>
          </div>
          <p className="wt-scrollHint" data-wt="scrollHint" aria-hidden="true">Scroll to explore <span>↓</span></p>
        </div>
      </section>

      {/* Parts 2–4 — street, router, office */}
      <section className="wt-p2" data-wt="p2" ref={tourRef} aria-label="Product tour">
        <div className="wt-sticky">
          <div className="wt-stage" data-wt="stage">
            <svg className="wt-scene" data-wt="street" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
            <svg className="wt-scene wt-office" data-wt="office" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
          </div>
          <div className="wt-copy wt-copyBg">
            <div className="wt-stack">
              <h2 data-wt="t1">Sell and serve connectivity for your customers</h2>
              <h2 data-wt="t2">Help customers connect</h2>
            </div>
            <div className="wt-stack">
              <p className="wt-subHeadline" data-wt="s1">Whether dedicated internet access…</p>
              <p className="wt-subHeadline" data-wt="s2">Connect customers and colleagues through Digital Voice</p>
            </div>
            <div className="wt-finish" data-wt="finish">
              <ButtonV2
                label="Get started"
                buttonStyle="primary"
                size="m"
                onClick={onComplete}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WelcomeTourContent;
