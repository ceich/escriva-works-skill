// copyright (c) 2018 Chris Eich
//
// VUI phrase loader for works of St. Josemaría Escrivá
//

var Locales = ['en'];

var Vui = {};

for (let loc of Locales) {
  Vui[loc] = require('./vui-' + loc);
}

module.exports = Vui;
