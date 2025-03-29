import dayjs from 'dayjs';

/**
 * ISO 형식을 2025-03-02 02:15:00 형식으로 변환한다.
 * @param {*} isoString 
 * @example 
    const isoString = '2025-03-02T02:15:00.000+00:00';
    console.log(formatDate(isoString)); // "2025-03-02 02:15:00"
    
 */
export function formatDate(isoString) {
  const date = new Date(isoString);

  const pad = (num) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 전달받은 날짜의 포맷을 YYYY-MM-DD 으로 변환한다.
 * @param {*} selectedDate
 */
export function formatLocalDate(selectedDate) {
  return dayjs(selectedDate).format('YYYY-MM-DD');
}

/**
 * 금일을 기준으로 이번주를 구하여 반환한다.
 */
export function getWeekRange() {
  const today = dayjs();
  const thisWeekMon = today.date() - today.day() + 1;
  const thisWeekSun = thisWeekMon + today.day();

  const startDate = dayjs(today.set('date', thisWeekMon)).format('YYYY-MM-DD');
  const endDate = dayjs(today.set('date', thisWeekSun)).format('YYYY-MM-DD');

  return { startDate, endDate };
}
/**
 * 금일을 기준으로 이번 달의 시작일과 끝일의 날짜범위를 구하여 반환한다.
 */
export function getThisMonth() {
  const firstDay = 1;
  const lastDay = dayjs().daysInMonth();

  const startDate = dayjs(
    new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${firstDay}`),
  ).format('YYYY-MM-DD');
  const endDate = dayjs(
    new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${lastDay}`),
  ).format('YYYY-MM-DD');

  return { startDate, endDate };
}

/**
 * 지정한 수를 +,- 연산한 월에 해당하는 날짜범위를 구하여 반환한다.
 * 예를 들어, n 이 -1 이라면 현재가 3월이라면, 이전 달의 2월 첫째 날과 마지막 날짜을 구하여 반환한다.
 */
export function getMonthRange(n) {
  const firstDay = 1;
  const lastDay = dayjs().daysInMonth();

  const startDate = dayjs(
    new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1 + n}-${firstDay}`),
  ).format('YYYY-MM-DD');
  const endDate = dayjs(
    new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1 + n}-${lastDay}`),
  ).format('YYYY-MM-DD');

  return { startDate, endDate };
}
