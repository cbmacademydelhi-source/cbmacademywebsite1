import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Whenever the website is reloaded/refreshed, always redirect to the Home page ('/')
try {
  const isReload = (() => {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      return (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
    }
    return (performance as any)?.navigation?.type === 1;
  })();

  if (isReload) {
    if (window.location.hash || window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
      window.location.hash = '';
    }
  }
} catch {
  // Ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

