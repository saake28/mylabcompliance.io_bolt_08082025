import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { testSupabaseConnection } from './test-connection';

// Test Supabase connection on startup
testSupabaseConnection().then(result => {
  console.log('Supabase connection test results:', result);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);