// copyright (c) 2018 Chris Eich
//
// Query interface to works of St. Josemaría Escrivá
//

// keyed by locale
var Data = require('./data');
var Vui = require('./vui');

// These keys must match the values of the "values[i].name.value" key 
// in the speech model's BOOK type definition
var Works = {
  "The Way": "1",
  "Furrow": "2",
  "The Forge": "3",
  "Friends of God": "4",
  "Christ is Passing By": "5",
  "In Love with the Church": "6",
  "Holy Rosary": "7",
  "The Way of the Cross": "8",
  "Conversations": "9",
};

// list the books
// - params
//   - locale
function list(params) {
  var names = [];
  for (var book in Works) {
    names.push(Data[params.locale][Works[book]].name);
  }

  return {
    result: {
      speechText: names.join(', '),
      repromptText: Vui[params.locale].listReprompt
    }
  };
}

// describe a book
// - params
//   - book
//   - locale
function describe(params) {
  if (!params || !params.book) {
    return {
      error: Vui[params.locale].bookIsRequired
    };
  }
  var result = {};
  var book = Works[params.book] || params.book;
  if (Data[params.locale][book].description) {
    return {
      result: {
        speechText: Data[params.locale][book].description,
        repromptText: Vui[params.locale].readReprompt,
        title: Data[params.locale][book].name
      }
    };
  } else {
    return {
      error: Vui[params.locale].numberTooHigh
    }
  }
}

// lookup a single item
// - params
//   - book
//   - locale
//   - number (optional)
function lookup(params) {
  if (!params || !params.book) {
    return {
      error: Vui[params.locale].bookIsRequired
    };
  }
  var result = {};
  var book = Works[params.book] || params.book;
  var number = params.number || '1';
  if (Data[params.locale][book][number]) {
    return {
      result: {
        speechText: Data[params.locale][book][number],
        repromptText: Vui[params.locale].lookupReprompt,
        title: `${Data[params.locale][book].name}, ${number}`
      }
    };
  } else {
    return {
      error: Vui[params.locale].numberTooHigh
    }
  }
}

module.exports = { list, describe, lookup };
