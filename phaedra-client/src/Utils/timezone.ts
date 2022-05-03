import { LANGUAGE, TIMEZONE } from '../constants/codes';

enum Month {
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
}

const currDate = new Date(new Date().toLocaleString(LANGUAGE, { timeZone: TIMEZONE }));
const currMonth = currDate.getMonth();
const currYear = currDate.getFullYear();
const currMonthLastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
const currMonthLastDate = new Date(currYear, currMonth, currMonthLastDay, 23, 59, 59);

const formattedDate = (date: string, day: number): string => {
  return Month[parseInt(date.substring(5, 7)) - 1].concat(' ').concat(date.substring(day, 10)).concat(', ').concat(date.substring(0, 4));
};

const makeDateShort = (date: string): string => {
  return parseInt(date.substring(8, 9)) > 0 ? formattedDate(date, 8) : formattedDate(date, 9);
};

const makeTimeShort = (date: string): string => {
  return parseInt(date.substring(11, 13)) > 12
    ? (parseInt(date.substring(11, 13)) - 12).toString().concat(date.substring(13, 16)).concat(' PM')
    : parseInt(date.substring(11, 12)) > 0
    ? date.substring(11, 16).concat(' AM')
    : date.substring(12, 16).concat(' AM');
};

export { Month, currDate, currMonth, currYear, currMonthLastDay, currMonthLastDate, makeDateShort, makeTimeShort };
