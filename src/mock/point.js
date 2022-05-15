import {getRandomInteger, getId, generateDate} from '../util.js';

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

const DESTINATION_NAMES = [
  'Amsterdam',
  'Ankara',
  'Barcelona',
  'Budapest',
  'Dublin',
  'Dusseldorf',
  'Geneva',
  'Helsinki',
  'Istanbul',
  'Johannesburg',
  'Kiev',
  'Las Vegas',
  'Leipzig',
  'Lisbon',
  'London',
  'Los Angeles',
  'Madrid',
  'Monaco',
  'Montreal',
  'Moscow',
  'Saint Petersburg',
  'Vladimir',
  'Suzdal'
];

function getRandomValue(set) {
  const MIN = 0;
  const max = set.length - 1;
  return set[getRandomInteger(MIN, max)];
}

function createPictures(destinationName) {
  return Array.from({length: getRandomInteger(1, 5)}, () => ({
    src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
    description: `${destinationName} parliament building`
  }));
}

function generateDestination() {
  const destinationName = getRandomValue(DESTINATION_NAMES);
  return {
    pointName: destinationName,
    description: `${destinationName}, is a beautiful city.`,
    pictures: createPictures(destinationName)
  };
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
  const dates = [generateDate(), generateDate()];

  return {
    basePrice: getRandomInteger(500, 5000),
    dateFrom: Math.min(...dates),
    dateTo: Math.max(...dates),
    destination: generateDestination(),
    id: getId(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers,
    type
  };
}

export {createPoint};
