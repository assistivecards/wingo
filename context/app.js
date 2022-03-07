import React, { createContext, FC, useState } from 'react';

export const AppContext = createContext({
  tasks: {},
  setTasks: () => null,
});

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
      }}>
      {children}
    </AppContext.Provider>
  );
};
