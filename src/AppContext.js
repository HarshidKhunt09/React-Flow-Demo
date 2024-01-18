import React, { createContext, useReducer } from 'react';

const initialState = {
  connectedNodes: [],
  csvData: [],
};

const reducer = (state, action) => {
  switch (action?.type) {
    case 'SET_CONNECTED_NODES':
      return { ...state, connectedNodes: action?.data };
    case 'SET_CSV_DATA':
      return { ...state, csvData: action?.data };
    default:
      return { ...state };
  }
};

const AppContext = createContext({
  state: initialState,
  dispatch: () => {},
});

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const AppContextConsumer = AppContext?.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
