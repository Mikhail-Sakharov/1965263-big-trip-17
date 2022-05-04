import {getRandom, getId} from '../util.js';

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
  return set[getRandom(MIN, max)];
}

function createPictures(destinationName) {
  return Array.from({length: getRandom(1, 5)}, () => ({
    src: `http://picsum.photos/248/152?r=${getRandom(1, 100)}`,
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

/* function generateOffers() {
  return Array.from({length: getRandom(1, 2)}, (item, index) => ({
    id: index,
    title: 'Upgrade',
    price: getRandom(30, 500)
  }));
} */

/* function createOffers() {
  return Array.from({length: getRandom(1, 2)}, () => ({
    type: getRandomValue(POINT_TYPES),
    offers: generateOffers()
  }));
} */

function createOffers() {
  const randomArray = Array.from({length: getRandom(1, 3)}, () => getRandom(1, 3));
  const set = new Set(randomArray);
  return Array.from(set);
}

function createPoint() {
  return {
    basePrice: getRandom(500, 5000),
    dateFrom: '2019-07-01T13:00:56.845Z',
    dateTo: '2019-07-09T14:30:56.845Z',
    destination: generateDestination(),
    id: getId(),
    isFavorite: Boolean(getRandom(0, 1)),
    offers: createOffers(),
    type: getRandomValue(POINT_TYPES)
  };
}

export {createPoint};
