import React from 'react';
import { AppContextProvider } from '../AppContext';
import './App.css';
import ContentRoutes from './ContentRoutes';

const App = () => (
  <AppContextProvider>
    <ContentRoutes />
  </AppContextProvider>
);

export default App;
