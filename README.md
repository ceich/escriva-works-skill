# escriva-works-skill
Alexa skill for the works of St. Josemaría Escrivá

I have contracted with Studium Foundation to make the published [works of St. Josemaría Escrivá](http://escrivaworks.org)
available by voice with an Alexa skill.

Of the 18 languages on the above site, only English and German are supported by the Alexa Skills Kit as of 2018-03-04.
The skill architecture will endeavor to make additional language support as close to trivial as possible.

The actual content of the works is not committed to this repository for copyright reasons.

## Intents

The skill supports the following custom intents:
- Lookup: read a passage by number (default next, else first) from a book
- Search: search for a term in a specified book (default all books)
- Rosary: read the meditation for one of the mysteries of one part of the Holy Rosary
- Stations: read the meditation for one of the Stations of the Cross

## Architecture

The layers in the skill are:
- VUI:
  * receiving intents
  * restoring state
  * handling non-query intents
  * creating a query based on intent, slot values and state
  * transforming query responses for voice (e.g. IPA for Latin pronunciation)
  * saving state
  * returning responses
- Query:
  * extracting content from the works given a set of parameters, either:
    - a single passage
    - a list of search results
 
 In the future the VUI layer may be split into Alexa-specific and generic layers, to add support for other VUIs.
