import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, duration} from '../util.js';
import {DateTimeFormat} from '../const.js';

function createOffersTemplate(checkedOffersIds, allOffers) {
  let result = '';
  if (allOffers !== null) {
    checkedOffersIds.forEach((checkedOfferId) => {
      const {title, price} = allOffers.find((offer) => offer.id === checkedOfferId);
      result = `${result  }
                        <li class="event__offer"><span class="event__offer-title">${title}<span>&plus;&euro;&nbsp;<span class="event__offer-price">${price}</span></li>`;
    });
    result = `<h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${result}
                    </ul>`;
  }
  return result;
}

function createPointTemplate(point, allOffers) {
  const {type, destination, basePrice, isFavorite, dateFrom, dateTo, offers} = point;

  const destinationName = destination !== null ? destination.name : '';
  const eventDate = dateFrom !== null ? humanizePointDate(dateFrom, DateTimeFormat.HUMAN) : '';
  const startDate = dateFrom !== null ? humanizePointDate(dateFrom, DateTimeFormat.TIME) : '';
  const endDate = dateTo !== null ? humanizePointDate(dateTo, DateTimeFormat.TIME) : '';
  const price = basePrice !== null ? String(basePrice) : '';
  const eventType = type !== null ? type : 'flight';
  const eventDuration = duration(dateFrom, dateTo);
  const activeFavoriteButtonClass = isFavorite ? 'event__favorite-btn--active' : '';
  const specifiedTypeOffers = allOffers.find((offer) => offer.type === eventType).offers;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizePointDate(dateFrom, DateTimeFormat.FULL_DATE)}">${eventDate}</time>
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
          &euro;&nbsp;<span class="event__price-value">${he.encode(price)}</span>
        </p>        
          ${createOffersTemplate(offers, specifiedTypeOffers)}        
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

export default class PointView extends AbstractView {
  #point = null;
  #offers = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
