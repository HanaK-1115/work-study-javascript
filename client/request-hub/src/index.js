import React from 'react';
import { createRoot } from 'react-dom/client'; // createRoot をインポート
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; 
import { AuthProvider } from './contexts/AuthContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // 追加

const container = document.getElementById('root');
const root = createRoot(container); // createRoot を使用

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.register(); // サービスワーカーを登録
