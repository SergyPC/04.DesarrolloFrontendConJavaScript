const API_KEY = 'K8DSA0C-DKZ44V1-GEHS35S-R5ECFWV';

//Cuando yo llame a api() esta devolverá un objeto que tiene getShows que es una función a la vez:
//api() // { getShows: () =>  }
//Con lo cual, si yo lo asignase a una variable (llamandola api igualmente o como quieras), esto tendría acceso a getShows, que en sí es una función, que es asincrona además,
//const apiTvmaze = api()
//apiTvmaze.getShows();
//Por eso después se puede hacer el destructurado de esa api en shows.js (const { getShows } = api();), ya que es un objeto que tiene una función.
//const api = (apiURL = 'https://api.tvmaze.com') => {
//a apiURL le damos un valor por defecto: 
//http://api.tvmaze.com/shows

// https://beerflix-api.herokuapp.com/api/v1/beers?limit=10 //Devuelve las cervezas (max 10)
// https://beerflix-api.herokuapp.com/api/v1/beers?search=beer&limit=10 //Devuelve las cervezas (max 10) cuya palabra clave sea beer
// https://beerflix-api.herokuapp.com/api/v1/beers/20 //Devuelve la cerveza cuyo id=20

const api = (apiURL = 'https://beerflix-api.herokuapp.com/api/v1/beers') => {
  //const searchAPIEndpoint = `${apiURL}/search/shows?q`;
  //EJEMPLO: http://api.tvmaze.com/search/shows?q=girls
  const searchAPIEndpoint = `${apiURL}?limit=10&search`;
  //const showsAPIEndpoint = `${apiURL}/shows`;
  //EJEMPLO: http://api.tvmaze.com/shows
  //const showsAPIEndpoint = `${apiURL}?limit=10`;
  const showsAPIEndpoint = `${apiURL}`;
  return {
    
    getShowsTypeBeer: async (text, month, year) => {
      try {
        //const URL = text ? `https://api.tvmaze.com/search/shows?q=${text}` : showsAPIEndpoint;
        //const URL = `https://beerflix-api.herokuapp.com/api/v1/beers?search=${text}&limit=10`;
        //Si me llega texto usamos la que teníamos antes y si no me llega texto utilizamos la que me devuelve todos (max 10)
        const URL = text ? `https://beerflix-api.herokuapp.com/api/v1/beers?search=${text}&limit=10` : showsAPIEndpoint;
        const response = await fetch(URL, {
          method: 'GET',
           headers: {
             'X-API-KEY': API_KEY,
           },
        });
        if (!response.ok) {
          throw new Error('Error retrieving shows');
        }
        const data = await response.json(); //Devuelve la respuesta como Json

        let filteredData = [];

        if(month || year) {
          for (const key in data.beers) {
            if(data.beers[key].firstBrewed){
              const mm = data.beers[key].firstBrewed.substring(0,2).toString();
              const aaaa = data.beers[key].firstBrewed.substring(3,7).toString();
              if(month && year) {
                if (mm === month && aaaa === year){
                  filteredData.push(data.beers[key]);
                }
              }
              else if(month && !year) {
                if (mm === month){
                  filteredData.push(data.beers[key]);
                }
              }
              else if(!month && year) {
                if (aaaa === year){
                  filteredData.push(data.beers[key]);
                }
              }
            }
          }
        }
        else
          filteredData = data.beers;

        const showsTypeBeer = filteredData;
        //const showsTypeBeer = data.beers;

        return showsTypeBeer;
        // const shows = data.map(result => {
        //   if (result.show) {
        //     return result.show;
        //   }
        //   return result;
        // });
        // return shows;
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    },
    getShowDetail: id => {
      //return fetch(`${showsAPIEndpoint}/${id}`)
      return fetch(`${showsAPIEndpoint}/${id}`, {
        method: 'GET',
         headers: {
           'X-API-KEY': API_KEY,
         },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error retrieving show id: ${id}`);          }
            return response.json();
        })
        /*Nos podemos ahorrar este ".then(detail => {" porque la promesa de arriba devuelve un "response.json();"
        ¿Qué es response.json();? Una promesa
        Entonces cuando ésto está resuelto lo que devuelve en renderDetail (detail.js) 
        Y el response.json(); lo que devuelve es el "data", que es el "detalle".
        Por eso no haría falta poner este codigo comentado (aunque también funcionaría con él pero sería redundante):*/
        // .then(detail => {
        //   return detail;
        // })
        .catch(err => {
          console.error(err.message);
          throw err;
        });
    },
    getQuotes: async id => {
      try {
        const response = await fetch(`${apiURL}/quote/${id}`);
        //console.log (`getQuotes-apiURL: ${apiURL}/quote/${id}`);
        //https://quotes-api-keepcoding.herokuapp.com/api/v1/quote/20
        if (!response.ok) {
          throw new Error('Error getQuotes');
        }
        const quotes = await response.json();
        return quotes;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    createQuote: async (id, text) => {
      try {
        const response = await fetch(`${apiURL}/quote/${id}`, {
          method: 'POST',
          body: JSON.stringify({ quote: text }),
          headers: {
            'Content-type': 'application/json',
            'X-API-KEY': API_KEY,
          },
        });
        //console.log(response);
        if (!response.ok) {
          throw new Error('Error createQuote');
        }
        const responseBody = await response.json();
        return responseBody;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  };
};

export default api;