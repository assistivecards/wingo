export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
};

export const getFormattedTasks = ({ tasks, activities, dayDate }) => {
  return tasks && activities && activities.filter(activity => tasks[dayDate] && tasks[dayDate][activity.slug]).map(
    activity => {
      return {
        activity: activity,
        completed: tasks[dayDate][activity.slug]['completed'],
        added: tasks[dayDate][activity.slug]['added'],
      };
    },
  );
};