// copyright (c) 2018 Chris Eich
//
// Data loader for works of St. Josemaría Escrivá
//

var Locales = ['en'];

var Data = {};

for (let loc of Locales) {
  Data[loc] = require('./data-' + loc);
}

module.exports = Data;
