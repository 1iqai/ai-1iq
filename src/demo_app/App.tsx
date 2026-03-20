import type { FC } from 'react';
import Router from './router/Routes';
import DemoGate from './components/DemoGate';

/**
 * App Component - Root application component
 *
 * Renders the main Router which handles layout-based routing:
 * - AuthLayout for public pages (login, forgot password, etc.)
 * - MainLayout for protected pages (dashboard, settings, etc.)
 *
 * Layouts are now handled at the route level for better separation
 * of concerns and cleaner code organization.
 */
const App: FC = () => {
  return (
    <DemoGate>
      <Router />
    </DemoGate>
  );
};

export default App;