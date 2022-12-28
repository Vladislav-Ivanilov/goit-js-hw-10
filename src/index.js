import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import { debounce } from 'lodash';
import listOfCountries from './templates/listOfCountries.hbs';
import cardOfCountry from './templates/countryCard.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchStringInput: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchStringInput.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(element) {
  const countryName = element.target.value.trim();

  if (!countryName) {
    clearTemplate();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        specificInfo();
        clearTemplate();
        return;
      }
      getTemplates(data);
    })
    .catch(error => {
      clearTemplate();
      errorInfo();
    });
}

function getTemplates(element) {
  let template = '';
  let refsTemplate = '';
  clearTemplate();

  if (element.length === 1) {
    template = cardOfCountry(element);
    refsTemplate = refs.countryInfo;
  } else {
    template = listOfCountries(element);
    refsTemplate = refs.countriesList;
  }

  pushTemplate(refsTemplate, template);
}

function specificInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.', {
    timeout: 5000,
    width: '300px',
  });
}

function errorInfo() {
  Notify.failure('Oops, there is no country with that name', {
    timeout: 5000,
    width: '300px',
  });
}

function clearTemplate() {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function pushTemplate(refs, markup) {
  refs.innerHTML = markup;
}
