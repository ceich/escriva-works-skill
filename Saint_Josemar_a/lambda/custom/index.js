const Alexa = require('ask-sdk-core');
const Query = require('./query');
const Vui = require('./vui');

const CARD_TITLE = 'Saint Josemaría';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = Vui[handlerInput.requestEnvelope.request.locale].launchSpeech;
    const repromptText = Vui[handlerInput.requestEnvelope.request.locale].launchReprompt;
    const cardText = Vui[handlerInput.requestEnvelope.request.locale].cardText;

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
    const speechText = 'This is the help intent';
    const repromptText = 'What would you like to ask?';

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
    const request = handlerInput.requestEnvelope.request;
    const params = { locale: request.locale };
    const result = Query.list(params).result;

    return handlerInput.responseBuilder
      .speak(result.speechText)
      .reprompt(result.repromptText)
      .withSimpleCard(CARD_TITLE, result.speechText)
      .getResponse();
  }
};

const DescribeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === 'DescribeIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const params = { locale: request.locale };
    const slots = request.intent.slots;
    params.book = slots.Book.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    const result = Query.describe(params).result;
    return handlerInput.responseBuilder
      .speak(result.speechText)
      .reprompt(result.repromptText)
      .withSimpleCard(result.book, result.speechText)
      .getResponse();
  }
};

const LookupIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === 'LookupIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const params = { locale: request.locale };
    const slots = request.intent.slots;
    params.book = slots.Book.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    params.number = slots.Number.value;
    const { result, error } = Query.lookup(params);
    if (error) {
      return handlerInput.responseBuilder
        .speak(error)
        .withSimpleCard(CARD_TITLE, error)
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(result.speechText)
        .reprompt(result.repromptText)
        .withSimpleCard(`${result.book}, ${result.number}`, result.speechText)
        .getResponse();
    }
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
    const speechText = 'Goodbye!';

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

// If locale is present, strip down to first two characters; default to 'en'
const NormalizeLocaleRequestInterceptor = {
  process(handlerInput) {
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
    const speechText = 'Sorry, I can\'t understand the command. Please say again.';

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
