import renderHomeShows from './shows.js';
import renderDetail, { removeForm } from './detail.js';
import storage from './storage.js';
import { INPUT_STORAGE_ID, INPUT_STORAGE_MONTH, INPUT_STORAGE_YEAR, STORAGE_TYPE } from './navbar.js';

//Utilizamos storage de storage.js para realizar un getItem o un setItem del tipo de storage elegido
const { getItem } = storage(STORAGE_TYPE);

//Este page viene de PageJS: https://cdn.rawgit.com/visionmedia/page.js/master/page.js
//Con PageJS Conseguimos una navegación client-side (SPA: Single Page Aplication)
//Mantenemos la vista que teníamos:
page('/', () => {
  // console.log('Route /');
  
  // console.log("getItem(INPUT_STORAGE_ID):", getItem(INPUT_STORAGE_ID));

  //Eliminamos el formulario de comentarios (quotesFormtemplate) que pintamos en detail.js (Y que sólo es utilizado a nivel de detalle de cerveza para añadir comentarios sobre ella)
  removeForm();
  
  if(getItem(INPUT_STORAGE_ID))
    //renderHomeShows(getItem(INPUT_STORAGE_ID));
    renderHomeShows(getItem(INPUT_STORAGE_ID),getItem(INPUT_STORAGE_MONTH),getItem(INPUT_STORAGE_YEAR));
});
//Creamos la vista de Detalle
//El ":id" va ser macheado: /detail/123
page('/detail/:id', (ctx) => {
  //console.log('Detail');
  // console.log('Route /detail/:id');
  // console.log('Contexto (ctx):', ctx);
  //Dentro del Contexto (ctx) nos interesa el id que está en: ctx { params: { id: xx } }
  //OPCION 1 (Cogerlo directamente):
  //const id = ctx.params.id;
  //OPCION 2 (Destructuring del contexto):
  //1) const { id } = ctx.params;
  //2) const { params: { id } } = ctx;
  const { params: { id } } = ctx;
  // console.log('id:', id);
  renderDetail(id); //Utilizando el Destructuring
});

page();
