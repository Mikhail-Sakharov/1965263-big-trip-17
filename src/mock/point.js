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

function getRandomPointProp(set, min, max) {
  if (set) {
    min = 0;
    max = set.length - 1;
    return set[getRandom(min, max)];
  }

  return getRandom(min, max);
}

function createPictures(destinationName) {
  return Array.from({length: getRandomPointProp(0, 1, 5)}, () => ({
    src: 'http://picsum.photos/300/200?r=0.0762563005163317',
    description: `${destinationName} parliament building`
  }));
}

function generateDestination() {
  const destinationName = getRandomPointProp(DestinationNames, 0, 22);
  return {
    pointName: destinationName,
    description: `${destinationName}, is a beautiful city.`,
    pictures: createPictures(destinationName)
  };
}

function generateOffers() {
  return Array.from({length: getRandomPointProp(0, 1, 5)}, (item, index) => ({
    id: index,
    title: 'Upgrade to a business class',
    price: getRandomPointProp(0, 30, 500)
  }));
}

function createOffers() {
  return Array.from({length: getRandomPointProp(0, 1, 5)}, () => ({
    type: getRandomPointProp(PointTypes, 0, 8),
    offers: generateOffers()
  }));
}

function createPoint() {
  return {
    basePrice: getRandomPointProp(0, 500, 5000),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: generateDestination(),
    id: getPointId(),
    isFavorite: Boolean(getRandomPointProp(0, 0, 1)),
    offers: createOffers(),
    type: getRandomPointProp(PointTypes, 0, 8)
  };
}

export {createPoint};
