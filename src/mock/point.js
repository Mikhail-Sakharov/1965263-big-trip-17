import {getRandom, getPointId} from '../util.js';

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

function getRandomValue(set, min, max) {
  return set[getRandom(min, max)];
}

function createPictures(destinationName) {
  return Array.from({length: getRandom(1, 5)}, () => ({
    src: `http://picsum.photos/248/152?r=${getRandom(1, 100)}`,
    description: `${destinationName} parliament building`
  }));
}

function generateDestination() {
  const destinationName = getRandomValue(DESTINATION_NAMES, 0, 22);
  return {
    pointName: destinationName,
    description: `${destinationName}, is a beautiful city.`,
    pictures: createPictures(destinationName)
  };
}

function generateOffers() {
  return Array.from({length: getRandom(1, 2)}, (item, index) => ({
    id: index,
    title: 'Upgrade',
    price: getRandom(30, 500)
  }));
}

function createOffers() {
  return Array.from({length: getRandom(1, 2)}, () => ({
    type: getRandomValue(POINT_TYPES, 0, 8),
    offers: generateOffers()
  }));
}

function createPoint() {
  return {
    basePrice: getRandom(500, 5000),
    dateFrom: '2019-07-01T13:00:56.845Z',
    dateTo: '2019-07-09T14:30:56.845Z',
    destination: generateDestination(),
    id: getPointId(),
    isFavorite: Boolean(getRandom(0, 1)),
    offers: createOffers(),
    type: getRandomValue(POINT_TYPES, 0, 8)
  };
}

export {createPoint};
