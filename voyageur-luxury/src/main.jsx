import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import { router } from './routes';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center p-8 text-center"
    >
      <h1 className="text-2xl font-bold text-[#C9A34F] mb-4">
        Something went wrong
      </h1>
      <p className="text-white/60 mb-6 max-w-md">{error?.message}</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="px-6 py-3 rounded-lg bg-[#C9A34F] text-black font-semibold hover:bg-[#d4af5a] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
