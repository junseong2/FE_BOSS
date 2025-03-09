import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 여기만 사용!
import './index.css';
import './menubar.css';
import './animations.css';

import './responsive.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App /> {/* ✅ Routes를 제거하고 App만 감싸기 */}
    </BrowserRouter>
  </StrictMode>,
);
