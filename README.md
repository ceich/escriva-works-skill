# escriva-works-skill
Alexa skill for the works of St. Josemaría Escrivá

On 2017-02-17,
Chris Eich contracted with Studium Foundation to make the published
[works of St. Josemaría Escrivá](http://escrivaworks.org)
available by voice by means of an Alexa skill.
Although the above site supports over 18 languages,
Alexa supported only English and German as of the contract date,
and so the contract covers only those two.

As of 2018-09-01, Alexa supports six languages;
- English (5 locales: AU, CA, GB, IN, US)
- French (FR locale)
- German
- Italian
- Japanese
- Spanish (2 locales: ES and MX)

All but Japanese are supported by the Escrivá Works site,
and could be added in the future.
The skill architecture makes additional language support as simple as possible.

The actual content of the works is not in this repository for copyright reasons,
but scripts to extract the content from the source (MySQL) to JSON are present
(see `dumper.js`).

## Intents

The skill supports the following custom intents:
- Lookup: read a passage by number (default next, else first) from a book
- Search: search for a term in a specified book (default all books)
- Rosary: read the meditation for one of the mysteries of the Holy Rosary
- Stations: read the meditation for one of the Stations of the Cross

as well as many of the built-in Alexa intents.

## Architecture

The layers in the skill are:
- VUI:
  * receiving intents
  * restoring state
  * handling non-custom and fallback intents
  * creating a query based on intent, slot values and state
  * transforming query responses for voice (e.g. IPA for Latin pronunciation)
  * saving state
  * returning responses
- Query:
  * extracting content from the works given a set of parameters,
returning an object with the following properties:
    - `result`:
      - a single passage
      - a list of search results
      - an empty set
    - `attributes`: a set of attributes for use by next request
    - `error`: an error message
 