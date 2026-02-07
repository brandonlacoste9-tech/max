import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/**
 * Scroll to hash target after route change. Needed for lazy-loaded routes
 * where the target element may not exist until the child has mounted.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    // Defer so lazy child has time to mount and paint
    const t = setTimeout(scrollToTarget, 100);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

/** Root layout — child routes render via Outlet */
const App = () => (
  <>
    <ScrollToHash />
    <Outlet />
  </>
);

export default App;
