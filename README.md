# escriva-works-skill
Alexa skill for the works of St. Josemaría Escrivá

I have contracted with Studium Foundation to make the published [works of St. Josemaría Escrivá](http://escrivaworks.org)
available by voice with an Alexa skill.

Of the 18 languages on the above site, only English and German are supported by the Alexa Skills Kit as of 2018-03-04.
The skill architecture will endeavor to make additional language support as close to trivial as possible.

The actual content of the works is not committed to this repository for copyright reasons.

## Architecture

The layers in the skill are:
- VUI:
  * receiving intents
  * handling non-query intents
  * creating a query based on intent and slot values
  * transforming query responses for voice (e.g. IPA for Latin pronunciation)
  * returning responses
- Query:
  * extracting content from the works
 
 In the future the VUI layer may be split into Alexa-specific and generic layers, to add support for other VUIs.
