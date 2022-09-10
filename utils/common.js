export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const getFormattedTasks = ({ tasks, activities, dayDate }) => {
  return tasks && activities && activities.filter(activity => tasks[dayDate] && tasks[dayDate][activity.slug]).map(
    activity => {
      return {
        activity: activity,
        completed: tasks[dayDate][activity.slug]['completed'],
        added: tasks[dayDate][activity.slug]['added'],
        pos: tasks[dayDate][activity.slug]['pos'],
      };
    },
  );
};