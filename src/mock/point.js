import {getRandomInteger, generateDate, getId} from '../util.js';
import dayjs from 'dayjs';
import {DESTINATIONS} from './destinations.js';

const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

function getRandomValue(set) {
  const max = set.length - 1;
  return set[getRandomInteger(0, max)];
}

function createOffers() {
  const randomArray = Array.from({length: getRandomInteger(1, 3)}, () => getRandomInteger(1, 3));
  const set = new Set(randomArray);
  return Array.from(set);
}

function createPoint() {
  const TYPES_WITHOUT_OFFERS = ['bus', 'train', 'ship'];
  const type = getRandomValue(POINT_TYPES);
  const offers = TYPES_WITHOUT_OFFERS.includes(type) ? [] : createOffers();
  const dateFrom = generateDate();
  const dateTo = dayjs(dateFrom).add(getRandomInteger(30, 1000), 'minute').toISOString();

  return {
    basePrice: getRandomInteger(500, 5000),
    dateFrom,
    dateTo,
    destination: getRandomValue(DESTINATIONS),
    id: getId(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers,
    type
  };
}

export {createPoint};
