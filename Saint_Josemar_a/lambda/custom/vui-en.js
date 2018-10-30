// copyright (c) 2018 Chris Eich
//
// VUI phrases for works of St. Josemaría Escrivá
//

module.exports = {
  launchSpeech: 'Welcome to the Saint Josemaría skill!',
  launchReprompt: `You can list the books, get a description of a book,
    or look up a point in any book by number.`,
  launchCardText: 'Welcome to the Saint Josemaría skill!',
  
  helpSpeech: 'Try asking, "Read Furrow number three hundred one."',
  helpReprompt: 'You can also say, "List the books," or, "Describe holy rosary."',

  errorSpeech: 'Sorry, I can\'t understand that command. Please try again.',
  stopSpeech: 'Goodbye!',

  listReprompt: 'You can read any book from the beginning, or look up a point by number in a book',

  readReprompt: 'You can read this book or describe another one.',

  lookupReprompt: 'You can ask to look up another point.',

  bookIsRequired: 'The "book" parameter is required.',
  bookNotFound: 'I could not find that book; try asking for a list of the books.',
  numberNotFound: 'There is no point with that number; try another one.',
};
