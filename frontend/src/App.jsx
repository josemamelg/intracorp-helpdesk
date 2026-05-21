import { useState } from 'react';
import { Layout } from './components/Layout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { AuditPage } from './pages/AuditPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SimulatePage } from './pages/SimulatePage.jsx';
import { SystemStatusPage } from './pages/SystemStatusPage.jsx';
import { TicketsPage } from './pages/TicketsPage.jsx';
import { UsersPage } from './pages/UsersPage.jsx';

const pages = {
  dashboard: DashboardPage,
  tickets: TicketsPage,
  users: UsersPage,
  audit: AuditPage,
  status: SystemStatusPage,
  simulate: SimulatePage
};

export default function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) return <div className="boot-screen">Cargando IntraCorp Helpdesk...</div>;
  if (!user) return <LoginPage />;

  const Page = pages[activePage] || DashboardPage;

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <Page />
    </Layout>
  );
}
