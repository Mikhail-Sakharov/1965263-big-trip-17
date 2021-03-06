import flatpickr from 'flatpickr';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDate, transformDateToISOString} from '../util.js';
import {EVENT_TYPES, BLANK_POINT, DateTimeFormat} from '../const.js';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTypesToggleTemplate = (eventTypes, id) => eventTypes.map((eventType) => `<div class="event__type-item">
                                      <input id="event-type-${eventType}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType}">
                                      <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType}</label>
                                    </div>`).join(' ');

const createDestinationsListTemplate = (destinations) => destinations ? destinations.map((destination) => `<option value="${destination.name}"></option>`).join(' ') : '';

const createDestinationTemplate = (pictures, description) => {
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
};

const createOffersTemplate = (eventType, checkedOffers, allOffers, isDisabled) => {
  const offersTemplate = allOffers !== null ? allOffers.map((offer) => `<div class="event__offer-selector">
                    <input class="event__offer-checkbox visually-hidden" id="event-offer-${eventType}-${offer.id}" type="checkbox" name="event-offer-${eventType}-${offer.id}" ${checkedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
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
};

const createEditPointTemplate = (state = BLANK_POINT, allOffers = null, destinations) => {
  const {
    type,
    destination,
    basePrice,
    dateFrom,
    dateTo,
    offers,
    id,
    isDisabled,
    isSaving,
    isDeleting
  } = state;

  const destinationName = destination !== null ? destination.name : '';
  const destinationPictures = destination !== null ? destination.pictures : null;
  const destinationDescription = destination !== null ? destination.description : null;
  const startDate = dateFrom !== null ? humanizePointDate(dateFrom, DateTimeFormat.DATE_TIME) : '';
  const endDate = dateTo !== null ? humanizePointDate(dateTo, DateTimeFormat.DATE_TIME) : '';
  const price = basePrice !== null ? basePrice : '';
  const eventType = type !== null ? type : 'flight';
  const specifiedTypeOffers = allOffers !== null ? allOffers.find((offer) => offer.type === eventType).offers : null;
  return (`<li class="trip-events__item">
             <form class="event event--edit" action="#" method="post">
               <header class="event__header">
                 <div class="event__type-wrapper">
                   <label class="event__type event__type-btn" for="event-type-toggle-${id}">
                     <span class="visually-hidden">Choose event type</span>
                     <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
                   </label>
                   <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">
                   <div class="event__type-list ${isDisabled ? 'visually-hidden' : ''}">
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
                   <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
                   <datalist id="destination-list-${id}">
                     ${createDestinationsListTemplate(destinations)}
                   </datalist>
                 </div>
                 <div class="event__field-group event__field-group--time">
                   <label class="visually-hidden" for="event-start-time-${id}">From</label>
                   <input class="event__input event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDate}" ${isDisabled ? 'disabled' : ''}>
                   &mdash;
                   <label class="visually-hidden" for="event-end-time-${id}">To</label>
                   <input class="event__input event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDate}" ${isDisabled ? 'disabled' : ''}>
                 </div>
                 <div class="event__field-group event__field-group--price">
                   <label class="event__label" for="event-price-${id}">
                     <span class="visually-hidden">Price</span>
                     &euro;
                   </label>
                   <input class="event__input event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''} pattern="[0-9]+">
                 </div>
                 <button class="event__save-btn btn btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
                 <button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
                 <button class="event__rollup-btn" type="button">
                   <span class="visually-hidden">Open event</span>
                 </button>
               </header>
               <section class="event__details">
                   ${createOffersTemplate(eventType, offers, specifiedTypeOffers, isDisabled)}
                   ${createDestinationTemplate(destinationPictures, destinationDescription)}
               </section>
             </form>
           </li>`);
};

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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  setRollUpButtonClickHandler = (callback) => {
    this._callback.rollUpButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollUpButtonClickHandler(this._callback.rollUpButtonClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelector('.event__details').addEventListener('click', this.#offersCheckHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
  };

  #setStartDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: DateTimeFormat.DATEPICKER,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#startDateChangeHandler
      }
    );
  };

  #setEndDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: DateTimeFormat.DATEPICKER,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#endDateChangeHandler
      }
    );
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: transformDateToISOString(userDate),
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: transformDateToISOString(userDate),
    });
  };

  #eventTypeToggleHandler = (evt) => {
    const eventType = evt.target.closest('.event__type-item').querySelector('.event__type-input').value;
    const eventPriceInputElementValue = this.element.querySelector('.event__input--price').value;
    this.updateElement({
      basePrice: eventPriceInputElementValue,
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

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
