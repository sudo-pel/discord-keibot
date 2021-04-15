const Keyv = require('keyv');

const parameters = new Keyv();

Promise.all(
    [parameters.set('questionID', 'nil'),
    parameters.set('questionsChannel', 'nil')]
).then(
    args => { console.log("parameter init complete") }
).catch(console.error);

const setQuestionID = function(ID) {
    return parameters.set('questionID', ID)
};

const getQuestionID = function() {
    parameters.get('questionID')
    .then(ID => { return ID })
    .catch(console.error)
}

const getQuestionsChannel = function() {
    parameters.get('getQuestionsChannel')
    .then(channel => { return channel } )
    .catch(console.error)
}

const setQuestionsChannel = function(channel) {
    return parameters.set('questionsChannel', channel)
}

module.exports = { setQuestionID, getQuestionID, setQuestionsChannel, getQuestionsChannel }