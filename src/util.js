import dayjs from 'dayjs';

const PointsIdCount = {
  MIN: 1,
  MAX: 100
};
const HOUR_MINUTES_COUNT = 60;
const TOTAL_DAY_MINUTES_COUNT = 1440;

function humanizePointDueDate(date, format) {
  return dayjs(date).format(format);
}

function returnTitleDuration(startDate, endDate) {
  const startDateMonth = dayjs(startDate).format('MMM');
  const endDateMonth = dayjs(endDate).format('MMM');

  const startDateDay = dayjs(startDate).format('DD');
  const endDateDay = dayjs(endDate).format('DD');

  return startDateMonth === endDateMonth ? `${startDateMonth} ${startDateDay} - ${endDateDay}` : `${startDateMonth} ${startDateDay} - ${endDateMonth} ${endDateDay}`;
}

function duration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference/TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference - days * TOTAL_DAY_MINUTES_COUNT)/HOUR_MINUTES_COUNT);
  const restMinutes = difference - (days * TOTAL_DAY_MINUTES_COUNT + restHours * HOUR_MINUTES_COUNT);

  const daysOutput = (days) ? `${days < 10 ? `0${days}` : `${days}`}D` : '';
  const hoursOutput = (restHours) ? `${restHours < 10 ? `0${restHours}` : `${restHours}`}H` : '';
  const minutesOutput = (restMinutes) ? `${restMinutes < 10 ? `0${restMinutes}` : `${restMinutes}`}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
}

function getRandomInteger(from, to) {
  const min = Math.min(from, to);
  const max = Math.max(from, to);
  return Math.round(min + (max - min) * Math.random());
}

function generateDate() {
  const MAX_GAP = 1000;
  const minutesGap = getRandomInteger(-MAX_GAP, MAX_GAP);

  return dayjs().add(minutesGap, 'minute').toISOString();
}

const pointsId = [];              // массив для хранения уникальных id для комментариев
function getId() {
  let id = getRandomInteger(PointsIdCount.MIN, PointsIdCount.MAX);
  while (pointsId.some((item) => item === id)) {
    id = getRandomInteger(PointsIdCount.MIN, PointsIdCount.MAX);
  }

  pointsId.push(id);
  return id;
}

export {getRandomInteger, getId, humanizePointDueDate, returnTitleDuration, duration, generateDate};
