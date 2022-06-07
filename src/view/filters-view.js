import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, name, count} = filter;

  return `<div class="trip-filters__filter">
                  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${count === 0 ? 'disabled' : ''} ${type === currentFilterType ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
                </div>`;
}

function createFiltersTemplate(filters, currentFilterType) {
  const filtersTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(' ');

  return `<form class="trip-filters" action="#" method="get">
                ${filtersTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const isFilterDisabled = evt.target.closest('.trip-filters__filter').querySelector('input').disabled;
    if (isFilterDisabled) {
      return;
    }
    const filterType = evt.target.closest('.trip-filters__filter').querySelector('input').value;
    this._callback.filterTypeChange(filterType);
  };
}
