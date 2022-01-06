const MONTHS: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Vancouver' }));
const currMonth = currDate.getMonth();
const currYear = currDate.getFullYear();
const currMonthLastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
const currMonthLastDate = new Date(currYear, currMonth, currMonthLastDay, 23, 59, 59);

const formattedDate = (date: string, day: number) => {
  return MONTHS[parseInt(date.substring(5, 7)) - 1].concat(' ').concat(date.substring(day, 10)).concat(', ').concat(date.substring(0, 4));
};

export const makeDateShort = (date: any): string => {
  return parseInt(date.substring(8, 9)) > 0 ? formattedDate(date, 8) : formattedDate(date, 9);
};

export { MONTHS, currDate, currMonth, currYear, currMonthLastDay, currMonthLastDate };
