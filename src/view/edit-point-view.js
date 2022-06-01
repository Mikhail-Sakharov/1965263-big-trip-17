import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueDate} from '../util.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';
const DATEPICKER_FORMAT = 'd/m/y H:i';
const EVENT_TYPES = [
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
const BLANK_POINT = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: null
};

function createEventTypesToggleTemplate(eventTypes, id) {
  return eventTypes.map((eventType) => `<div class="event__type-item">
                                      <input id="event-type-${eventType}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType}">
                                      <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType}</label>
                                    </div>`).join(' ');
}

function createDestinationsListTemplate(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join(' ');
}

function createDestinationTemplate(pictures, description) {
  const picturesTemplate = pictures !== null ? pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join(' ') : '';
  if (pictures || description) {
    return `<section class="event__section event__section--destination">
                <h3 class="event__section-title event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${description !== null ? description : ''}</p>
                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                      ${picturesTemplate}
                    </div>
                  </div>
                </section>`;
  }
  return '';
}

function createOffersTemplate(eventType, checkedOffers, allOffers) {
  const offersTemplate = allOffers !== null ? allOffers.map((offer) => `<div class="event__offer-selector">
                    <input class="event__offer-checkbox visually-hidden" id="event-offer-${eventType}-${offer.id}"   type="checkbox"name="event-offer-${eventType}-${offer.id}" ${checkedOffers.includes(offer.id) ? 'checked' : ''}>
                    <label class="event__offer-label" for="event-offer-${eventType}-${offer.id}">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offer.price}</span>
                    </label>
                  </div>`).join(' ') : '';
  return offersTemplate !== '' ? `<section class="event__section event__section--offers">
                <h3 class="event__section-title event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                    ${offersTemplate}
                  </div>
              </section>` : '';
}

function createEditPointTemplate(state, allOffers, destinations) {
  const {type, destination, basePrice, dateFrom, dateTo, offers, id} = state;

  const destinationName = destination.name !== null ? destination.name : '';
  const startDate = dateFrom !== null ? humanizePointDueDate(dateFrom, DATE_TIME_FORMAT) : '';
  const endDate = dateTo !== null ? humanizePointDueDate(dateTo, DATE_TIME_FORMAT) : '';
  const price = basePrice !== null ? basePrice : '';
  const eventType = type !== null ? type : 'flight';
  const specifiedTypeOffers = allOffers.find((offer) => offer.type === type).offers;

  return (`<li class="trip-events__item">
             <form class="event event--edit" action="#" method="post">
               <header class="event__header">
                 <div class="event__type-wrapper">
                   <label class="event__type event__type-btn" for="event-type-toggle-${id}">
                     <span class="visually-hidden">Choose event type</span>
                     <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
                   </label>
                   <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">
                   <div class="event__type-list">
                     <fieldset class="event__type-group">
                       <legend class="visually-hidden">Event type</legend>
                       ${createEventTypesToggleTemplate(EVENT_TYPES, id)}
                     </fieldset>
                   </div>
                 </div>
                 <div class="event__field-group  event__field-group--destination">
                   <label class="event__label  event__type-output" for="event-destination-${id}">
                     ${eventType}
                   </label>
                   <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${id}">
                   <datalist id="destination-list-${id}">
                     ${createDestinationsListTemplate(destinations)}
                   </datalist>
                 </div>
                 <div class="event__field-group event__field-group--time">
                   <label class="visually-hidden" for="event-start-time-${id}">From</label>
                   <input class="event__input event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDate}">
                   &mdash;
                   <label class="visually-hidden" for="event-end-time-${id}">To</label>
                   <input class="event__input event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDate}">
                 </div>
                 <div class="event__field-group event__field-group--price">
                   <label class="event__label" for="event-price-${id}">
                     <span class="visually-hidden">Price</span>
                     &euro;
                   </label>
                   <input class="event__input event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
                 </div>
                 <button class="event__save-btn btn btn--blue" type="submit">Save</button>
                 <button class="event__reset-btn" type="reset">Delete</button>
                 <button class="event__rollup-btn" type="button">
                   <span class="visually-hidden">Open event</span>
                 </button>
               </header>
               <section class="event__details">
                   ${createOffersTemplate(eventType, offers, specifiedTypeOffers)}
                   ${createDestinationTemplate(destination.pictures, destination.description)}
               </section>
             </form>
           </li>`);
}

export default class EditPointView extends AbstractStatefulView {
  #datepicker = null;

  #offers = null;
  #destinations = null;

  constructor(point = BLANK_POINT, offers, destinations) {
    super();
    this._state = EditPointView.parsePointToState(point);
    this.#offers = offers;
    this.#destinations = destinations;

    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offers, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollUpButtonClickHandler(this._callback.rollUpButtonClick);
  };

  setRollUpButtonClickHandler = (callback) => {
    this._callback.rollUpButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonClickHandler);
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #eventTypeToggleHandler = (evt) => {
    const eventType = evt.target.closest('.event__type-item').querySelector('.event__type-input').value;
    const eventPriceInputValue = this.element.querySelector('.event__input--price').value;
    this.updateElement({
      basePrice: eventPriceInputValue,
      type: eventType,
      offers: []
    });
  };

  #offersCheckHandler = () => {
    const REG_EXP = /\d$/;
    const checkedOfferElements = this.element.querySelectorAll('.event__offer-checkbox:checked');
    const checkedOffers = Array.from(checkedOfferElements).map((offerElement) => Number(offerElement.id.match(REG_EXP)[0]));

    this._setState({
      offers: checkedOffers,
    });
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value
    });
  };

  #destinationInputHandler = (evt) => {
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value) ? this.#destinations.find((destination) => destination.name === evt.target.value) : this._state.destination;
    this.updateElement({
      destination: newDestination
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #rollUpButtonClickHandler = () => {
    this._callback.rollUpButtonClick();
  };

  #setStartDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: DATEPICKER_FORMAT,
        defaultDate: this._state.dateFrom,
        onChange: this.#startDateChangeHandler
      }
    );
  };

  #setEndDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: DATEPICKER_FORMAT,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#endDateChangeHandler
      }
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelector('.event__details').addEventListener('click', this.#offersCheckHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
  };

  static parsePointToState = (point) => ({...point,
    isCheckedOffers: point.offers.length !== 0,
    isDestination: point.destination !== null
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isCheckedOffers;
    delete point.isDestination;

    return point;
  };
}
