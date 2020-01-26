import api from './api.js';
import { renderLoader } from './ui.js';

//Hacemos un poco de destructuring y nos quedamos con los getShows TypeBeer
//El destructuring sale de la función "api()"" que está devolviendo un objeto que tiene getShows
//Entonces si api devuelve objetos, a la variable la puedo destructurar
//const { getShows } = api();
const { getShowsTypeBeer } = api();

//Template de un showBeer entero donde harcodeamos los valores que recogemos del API
const templateShowBeer = show => {
  return `
    <a href="/detail/${show.beerId}">
      <div class="card ${show.principal ? 'principal' : 'secondary close'}">
        <header class="card-header">
          <h2>${show.name}</h2>
        </header>
        <div class="card-content">
          <div class="card-content-image">
            <img src="${show.image ? show.image : '/src/images/default.png'}" alt "${show.name}">
          </div>
          <div class="card-content-text">
            <p>${show.description}</p>
            <div class="rating-container-none">
              <button class="icon">
                <i class="fas fa-star"></i>
              </button>
              <button class="icon">
                <i class="far fa-star"></i>
              </button>
              <button class="icon">
                <i class="far fa-star"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a>
  `;
};

//Pinta en base a un elemento (element.innerHTML) y [un array]: una serie de items que sean shows (htmlShows)
//Recibe el elemento y un listado de items (Shows)
//Al añadir EXPORT lo podría utilizar en cualquier otro .js (importándolo en ese .js previamente)
//Siempre que le pase un elemento y un array va a pintarme donde esté ese elemento shows
export const renderShows = (element, items) => {
  //Esta variable va ha hacer un map de estos items 
  //(Y qué mapeo vamos ha hacer): Vamos a decir que cada item reciba como mapeo un template (templateShow)
  //Lo que me va a devoler esto es un array con templates "templateShow"
  //EJ: [<a>....</a>,<a>....</a>]
  //slice(0, 10): que quedas con las posiciones de 0 a 10 del array
  //const htmlShows = items.slice(0, 10).map(function (show, index) {
  const htmlShows = items.map(function (show, index) {
    //Antes solo pintabamos shows:
    //return templateShowBeer(show);
    if (index < 1) {
      //Pintará un show: Visualiza Título, imagen y descripción del show
      //return templateShow({ ...show, principal: true });
      //Le añadimos un KEY extra a nuestro objeto que no viene en el pageload del API
      //Vamos a extender o hacer una copia de ese show ({...show}),
      //para añadirle una nueva key que sería principal y estaría a true (principal: true)
      return templateShowBeer({ ...show, principal: true });
    }
    //Visualiza sólo Título del show y habría que abrirlo para ver el resto
    //return templateShow({ ...show, principal: false });
    return templateShowBeer({ ...show, principal: false });
  }).join('') // [1, 2] -> '12' (Para eliminar la "," que pintaría)
  //Pinto todos los templates juntos ya que hago un JOIN al array de templates UNIENDOLO en un único string
  //slice lo usa para sacar como maximo 10 shows a visualizar
  //La etiqueta <div class="show-section"> se añade directamente ya que es el DIV contenedor de los 10 shows
  //Esta iría después del MAIN: <main><div class="show-section">(10 shows)</div></main>
  //Si vuelvo a realizar una nueva busqueda vuelve a repintarlo por completo
  //DEBE DE AÑADIR ESE DIV aquí y no en el HTML porque cuando se va al detalle de una cerveza y se pinta 
  //(a través de la función renderDetail -> mainSection.innerHTML = template;) ese detalle se carga el DIV y si vuelvo del detalle a la home daría un error porque no existe ese DIV
  element.innerHTML = `
    <div class="show-section">
      ${htmlShows}
    </div>
  `;

  /*A partir de aquí ya ha pintado el HTML en el DOM que hemos añadido por JS en el Template*/
  /*Ahora podemos utilizar los Selectores y Eventos sobre el codigo añadido por JS en el DOM*/

  //Recogemos un array de las tarjetas añadidas (max 10)
  const cardHeaders = document.querySelectorAll('.card .card-header');

  //Queremos que al pulsar sobre la cabecera de la tarjeta se muestre o no el detalle de la tarjeta
  cardHeaders.forEach((header, index) => {
    //console.log(header); //<header class="card-header">...</header>
    //parentNode: Es el padre de la clase header
    // <div class="card ${show.principal ? 'principal' : 'secondary close'}">
    //     <header class="card-header">
    //     ...
    //     </header>
    // </div>
    //Si header es: <header class="card-header">
    //parentNode es: <div class="card ${show.principal ? 'principal' : 'secondary close'}">
    const card = header.parentNode;
    //Para cada uno de los header (de cada tarjeta) vamos a añadir un EventListener (a cada uno de ellos)
    header.addEventListener('click', evt => {
      evt.preventDefault(); //No queremos que vaya el click afuera, porque queremos que el click muestre o no las tarjetas (al pulsar en el triangulo negro) y que se colapsen o no, dependiendo del evento click
      card.classList.toggle('close'); // si close está presente la elimina, de lo contrario la añade (<div class="card ${show.principal ? 'principal' : 'secondary close'}">)
    });
  });
};

//Pinta sobre un selector concreto en la Home (document.querySelector('main');)
//Éste lleva ya acoplado que tenga que pertenecer a éste selector (main).
//Pintará los shows (Siempre que le pase un texto va a renderizar shows)
const renderHomeShows = async (text, month, year) => {
  try {
    //Previsualiza el efecto loader mientras consigue los datos de la API
    renderLoader('hide', 'show');

    // getShowsTypeBeer(text)
    //   .then((showsTypeBeer) => {
    //     console.log("showsTypeBeer::::", showsTypeBeer);
    //   });

    const showsTypeBeer = await getShowsTypeBeer(text, month, year);
    const mainSection = document.querySelector('main');
    
    //Esta función es la encargada de pintar añadir en el DOM el HTML que añadimos por JS
    //Función a la que le pasamos la sección del elemento y todos los items
    renderShows(mainSection, showsTypeBeer);

    // const shows = await getShows(text);
    // const mainSection = document.querySelector('main');
    // //Función a la que le pasamos la sección del elemento y todos los items
    // renderShows(mainSection, shows);

  } catch (err) {
    console.log(err);
    // Manejador de error a nivel UI (Deslogearle, sacar un modal)
  } finally {
    //Quita el efecto loader ya que ha terminado de obtener los datos obtenidos del API
    renderLoader('show', 'hide');
  }
};

export default renderHomeShows;
