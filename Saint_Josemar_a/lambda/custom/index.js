var Alexa = require('alexa-sdk');

var APP_ID = 'amzn1.ask.skill.2f60115f-43f3-4ce2-ada1-939ad85bfced';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'This is the launch request',
            'You can search for a word in any or all books, look up a passage by number, or ask for the rosary or way of the cross');
    },
    'SearchIntent': function () {
        var book = this.event.request.intent.slots.Book.value;
        var term = this.event.request.intent.slots.Term.value;
        if (!book) {
            book = "all books";
        }
        this.emit(':ask', `I heard you ask to search ${book} for ${term}.`);
    },
    'LookupIntent': function () {
        var slots = this.event.request.intent.slots;
        var book = slots.Book.value;
        var number = slots.Number.value;
        if (number) {
            this.emit(':ask', `I heard you ask to look up number ${number} in ${book}.`);
        } else {
            this.emit(':ask', `I heard you ask to read from ${book}.`);
        }
    },
    'RosaryIntent': function () {
        var mystery = this.event.request.intent.slots.Mystery.value;
        var ordinal = this.event.request.intent.slots.Ordinal.value;
        if (mystery) {
            if (ordinal) {
                this.emit(':ask', `The ${ordinal} ${mystery} mystery.`);
            } else {
                this.emit(':ask', `The ${mystery} mysteries.`);
            }
        } else {
            mystery = 'today\'s'; // todays_mystery();
            if (ordinal) {
                this.emit(':ask', `The ${ordinal} of ${mystery} mysteries.`);
            } else {
                this.emit(':ask', `${mystery} mysteries.`);
            }
        }
        this.emit(':ask', 'This is the rosary intent');
    },
    'StationsIntent': function () {
        var ordinal = this.event.request.intent.slots.Ordinal.value;
        if (ordinal) {
            if (ordinal === '11st') {
                ordinal = "11th"
            } else if (ordinal === '13rd') {
                ordinal = "13th"
            }
            this.emit(':ask', `You asked for the ${ordinal} station`);
        } else {
            this.emit(':ask', 'This is the stations intent');
        }
    },
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
