import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from './router/HashRouter';
import { AppLayout } from './components/layout/AppLayout';

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Today = lazy(() => import('./pages/Today').then((m) => ({ default: m.Today })));
const Websites = lazy(() => import('./pages/Websites').then((m) => ({ default: m.Websites })));
const Tabs = lazy(() => import('./pages/Tabs').then((m) => ({ default: m.Tabs })));
const Productivity = lazy(() => import('./pages/Productivity').then((m) => ({ default: m.Productivity })));
const History = lazy(() => import('./pages/History').then((m) => ({ default: m.History })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[240px] text-xs font-mono text-slate-400">
    Loading view...
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="today" element={<Today />} />
            <Route path="websites" element={<Websites />} />
            <Route path="tabs" element={<Tabs />} />
            <Route path="productivity" element={<Productivity />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
