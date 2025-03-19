import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 여기만 사용!
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';
import './menubar.css';
import './animations.css';
import React from "react";

import './responsive.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <App /> {/* ✅ Routes를 제거하고 App만 감싸기 */}
      </DndProvider>
    </BrowserRouter>
  </StrictMode>,
);
