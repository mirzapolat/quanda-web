
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { register } from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

// Register the service worker for PWA functionality
register();
