// copyright (c) 2018 Chris Eich
//
// Query interface to works of St. Josemaría Escrivá
//

// keyed by locale
var Data = require('./data');
var Vui = require('./vui');

var Works = {
  "All Works": 0,
  "The Way": 1,
  "Furrow": 2,
  "The Forge": 3,
  "Friends of God": 4,
  "Christ is Passing By": 5,
  "In Love with the Church": 6,
  "Holy Rosary": 7,
  "The Way of the Cross": 8,
  "Conversations": 9,
};

// lookup a single item
// - params
//   - book
//   - locale
//   - number (optional)
function lookup(params) {
  if (!params || !params.book) {
    return { error: "book is required" };
  }
  var result = {};
  var book = Works[params.book] || params.book;
  var number = params.number || 1;
  return {
    result: {
      speechText: Data[params.locale][book][number],
      repromptText: Vui[params.locale].lookupReprompt
    }
  };  
}

module.exports.lookup = lookup;
