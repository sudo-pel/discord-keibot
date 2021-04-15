const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const questionsDirectory = require('./databases/questionDirectory');

const questions = require('./models/questions')(sequelize, Sequelize.DataTypes);
const serversettings = require('./models/serversettings')(sequelize, Sequelize.DataTypes);
require('./models/playerdata')(sequelize, Sequelize.DataTypes);
const parameters =require('./models/parameters')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then( async () => {

    questions.hasMany(serversettings, {
        foreignKey: "currentQuestion"
    })
    questions.hasMany(parameters, {
        foreignKey: "qotdID"
    })

    const addQuestions = questionsDirectory.map( q => {
        return questions.upsert(q)
    });
    await Promise.all(addQuestions);
    console.log("Database synced");
    sequelize.close();
}).catch(console.error);