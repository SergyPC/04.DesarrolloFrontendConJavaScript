/* eslint-disable */

/** 
 * PARA QUE FUNCIONE EL SERVIDOR QUE ESCUCHA EN EL PUERTO 3000:
 * Hay que abrir la consola de MS-DOS y acceder a la carpeta donde esté el proyecto
 * ( En mi caso: cd C:\Users\Sergio\Desktop\BootcampWEB\04 Desarrollo Frontend con JavaScript\Practica )
 * Ejecutar: npm init -y
 *      Esto creará un package.json:
 *      {
 *       "name": "practica",
 *       "version": "1.0.0",
 *       "main": "server.js",
 *       "dependencies": {
 *         "express": "^4.17.1"
 *       },
 *       "devDependencies": {},
 *       "scripts": {
 *         "test": "echo \"Error: no test specified\" && exit 1",
 *         "start": "node server.js"
 *       },
 *       "keywords": [],
 *       "author": "",
 *       "license": "ISC",
 *       "description": ""
 *     }
 * Ejecutar: npm install --save express
 *      Esto generará:
 *      - 1 carpeta: node_modules
 *      - 1 archivo: package-lock.json
 * Ejecutar: node server.js
 * IMPORTANTE: ACORDARSE DE NO SUBIR LA CARPETA node_modules AÑADIENDO LA PALABRA EN EL ARCHIVO .gitignore
 * */

//Creamos nuestro servidor que escucha en el puerto 3000

const express = require('express'); //Importo el módulo express
const PORT = 3000; //Creo una variable con el puerto 3000

const app = express(); //La variable app llamará a la función express, que es lo que exporta la librería de express (Esto viene en la documentación de express)

// console.log(__dirname); 

//Usamos un metodo propio de Express: Express está diciendo todo lo que esté a ésta altura ('.') va a ser estático.
//(Esto ya sería igual que Http Server) De manera que yo cuando haga una petición a / (/src/css/styles.css), / va ir al origen del servidor (localhost:3000/)
//Y como hemos dicho que desde esa ruta todo sea estatico, cuando vaya al src y vaya al css (<link rel="stylesheet" href="/src/css/styles.css">) eso va a ser estatico y lo voy a poder descargar. 
//Al poderlo descargar, voy a poder evaluar el css y el javascritp y mi aplicación debería funcionar.
app.use(express.static('.')); // servidor de estaticos que trabaja exactamente igual que http-server .
//Ya tenemos (Con Express) un generador de estáticos para mostrar html, css y javascritp
//Ahora volvemos a tener el problema que tuvimos en http server (Y nos ocurre ahora en Express), de "Cannot GET /detail/1" (Ya que al ir al detalle de una cerveza nos pone: localhost:3000/detail/1)
//Al funcionar como httpServer Todo lo que machee con alguna de las carpetas (html, css, images, javascritp), mi servidor, en este caso Express (o el que sea, que sirva estáticos como http-server) me lo va a mostrar.
//Pero no los detalles "detail/xxx"
//¿Cómo lo resuelvo yo o las SPA (Single Page Application)?
//en el método "get ('/', ..." añadimo un * ("get ('/*', ...")
//De esta forma todo lo que me llegue de rutas lo voy a enviar a index.html, como se puede observar en la siguente método get

//Llamamos al método get del API de Express
//Ponemos /* ya que el servidor no está generando un servidor de estaticos no está creando 
//El callback recibe 2 parametros req y res
app.get('/*', (req, res) => { //Para que funcione como SPA (Si pensamos en PageJS): Si voy a la ruta '/' de mi servidor, que corre en el 3000, deberíamos ver Hello World
  //res.send('Hello World');
  //Le añadimos __dirname ya que a NODE no se le puede pasar una ruta relativa ('index.html' o './index.html')
  //__dirname es una palabra reservada de NODE que devuelve la ruta absoluta donde se encuentra este JS.
  //Para entender como se evalua ésto: Nosotros estamos pidiendo al servidor un index.html, ¿Cuándo? En cualquier ruta. Eso quiere decir que cuando escribe cualquier cosa después de localhost:3000/xxxx va a ir a index.html y no hará nada...
  //Lo que está ocurriendo es que cuando yo pida una ruta, lo que se evalua es index.html para cualquier ruta.
  //Dentro del index, al final va al archivo de rutas del frontend (routes.js) y ya ahí realiza esa navegación y no le cuadra ninguna de page [ (page('/', () => {) ó (page('/detail/:id', (ctx) => {) ]
  res.sendFile(__dirname + '/index.html');
});

//Método de Express para escuchar que recibe:
// - como primer párametro recibe el puerto, donde va a estar eschuchando ese servidor
// - como segundo párametro un callback, cuando ya esté arrancado ese servidor 
app.listen(PORT, () => { 
  console.log('Listening...');
});
