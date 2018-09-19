const Alexa = require('aws-sdk-core');
const Query = require('./query');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requstEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Saint Hozay Maria skill';
    const repromptText = `You can search for a word in any or all books,
      look up a passage by number,
      or ask for the rosary
      or the way of the cross`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard('Saint Josemaría', speechText)
      .getResponse();
  },
};
    // 'SearchIntent': function () {
    //     var book = this.event.request.intent.slots.Book.value;
    //     var term = this.event.request.intent.slots.Term.value;
    //     if (!book) {
    //         book = "all books";
    //     }
    //     this.emit(':ask', `I heard you ask to search ${book} for ${term}.`);
    // },
const LookupIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest";
  }
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const params = { locale: request.locale };
    const slots = request.intent.slots;
    params.book = slots.Book.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    params.number = +slots.Number.value;
    const result = Query.lookup(params).result;
    return handlerInput.responseBuilder
      .speak(result.speechText)
      .reprompt(result.repromptText)
      .withSimpleCard('Saint Josemaría', result.speechText)
      .getResponse();
  }
};
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
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'This is the cancel intent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'This is the help intent', 'What would you like to ask?');
    },
    'AMAZON.NextIntent': function () {
        this.emit(':tell', 'This is the next intent');
    },
    'AMAZON.PauseIntent': function () {
        this.emit(':tell', 'This is the pause intent');
    },
    'AMAZON.PreviousIntent': function () {
        this.emit(':tell', 'This is the previous intent');
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':tell', 'This is the repeat intent');
    },
    'AMAZON.ResumeIntent': function () {
        this.emit(':tell', 'This is the resume intent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'This is the stop intent');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended request`);
    }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const APP_ID = 'amzn1.ask.skill.2f60115f-43f3-4ce2-ada1-939ad85bfced';

let skill;

exports.handler = async function(event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom() // = APP_ID;
      .addRequestHandlers(
        LaunchRequestHandler,
        LookupIntentHandler //,
        // SearchIntentHandler,
        // RosaryIntentHandler,
        // StationsIntentHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }
  
  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);
  
  return response;
};
