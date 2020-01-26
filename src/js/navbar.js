import { replace } from './ui.js';
import renderHomeShows from './shows.js';
import storage from './storage.js';

export const INPUT_STORAGE_ID = 'navbar-input';
export const INPUT_STORAGE_MONTH = 'navbar-input-month';
export const INPUT_STORAGE_YEAR = 'navbar-input-year';
export const STORAGE_TYPE = 'lStorage'; //Podría ser lStorage o cookieStorage

//Utilizamos storage de storage.js para realizar un getItem o un setItem del tipo de storage elegido
const { setItem, getItem } = storage(STORAGE_TYPE);

//Estos son lo elementos del DOM que vamos a utilizar (Extraidos del index.html)
const navbar = document.querySelector('#navbar');
const searchIcon = document.querySelector('#navbar-search');
const closeIcon = document.querySelector('#navbar-close');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#navbar .input.search');
const searchInputMonth = document.querySelector('#month');
const searchInputYear = document.querySelector('#year');

//Añadimos a los inputs (.value) el valor que se haya podido añadir como KEY en el lStorage o cookieStorage
//Ya que cuando se añade algún valor en los Inputs del Navbar (Search, month, year)
//Al pulsar en el botón Search los añade como KEY en el lStorage o cookieStorage
searchInput.value = getItem(INPUT_STORAGE_ID);
searchInputMonth.value = getItem(INPUT_STORAGE_MONTH);
searchInputYear.value = getItem(INPUT_STORAGE_YEAR);

//Nos creamos un handleNavbar al cual le pasamos la función replace que recibe el navbar
//handleNavbar será una función que yo puedo utilizar en cualquier lado a la que yo tendré que pasarle el removeClass y addClass
const handleNavbar = replace(navbar);
// "console.log(handleNavbar)" devolvería la siguiente función (ubicada en ui.js):
/*
(removeClass, addClass) => {
  elemento.classList.remove(removeClass);
  elemento.classList.add(addClass);
};*/

//Escuchamos el evento click del icono buscar
//El evento (evt) al no usarse se podría eliminar ()
searchIcon.addEventListener('click', (evt) => {
  //Podríamos hacer el navbar y llamar al classList.replace (que era un método propio de classList) y cambiar esos class:
  //navbar.classList.replace('no-search', 'search');
  //En lugar de eso utilizamos el patrón que creamos en ui.js
  //handleNavbar será una función que yo puedo utilizar en cualquier lado a la que yo tendré que pasarle el removeClass y addClass
  handleNavbar('no-search', 'search');
});

//Escuchamos el evento click del icono cerrar
//El evento (evt) al no usarse se podría eliminar ()
closeIcon.addEventListener('click', () => {
  handleNavbar('search', 'no-search');
  //Otra forma perdiendo el patrón creado en ui.js:
  //navbar.classList.replace('search', 'no-search');
});

//Escuchamos el evento submit del formulario (Dándole a Enter o al botón search)
//Aquí si vamos a utilizar le evento porque vamos a gestionar todo lo que pase por debajo
//y no vamos a realizar el comportamiento por defecto del formulario 
//que ya vimo que ocurría si no preveíamos ese efecto, que era basicamente que 
//llamaría a la ruta que tiene el formulario en el action y pasaría los queryParameters en el caso de GET
searchForm.addEventListener('submit', evt => {
  evt.preventDefault();

  // console.log("searchInput.value:", searchInput.value);
  // console.log("searchInput.validity.valid:", searchInput.validity.valid);
  // console.log("searchInputMonth.value:", searchInputMonth.value);
  // console.log("searchInputYear.value:", searchInputYear.value);

  //Limpiamos el formulario de comentarios del detalle de una cerveza
  const formSection = document.querySelector('#detailSection');
  formSection.innerHTML = '';

  if (searchInput.validity.valid) {
    // Pintar shows con el filtro!
    //renderHomeShows(searchInput.value);
    renderHomeShows(searchInput.value, searchInputMonth.value, searchInputYear.value);
  } else{
    //Limpiamos el mainSection de alguna posible busqueda previa y se le indica que no hay ningún resultado
    //<h2>No hay ningún resultado que mostrar para la busqueda requerida...</h2>
    const mainSection = document.querySelector('main');
    mainSection.innerHTML = `
      <div class="show-section">
      </div>
    `;
  }
  // almacenar KEYs en local storage o cookie storage
  setItem(INPUT_STORAGE_ID, searchInput.value); //setItem('navbar-input', searchInput.value);
  setItem(INPUT_STORAGE_MONTH, searchInputMonth.value); //setItem('navbar-input-month', searchInputMonth.value);
  setItem(INPUT_STORAGE_YEAR, searchInputYear.value); //setItem('navbar-input-year', searchInputYear.value);
});


