// copyright (c) 2018 Chris Eich
//
// Query interface to works of St. Josemaría Escrivá
//

// keyed by locale
var Data = require('./data');
var Vui = require('./vui');

// These keys must match the values of the "values[i].id" key 
// in the speech model's BOOK type definition (locale-independent).
var Works = {
  "WAY": "1",
  "FURROW": "2",
  "FORGE": "3",
  "FRIENDS_GOD": "4",
  "CHRIST_PASSING": "5",
  "LOVE_CHURCH": "6",
  "ROSARY": "7",
  "STATIONS_CROSS": "8",
  "CONVERSATIONS": "9",
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
      error: Vui[params.locale].bookNotFound
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
      error: Vui[params.locale].numberNotFound
    }
  }
}

module.exports = { list, describe, lookup };
