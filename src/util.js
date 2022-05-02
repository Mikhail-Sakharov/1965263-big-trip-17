import dayjs from 'dayjs';

const PointsIdCount = {
  MIN: 1,
  MAX: 100
};
const HOUR_MINUTES_COUNT = 60;
const TOTAL_DAY_MINUTES_COUNT = 1440;
const DATE_FORMATE = 'YYYY-MM-DD';
const DATE_TIME_FORMATE = 'DD/MM/YY hh:mm';

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

function duration(dateFrom, dateTo) {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  const difference = date2.diff(date1, 'minute');

  const days = Math.floor(difference/TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference - days * TOTAL_DAY_MINUTES_COUNT)/HOUR_MINUTES_COUNT);
  const restMinutes = difference - (days * TOTAL_DAY_MINUTES_COUNT + restHours * HOUR_MINUTES_COUNT);

  const daysOutput = (days) ? `${days}D` : '';
  const hoursOutput = (restHours) ? `${restHours}H` : '';
  const minutesOutput = (restMinutes) ? `${restMinutes}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
}

function getDate(date) {
  return dayjs(date).format(DATE_FORMATE);
}

function getDateTime(date) {
  return dayjs(date).format(DATE_TIME_FORMATE);
}

function getRandom (min, max) {
  [min, max]=[Math.abs(min), Math.abs(max)];
  if (max < min) {[min, max]=[max, min];}
  return Math.round(min + (max - min) * Math.random());
}

const pointsId = [];              // массив для хранения уникальных id для комментариев
function getPointId() {
  let id = getRandom(PointsIdCount.MIN, PointsIdCount.MAX);
  while (pointsId.some((item) => item === id)) {
    id = getRandom(PointsIdCount.MIN, PointsIdCount.MAX);
  }

  pointsId.push(id);
  return id;
}

export {getRandom, getPointId, humanizePointDueDate, duration, getDate, getDateTime};
