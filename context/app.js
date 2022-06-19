import React, { createContext, useEffect, useState } from 'react';
import { DateUtil, StoreUtil } from '../utils';
import { DAY } from '../constants';

export const AppContext = createContext({
  tasks: {},
  day: DAY.today,
  dayDate: DateUtil.today(),
  isEditing: false,
  setTasks: () => null,
  setDay: () => null,
  setDayDate: () => null,
  setIsEditing: () => null,
});

export const AppProvider = ({ children }) => {
  const yesterday = DateUtil.yesterday();
  const today = DateUtil.today();
  const tomorrow = DateUtil.tomorrow();

  const [tasks, setTasks] = useState({
    [yesterday]: {},
    [today]: {},
    [tomorrow]: {}
  });
  const [day, setDay] = useState(DAY.today);
  const [dayDate, setDayDate] = useState(DateUtil.today());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (tasks) {
      console.log("tasks", JSON.stringify(tasks, null, 2));
      try {
        setTimeout(async () => {
          await StoreUtil.setItem('@tasks', tasks);
        }, 100);
      } catch (error) {
        console.log('error while persisting the tasks', error);
      }
    }
  }, [tasks]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        day,
        dayDate,
        isEditing,
        setTasks,
        setDay,
        setDayDate,
        setIsEditing,
      }}>
      {children}
    </AppContext.Provider>
  );
};
