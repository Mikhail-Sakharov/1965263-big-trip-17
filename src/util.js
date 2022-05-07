import dayjs from 'dayjs';

const PointsIdCount = {
  MIN: 1,
  MAX: 100
};
const HOUR_MINUTES_COUNT = 60;
const TOTAL_DAY_MINUTES_COUNT = 1440;
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

function duration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference/TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference - days * TOTAL_DAY_MINUTES_COUNT)/HOUR_MINUTES_COUNT);
  const restMinutes = difference - (days * TOTAL_DAY_MINUTES_COUNT + restHours * HOUR_MINUTES_COUNT);

  const daysOutput = (days) ? `${days}D` : '';
  const hoursOutput = (restHours) ? `${restHours}H` : '';
  const minutesOutput = (restMinutes) ? `${restMinutes}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
}

function getDate(date) {
  return dayjs(date).format(DATE_FORMAT);
}

function getDateTime(date) {
  return dayjs(date).format(DATE_TIME_FORMAT);
}

function getRandom (from, to) {
  const min = Math.min(Math.abs(from), Math.abs(to));
  const max = Math.max(Math.abs(from), Math.abs(to));
  return Math.round(min + (max - min) * Math.random());
}

const pointsId = [];              // массив для хранения уникальных id для комментариев
function getId() {
  let id = getRandom(PointsIdCount.MIN, PointsIdCount.MAX);
  while (pointsId.some((item) => item === id)) {
    id = getRandom(PointsIdCount.MIN, PointsIdCount.MAX);
  }

  pointsId.push(id);
  return id;
}

export {getRandom, getId, humanizePointDueDate, duration, getDate, getDateTime};
