class DateUtil {
  static now = () => {
    return new Date();
  }
  static yesterday = () => {
    const yesterdayDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return DateUtil.format(yesterdayDate);
  };
  static today = () => {
    const todayDate = new Date();
    return DateUtil.format(todayDate);
  };
  static tomorrow = () => {
    const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    return DateUtil.format(tomorrowDate);
  };
  static format = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
}
export default DateUtil;