import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { inject } from '@vercel/analytics';
import posthog from 'posthog-js';
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react';
import App from './App.tsx';
import './index.css';

inject();

// Defer PostHog init until the browser is idle so heavy analytics
// (autocapture, heatmaps, session recording) never block first paint on mobile.
function initAnalytics() {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY ?? '', {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
    person_profiles: 'always',          // rastreia utilizadores anónimos e identificados
    capture_pageview: true,             // pageviews automáticos
    capture_pageleave: true,            // saídas de página
    autocapture: true,                  // captura todos os cliques, inputs e submissões
    capture_heatmaps: true,             // heatmaps de cliques
    session_recording: {
      maskAllInputs: false,             // grava inputs (exceto passwords que são sempre mascaradas)
      maskInputOptions: { password: true },
    },
    enable_heatmaps: true,
  });
}
if (typeof (window as any).requestIdleCallback === 'function') {
  (window as any).requestIdleCallback(initAnalytics, { timeout: 3000 });
} else {
  setTimeout(initAnalytics, 2000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <App />
      </PostHogErrorBoundary>
    </PostHogProvider>
  </StrictMode>,
);

// Hide the waiting screen once React has painted.
// On the homepage we wait for the hero video to actually start (it calls
// __hideSplash itself), so the splash fades straight into the moving video
// instead of flashing a still frame first. Other routes hide immediately.
if (window.location.pathname !== '/') {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => (window as any).__hideSplash?.()),
  );
}
