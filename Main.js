import React from 'react';
import { AppProvider } from './context/app';

const Main = ({ children }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
};
export default Main;
