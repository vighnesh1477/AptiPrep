import { useState, useEffect, useCallback, createContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Topics from './pages/Topics';
import Practice from './pages/Practice';
import TestQuiz from './pages/Test-Quiz';
import Results from './pages/Results';
import CompanyTest from './pages/Company-test';
import Contributors from './pages/Contributors';
import About from './pages/About';
import Admin from './pages/Admin';

export const NavigationContext = createContext(null);

const routes = {
  '/': Home,
  '/home': Home,
  '/topics': Topics,
  '/practice': Practice,
  '/quiz': TestQuiz,
  '/results': Results,
  '/company-test': CompanyTest,
  '/contributors': Contributors,
  '/about': About,
  '/admin': Admin,
};

function App() {
  /* Splash only on a fresh load of the Home page */
  const [showSplash, setShowSplash] = useState(() => {
    const path = window.location.hash.slice(1) || '/';
    return path === '/' || path === '/home';
  });

  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash || '/';
  });

  useEffect(() => {
    const saved = localStorage.getItem('aptiprep-theme') || 'system';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = saved === 'system' ? (systemDark ? 'dark' : 'light') : saved;
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.slice(1) || '/';
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /* ── Scroll to top whenever the page changes ── */
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [currentPath]);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  const PageComponent = routes[currentPath] || Home;

  return (
    <NavigationContext.Provider value={{ navigate, currentPath }}>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <div className="app">
        <Navbar />
        <main className="app-main">
          <PageComponent />
        </main>
        <Footer />
      </div>
    </NavigationContext.Provider>
  );
}

export default App;