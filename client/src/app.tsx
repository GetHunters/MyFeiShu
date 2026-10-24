import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import NotFound from './pages/NotFound/NotFound';
import ReportsPage from './pages/reports/ReportsPage';
import ReportDetailPage from './pages/report-detail/ReportDetailPage';
import UploadPage from './pages/upload/UploadPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import MaintenanceDetailPage from './pages/maintenance-detail/MaintenanceDetailPage';
import SummariesPage from './pages/summaries/SummariesPage';
import SummaryDetailPage from './pages/summaries/SummaryDetailPage';
import VideoArchivePage from './pages/video-archive/VideoArchivePage';
import ChangelogPage from './pages/changelog/ChangelogPage';
import UploadLogPage from './pages/upload-log/UploadLogPage';
import MesSummaryPage from './pages/mes-summary/MesSummaryPage';
import MesSummaryDetailPage from './pages/mes-summary-detail/MesSummaryDetailPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ReportsPage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="maintenance/:id" element={<MaintenanceDetailPage />} />
        <Route path="mes-summary" element={<MesSummaryPage />} />
        <Route path="mes-summary/:id" element={<MesSummaryDetailPage />} />
        <Route path="admin/upload" element={<UploadPage />} />
        <Route path="admin/summaries" element={<SummariesPage />} />
        <Route path="admin/summaries/:id" element={<SummaryDetailPage />} />
        <Route path="admin/video-archive" element={<VideoArchivePage />} />
        <Route path="admin/changelog" element={<ChangelogPage />} />
        <Route path="admin/upload-log" element={<UploadLogPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
