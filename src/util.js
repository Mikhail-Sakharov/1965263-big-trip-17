import dayjs from 'dayjs';

const PointsIdCount = {
  MIN: 1,
  MAX: 100
};

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

function duration(a, b) {
  const date1 = dayjs(a);
  const date2 = dayjs(b);

  return date2.diff(date1, 'minute');
}

function getDate(date) {
  return dayjs(date). format('YYYY-MM-DD');
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

export {getRandom, getPointId, humanizePointDueDate, duration, getDate};
