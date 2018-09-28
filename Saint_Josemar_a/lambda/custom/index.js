const Alexa = require('ask-sdk-core');
const { list, describe, lookup } = require('./query');
const Vui = require('./vui');

const CARD_TITLE = 'Saint Josemaría';

function slotValue(slots, slotName) {
  const slot = slots[slotName];
  if (!slot) return null;
  if (!slot.resolutions) return slot.value;
  const rpa = slot.resolutions.resolutionsPerAuthority[0];
  return ((rpa.status.code === "ER_SUCCESS_MATCH")
    ? rpa.values[0].value.id
    : slot.value);
}

function callQuery(handlerInput, query, params = {}) {
  params.locale = handlerInput.requestEnvelope.request.locale;
  const { result, attributes, error } = query(params);
  if (error) {
    return handlerInput.responseBuilder
      .speak(error)
      .withSimpleCard(CARD_TITLE, error)
      .getResponse();
  }
  handlerInput.attributesManager.setSessionAttributes(attributes);
  if (result.repromptText) {
    return handlerInput.responseBuilder
      .speak(result.speechText)
      .reprompt(result.repromptText)
      .withSimpleCard(result.title || CARD_TITLE, result.cardText || result.speechText)
      .getResponse();
  } {
    return handlerInput.responseBuilder
      .speak(result.speechText)
      .withSimpleCard(result.title || CARD_TITLE, result.cardText || result.speechText)
      .getResponse();
  }
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = Vui[handlerInput.requestEnvelope.request.locale].launchSpeech;
    const repromptText = Vui[handlerInput.requestEnvelope.request.locale].launchReprompt;
    const cardText = Vui[handlerInput.requestEnvelope.request.locale].launchCardText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard(CARD_TITLE, cardText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = Vui[handlerInput.requestEnvelope.request.locale].helpSpeech;
    const repromptText = Vui[handlerInput.requestEnvelope.request.locale].helpReprompt;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard(CARD_TITLE, speechText)
      .getResponse();
  }
};

const ListIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ListIntent';
  },
  handle(handlerInput) {
    return callQuery(handlerInput, list);
  }
};

const DescribeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === 'DescribeIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const params = { book: slotValue(slots, "Book") };
    return callQuery(handlerInput, describe, params);
  }
};

const LookupIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === 'LookupIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const params = {
      book: slotValue(slots, "Book"),
      number: slotValue(slots, "Number")
    };
    return callQuery(handlerInput, lookup, params);
  }
};

// 'SearchIntent': function () {
//     var book = this.event.request.intent.slots.Book.value;
//     var term = this.event.request.intent.slots.Term.value;
//     if (!book) {
//         book = "all books";
//     }
//     this.emit(':ask', `I heard you ask to search ${book} for ${term}.`);
// },
// 'RosaryIntent': function () {
//     var mystery = this.event.request.intent.slots.Mystery.value;
//     var ordinal = this.event.request.intent.slots.Ordinal.value;
//     if (mystery) {
//         if (ordinal) {
//             this.emit(':ask', `The ${ordinal} ${mystery} mystery.`);
//         } else {
//             this.emit(':ask', `The ${mystery} mysteries.`);
//         }
//     } else {
//         mystery = 'today\'s'; // todays_mystery();
//         if (ordinal) {
//             this.emit(':ask', `The ${ordinal} of ${mystery} mysteries.`);
//         } else {
//             this.emit(':ask', `${mystery} mysteries.`);
//         }
//     }
//     this.emit(':ask', 'This is the rosary intent');
// },
// 'StationsIntent': function () {
//     var ordinal = this.event.request.intent.slots.Ordinal.value;
//     if (ordinal) {
//         if (ordinal === '11st') {
//             ordinal = "11th"
//         } else if (ordinal === '13rd') {
//             ordinal = "13th"
//         }
//         this.emit(':ask', `You asked for the ${ordinal} station`);
//     } else {
//         this.emit(':ask', 'This is the stations intent');
//     }
// },

// 'AMAZON.NextIntent': function () {
//     this.emit(':tell', 'This is the next intent');
// },
// 'AMAZON.PauseIntent': function () {
//     this.emit(':tell', 'This is the pause intent');
// },
// 'AMAZON.PreviousIntent': function () {
//     this.emit(':tell', 'This is the previous intent');
// },
// 'AMAZON.RepeatIntent': function () {
//     this.emit(':tell', 'This is the repeat intent');
// },
// 'AMAZON.ResumeIntent': function () {
//     this.emit(':tell', 'This is the resume intent');
// },

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = Vui[handlerInput.requestEnvelope.request.locale].stopSpeech;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(CARD_TITLE, speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended request`);
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

// INTERCEPTORS

const NormalizeLocaleRequestInterceptor = {
  process(handlerInput) {
    // If locale is present, strip down to first two characters; default to 'en'
    const locale = handlerInput.requestEnvelope.request.locale;
    handlerInput.requestEnvelope.request.locale = locale ? locale.slice(0,2) : 'en';
  }
};

// Save persistent attributes
const PersistenceSavingResponseInterceptor = {
  process(handlerInput) {
    return new Promise((resolve, reject) => {
      handlerInput.attributesManager.savePersistentAttributes()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

// ERROR HANDLER

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const speechText = Vui[handlerInput.requestEnvelope.request.locale].errorSpeech;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(CARD_TITLE, speechText)
      .getResponse();
  },
};

const APP_ID = 'amzn1.ask.skill.2f60115f-43f3-4ce2-ada1-939ad85bfced';

let skill;

exports.handler = async function(event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .withSkillId(APP_ID)
      .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        ListIntentHandler,
        DescribeIntentHandler,
        LookupIntentHandler,
        // SearchIntentHandler,
        // RosaryIntentHandler,
        // StationsIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
      )
      .addRequestInterceptors(NormalizeLocaleRequestInterceptor)
      // .addResponseInterceptors(PersistenceSavingResponseInterceptor)
      .addErrorHandlers(ErrorHandler)
      .create();
  }
  
  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);
  
  return response;
};
