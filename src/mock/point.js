import {getRandom, getPointId} from '../util.js';

const PointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DestinationNames = [
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

/* const Descriptions = [
  'is a beautiful city',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
];

const Offers = [
  'Upgrade to a business class',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
]; */

function getRandomValue(set, min, max) {
  if (set) {
    min = 0;
    max = set.length - 1;
    return set[getRandom(min, max)];
  }

  return getRandom(min, max);
}

function createPictures(destinationName) {
  return Array.from({length: getRandomValue(0, 1, 5)}, () => ({
    src: 'http://picsum.photos/300/200?r=0.0762563005163317',
    description: `${destinationName} parliament building`
  }));
}

function generateDestination() {
  const destinationName = getRandomValue(DestinationNames, 0, 22);
  return {
    pointName: destinationName,
    description: `${destinationName}, is a beautiful city.`,
    pictures: createPictures(destinationName)
  };
}

function generateOffers() {
  return Array.from({length: getRandomValue(0, 1, 5)}, (item, index) => ({
    id: index,
    title: 'Upgrade to a business class',
    price: getRandomValue(0, 30, 500)
  }));
}

function createOffers() {
  return Array.from({length: getRandomValue(0, 1, 5)}, () => ({
    type: getRandomValue(PointTypes, 0, 8),
    offers: generateOffers()
  }));
}

function createPoint() {
  return {
    basePrice: getRandomValue(0, 500, 5000),
    dateFrom: '2019-07-01T18:45:56.845Z',
    dateTo: '2019-07-11T18:45:56.845Z',
    destination: generateDestination(),
    id: getPointId(),
    isFavorite: Boolean(getRandomValue(0, 0, 1)),
    offers: createOffers(),
    type: getRandomValue(PointTypes, 0, 8)
  };
}

export {createPoint};
