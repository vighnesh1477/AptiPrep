import { useEffect, useState } from 'react';
import '../styles/splash.css';

const DURATION = 1500; // splash time in ms

function SplashScreen({ onDone }) {
  const [duration] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 400
      : DURATION
  );

  useEffect(() => {
    const timer = setTimeout(onDone, duration + 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="splash"
      style={{ '--splash-duration': `${duration}ms` }}
      aria-hidden="true"
    >
      <img src="/logo.png" alt="" className="splash-logo" />
    </div>
  );
}

export default SplashScreen;