import {getRandomInteger} from '../util.js';

function createPictures(destinationName) {
  return Array.from({length: getRandomInteger(1, 5)}, () => ({
    src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
    description: `${destinationName} parliament building`
  }));
}

export const DESTINATIONS = [
  {
    name: 'Geneva',
    description: 'Geneva, a true asian pearl, for those who value comfort and coziness, with an embankment of a mighty river as a centre of attraction.',
    pictures: createPictures('Geneva')
  },
  {
    name: 'Amsterdam',
    description: 'Amsterdam, with crowded streets, middle-eastern paradise, for those who value comfort and coziness, with an embankment of a mighty river as a centre of attraction.',
    pictures: createPictures('Amsterdam')
  },
  {
    name: 'Helsinki',
    description: 'Helsinki, with crowded streets, full of of cozy canteens where you can try the best coffee in the Middle East, a perfect place to stay with a family, famous for its crowded street markets with the best street food in Asia.',
    pictures: createPictures('Helsinki')
  },
  {
    name: 'Oslo',
    description: 'Oslo, with a beautiful old town, with an embankment of a mighty river as a centre of attraction.',
    pictures: createPictures('Oslo')
  },
  {
    name: 'Kopenhagen',
    description: 'Kopenhagen, full of of cozy canteens where you can try the best coffee in the Middle East.',
    pictures: createPictures('Kopenhagen')
  }
];
