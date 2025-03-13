npm install react-webcam

package.json에"server": "node server.js"추가

server.js는 스프링부트에서 분리처리 할게요 일단 작동만 확인 부탁드려요

main.jsx를 import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 여기만 사용!
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
<StrictMode>
<BrowserRouter>
<Routes>
<Route path='/' element={<App />} />
</Routes>
</BrowserRouter>
</StrictMode>,
);
에서
createRoot(document.getElementById('root')).render(
<StrictMode>
<BrowserRouter>
<App /> {/_ ✅ Routes를 제거하고 App만 감싸기 _/}
</BrowserRouter>
</StrictMode>
);
로 수정함
