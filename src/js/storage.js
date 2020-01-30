/* eslint-disable max-len */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */

// import Cookies from 'js-cookie'

const lStorage = {
  setItem: (key, value) => localStorage.setItem(key, value),
  getItem: (key) => localStorage.getItem(key),
};

const cookieStorage = {
  setItem: (key, value) => Cookies.set(key, value),
  getItem: (key) => Cookies.get(key),
};

const storage = (type = 'lStorage') => {
  const types = {
    lStorage, //(Es lo miso) lStorage: lStorage,
    cookieStorage, //(Es lo miso) cookieStorage: cookieStorage,
  };
  if (typeof (Storage) !== 'undefined') { //Si existen metodos de storage (Si es soportado por el browser)
    return types[type]; //Retornamos los tipos (types) para el tipo que defina el usuario (type)
  }
  //return type['cookieStorage']; //De lo contrario (Si no soporta storage) que devuelva siempre un tipo cookieStorage
  return type.cookieStorage; //De lo contrario (Si no soporta storage) que devuelva siempre un tipo cookieStorage
};

/*
Para usar storage en otro js:
Importamos el js:
  import storage from './storage.js'
lo utilizamos como lStorage o cookieStorage:
  const { setItem, getItem } = storage('lStorage')
  const { setItem, getItem } = storage('cookieStorage')
*/

export default storage;
