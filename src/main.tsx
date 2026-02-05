import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from './app/router';
import { AuthProvider } from './app/providers/AuthContext';
import { SocketProvider } from './app/context/SocketContext';
import { store } from './app/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  </Provider>
);
