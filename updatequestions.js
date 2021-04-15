const Sequelize = require('sequelize');

const { questions } = require('./dbObjects');
const questionsDB = require('./databases/questionDirectory');

updateDB = async () => {
    const addQuestions = questionsDB.map( async q => {
        return questions.upsert(q)
    });
    await Promise.all(addQuestions);
    console.log("questions updated");
}

updateDB();