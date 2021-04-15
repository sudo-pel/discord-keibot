const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const questions = require('./models/questions')(sequelize, Sequelize.DataTypes);
const playerdata = require('./models/playerdata')(sequelize, Sequelize.DataTypes);
const parameters = require('./models/parameters')(sequelize, Sequelize.DataTypes);
const serversettings = require('./models/serversettings')(sequelize, Sequelize.DataTypes);

module.exports = { questions, playerdata, parameters, serversettings };