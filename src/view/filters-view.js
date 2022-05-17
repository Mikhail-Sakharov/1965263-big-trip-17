import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate(points = []) {
  const isEverything = points.length !== 0;
  const isFuture = points.some((point) => point.dateFrom >= dayjs().toISOString());
  const isPast = points.some((point) => point.dateTo < dayjs().toISOString());

  return `<form class="trip-filters" action="#" method="get">
                <div class="trip-filters__filter">
                  <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isEverything  ? '' : 'disabled'}>
                  <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
                </div>

                <div class="trip-filters__filter">
                  <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${isFuture ? '' : 'disabled'}>
                  <label class="trip-filters__filter-label" for="filter-future">Future</label>
                </div>

                <div class="trip-filters__filter">
                  <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${isPast ? '' : 'disabled'}>
                  <label class="trip-filters__filter-label" for="filter-past">Past</label>
                </div>

                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
}

export default class FiltersView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createFiltersTemplate(this.#points);
  }
}
