import React, { createContext, useEffect, useState } from 'react';
import { StoreUtil, DateUtil } from '../utils';
import { DAY } from '../constants';

export const AppContext = createContext({
  tasks: {},
  day: DAY.today,
  dayDate: DateUtil.today(),
  setTasks: () => null,
  setDay: () => null,
  setDayDate: () => null,
});

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const [day, setDay] = useState(DAY.today);
  const [dayDate, setDayDate] = useState(DateUtil.today());

  useEffect(() => {
    const yesterday = DateUtil.yesterday();
    const today = DateUtil.today();
    const tomorrow = DateUtil.tomorrow();
    if (day) {
      if (day === DAY.yesterday) {
        setDayDate(yesterday);
      }
      if (day === DAY.today) {
        setDayDate(today);
      }
      if (day === DAY.tomorrow) {
        setDayDate(tomorrow);
      }
    }
  }, [day]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        day,
        dayDate,
        setTasks,
        setDay,
        setDayDate,
      }}>
      {children}
    </AppContext.Provider>
  );
};
