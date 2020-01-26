/**Gestionamos elementos del UI**/

//Función  que retorna otra función y la segunda función tiene a elemento como parte de ella (de su propio contexto).
// De manera que se pueden crear variables con esa función propia
export const replace = elemento => (removeClass, addClass) => {
  elemento.classList.remove(removeClass); //Realizamos un remove de la clase que queremos borrar
  elemento.classList.add(addClass); //Realizamos un add de la clase que queremos crear
};

/*
//Es lo mismo que lo de arriba
function replace(elemento) {
  return function () {
    elemento.classList.remove(removeClass); //Realizamos un remove de la clase que queremos borrar
    elemento.classList.add(addClass); //Realizamos un add de la clase que queremos crear
  }
}
*/

/*
//La interfaz de esto podría ser llamar a un loaderReplace
//La cual puede llama al metodo replace que tendrá el elemento loader (supongamos es un "document.getElementById('loader')", que sería el elemento)
//Y luego se ejecuta de la siguiente manera, "('hide', 'show')", donde le pasamos que se oculte y le pasamos que se muestre
const loaderReplace = replace(document.getElementById('loader'))('hide', 'show');
*/

/*
//Como la linea anterior es muy rara para escribirla con los parentesis así.
//La forma util de utilizarla sería tener primero el LoaderUI/loaderReplace y utilizarlo donde queramos, con las clases que queramos
//loaderUI retorna una función, replace, a la cual le pongo removeClass ó addClass
//Y yo sé que este loaderUI ya tiene el elemento en sí (elemento), entonces yo puedo pasarle los parametros que yo quiera desde el lugar del código que yo quiera
const loaderUI = replace(document.getElementById('loader'))
*/

//Nos traemos del DOM de index.html el loader que está en el HTML que nos pasó del main-section (<div id="loader" class="loader-container hide">)
//class="loader-container" añade un efecto de busqueda el típico loader en círculo
//class="loader-container hide" oculta el efecto del loader
const loader = document.querySelector('#loader');

//Creamos una función renderLoader para utilizarla en show
//Es una función porque lo que retorna replace(loader) es una ejecución: "export const replace = elemento => (removeClass, addClass) => {"
//Esa ejecución lo que retorna es una función cuyo elemento de entrada es el loader 
// (removeClass, addClass) => {
//   loader.classList.remove(removeClass); //Realizamos un remove de la clase que queremos borrar
//   loader.classList.add(addClass); //Realizamos un add de la clase que queremos crear
// };
export const renderLoader = replace(loader);
