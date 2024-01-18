import { AppContextProvider } from '../AppContext';
import './App.css';
import ContentRoutes from './ContentRoutes';

const App = () => {
  return (
    <AppContextProvider>
      <ContentRoutes />
    </AppContextProvider>
  );
};

export default App;
