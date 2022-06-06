import dayjs from 'dayjs';

const PointsCount = {
  MIN: 1,
  MAX: 10
};
const HOUR_MINUTES_COUNT = 60;
const TOTAL_DAY_MINUTES_COUNT = 1440;

function transformDateToISOString(date) {
  return dayjs(date).toISOString();
}

function humanizePointDate(date, format) {
  return dayjs(date).format(format);
}

function calculatePrice(pointsData, allOffers) {
  const eventsTotalPrice = pointsData.reduce((totalPrice, point) => totalPrice + point.basePrice + (
    point.offers.reduce((offersTotalPrice, offerId) => offersTotalPrice + allOffers.find((offersBlock) => offersBlock.type === point.type).offers.find((offer) => offer.id === offerId).price, 0)
  ), 0);

  return eventsTotalPrice;
}

function returnTitleDuration(points) {
  const startDates = points.map((point) => point.dateFrom);
  const sortedStartDates = startDates.sort((nextItem, currentItem) => new Date(nextItem) - new Date(currentItem));

  const endDates = points.map((point) => point.dateTo);
  const sortedEndDates = endDates.sort((nextItem, currentItem) => new Date(currentItem) - new Date(nextItem));

  const startDateMonth = dayjs(sortedStartDates[0]).format('MMM');
  const endDateMonth = dayjs(sortedEndDates[0]).format('MMM');

  const startDateDay = dayjs(sortedStartDates[0]).format('DD');
  const endDateDay = dayjs(sortedEndDates[0]).format('DD');

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
  const MAX_GAP = 3000;
  const minutesGap = getRandomInteger(-MAX_GAP, MAX_GAP);

  return dayjs().add(minutesGap, 'minute').toISOString();
}

const pointsId = [];              // массив для хранения уникальных id для комментариев
function getId() {
  let id = getRandomInteger(PointsCount.MIN, PointsCount.MAX);
  while (pointsId.some((item) => item === id)) {
    id = getRandomInteger(PointsCount.MIN, PointsCount.MAX);
  }

  pointsId.push(id);
  return id;
}

export {getRandomInteger, getId, transformDateToISOString, humanizePointDate, calculatePrice, returnTitleDuration, duration, generateDate, PointsCount};
