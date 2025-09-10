import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeStorage } from './utils/localStorage';
import { DarkModeProvider } from './contexts/DarkModeContext';

// Components
import Landing from './components/Landing';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import AdminCreate from './components/AdminCreate';

function App() {
  useEffect(() => {
    // Initialize localStorage with demo data on first run
    initializeStorage();
  }, []);

  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />
          
          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />
          
          {/* Role-based dashboards */}
          <Route path="/:role/dashboard" element={<Dashboard />} />
          
          {/* Admin routes with secret path */}
          <Route path="/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin" element={<Admin />} />

          <Route path="/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin/create" element={<AdminCreate />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
