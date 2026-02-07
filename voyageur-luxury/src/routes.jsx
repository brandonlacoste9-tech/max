import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

import VoyageurLanding from './pages/VoyageurLanding';
const FloguruLanding = lazy(() => import('./components/floguru/FloguruLanding'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

const PageFallback = () => (
  <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center text-[#C9A34F] font-body">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const RouteErrorFallback = () => (
  <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-2xl font-bold text-[#C9A34F] mb-4">Page error</h1>
    <p className="text-white/60 mb-6">This page couldn’t be loaded.</p>
    <a href="/" className="px-6 py-3 rounded-lg bg-[#C9A34F] text-black font-semibold hover:bg-[#d4af5a] transition-colors">
      Back to home
    </a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <VoyageurLanding />,
      },
      {
        path: 'floguru',
        element: (
          <Suspense fallback={<PageFallback />}>
            <FloguruLanding />
          </Suspense>
        ),
      },
      {
        path: 'pricing',
        element: (
          <Suspense fallback={<PageFallback />}>
            <PricingPage />
          </Suspense>
        ),
      },
    ],
  },
]);
