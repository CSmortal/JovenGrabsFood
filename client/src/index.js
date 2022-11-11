import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { Provider } from 'react-redux'
import store, { Persistor } from './store/index'
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={Persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
