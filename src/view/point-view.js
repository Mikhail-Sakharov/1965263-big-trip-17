import {createElement} from '../render.js';
import {humanizePointDueDate, duration, getDate} from '../util.js';

function renderOffers(offers) {
  let result = '';
  offers.forEach((item) => {
    item.offers.forEach((elem) => {
      result = `${result  }<li class="event__offer"><span class="event__offer-title">${elem.title}</span>&plus;&euro;&nbsp;<span class="event__offer-price">${elem.price}</span></li>`;
    });
  });
  return result;
}

function createPointTemplate(point) {
  const {type, destination, basePrice, isFavorite, dateFrom, dateTo, offers} = point;

  const destinationName = destination.pointName !== null ? destination.pointName : '';
  const startDate = dateFrom !== null ? humanizePointDueDate(dateFrom) : '';
  const endDate = dateTo !== null ? humanizePointDueDate(dateTo) : '';
  const price = basePrice !== null ? basePrice : '';
  const eventType = type !== null ? type : 'flight';
  const eventDuration = duration(dateFrom, dateTo);
  const activeFavoriteButtonClass = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${getDate(dateFrom)}">${startDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startDate}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endDate}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${renderOffers(offers)}
        </ul>
        <button class="event__favorite-btn ${activeFavoriteButtonClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return createPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
