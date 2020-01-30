/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-curly-newline */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable max-len */

/* eslint-disable */

import api from './api.js';
import { renderLoader } from './ui.js';

const getMalts = (malt) => {
  let htmlCode = '';
  malt.forEach((element) => {
    htmlCode += `${element.name}: ${element.amount.value} ${element.amount.unit}<br>`;
  });
  return htmlCode;
};

const getHops = (malt) => {
  let htmlCode = '<p>';
  malt.forEach((element) => {
    htmlCode += `${element.name}: ${element.amount.value} ${element.amount.unit} (Add ${element.add} ${element.attribute})<br>`;
  });
  htmlCode += '</p>';
  return htmlCode;
};

// Nos servirá para limpiar esa parte del formulario cuando cuando navegemos a otras páginas
// Este removeForm será llamdo en las rutas (routes.js)
export const removeForm = () => {
  const formSection = document.querySelector('#detailSection');
  formSection.innerHTML = '';
};

const quoteTemplate = ({ quote, date }) => `
  <div class="list-item">
    <p>${quote}</p>
    <span>${date}</span>
  </div>
`;

const { getShowDetail } = api();

const detailTeplate = ({ beerId, name, image, description, firstBrewed, price, ingredients } = {}) => `
  <div class="detail-section">
    <header id="${beerId}">
      <div class="title-section">
        <h1>${name}</h1>
      </div>
      <div class="image-container">
        <img src="${image ? image : '/src/images/default.png'}" />
      </div>
    </header>
    <div class="content">
      <h2>Descripción de la cerveza:</h2>
      <p>${description}</p>
    </div>
    <div class="text-container">
      <h2>Mas detalles sobre la cerveza ${name}:</h2>
      <p>- La fecha de elaboración de esta cerveza fue en ${firstBrewed}.</p>
      <p>- Su precio unitario es de ${price}.<p>
    </div>
    <div class="text-container">
      <h2>¿Cuáles son los ingredientes de ${name}?</h2>
      <p><strong>- Cantidad de Malta:</strong><p>
      <p>${getMalts(ingredients.malt)}<p>
      <p><strong>- Cantidad de Lúpulo:</strong><p>
      <p>${getHops(ingredients.hops)}<p>
      <p><strong>- levadura:</strong><p>
      <p>${ingredients.yeast}<p>
    </div>
    <div class="text-container">
    <hr>
    </div>
  </div>
`;

const renderDetail = async id => {
  try {
    renderLoader('hide', 'show');
    // const detail = await Promise.all([          //Retorna (un array: [resolveP1, resolveP2]) lo que devuelve el resolve de la promesa1 y el resolve de la promesa2
    const [detail, quotes] = await Promise.all([  // Para no retocar el codigo hacemos restructuring en la constante detail (que ahora mismo es un array [resolveP1, resolveP2]):
      getShowDetail(id),
      getQuotes(id),
    ]); 
    
    const template = detailTeplate(detail.beer);
    // Cogemos el selector "main" del index.html
    const mainSection = document.querySelector('main');
    // Pintamos el formulario antes que los comentarios (quoteList) porque #quoteList forma parte del formulario (En quotesFormtemplate hay un DIV quoteList)
    // Y si no ha sido pintado previamente no puede ser encontrado en el DOM y "document.querySelector('#quoteList')" devolvería NULL
    renderForm(id);
    const quoteList = document.querySelector('#quoteList');
    quoteList.innerHTML = quotes.map(quoteTemplate).join(''); // [1, 3] -> '13'
    mainSection.innerHTML = template;
  } catch (err) {
    // manejo errores a través de un POPUP utilizando el DOM con selectores
    console.error(err);
  } finally {
    renderLoader('show', 'hide');
  }
};

const quotesFormtemplate = `
  <div id="detail" class="detail-content"></div>
  <div class="quotes-list">
    <h2>Comentarios añadidos para esta cerveza:</h2>
    <div id="quoteList">
    </div>
  </div>
  <form id="quote-form" method="POST" class="quote-form" novalidate>
    <div class="quote-input">
      <label for="quote">Añade un comentario sobre esta cerveza:</label>
      <input name="" required id="quote" placeholder="Añade aquí tu comentario" class="input primary" type="text">
    </div>
    <button type="submit" class="button primary">Añadir comentario</button>
  </form>
`;

const QUOTES_API = 'https://quotes-api-keepcoding.herokuapp.com/api/v1';

const { getQuotes, createQuote } = api(QUOTES_API);

const renderForm = id => {
  const formSection = document.querySelector('#detailSection');
  formSection.innerHTML = quotesFormtemplate; // Pintamos el Formulario.
  // A partir de aquí puedo utilizar el resto de selectores que pinta el formulario (Ya que ha sido pintado)
  const quoteForm = document.getElementById('quote-form');
  const quoteList = document.querySelector('#quoteList');
  const quoteInput = document.getElementById('quote');
  quoteForm.addEventListener('submit', async evt => {
    evt.preventDefault();
    if (quoteInput.validity.valid) {
      // 1. Llamar API crear Quote
      await createQuote(id, quoteInput.value);
      // 2. Renderizo o pinto en el DOM (Hay 3 casos para solucionarlo)
      //   1. caso -> como el result = nuevo quote
      //              lo que hago es llamar una funcion renderQuote(result.quote)
      //              y añade como último comentario

      //   2. caso -> como la promesa es exitosa yo se que se guarda por el API
      //              lo que hago es llamar una funcion renderQuote(quoteInput.value)
      //              y añade eso como último comentario

      //   3. caso -> se que la promesa es exitosa
      //              pero lo que hago es traer toda la lista para pintarla como 
      //              en la función renderDetail
      quoteList.innerHTML += quoteTemplate({
        quote: quoteInput.value,
        date: new Date(),
      });
      quoteInput.value = ''; // Limpia el input text donde añadimos el comentario.
    }
  });
};

export default renderDetail;