import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Today } from './pages/Today';
import { Websites } from './pages/Websites';
import { Tabs } from './pages/Tabs';
import { Productivity } from './pages/Productivity';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}
