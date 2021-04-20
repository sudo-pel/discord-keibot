module.exports = (sequelize, dataTypes) => {
    return sequelize.define('serverSettings', {
        id: {
            type: dataTypes.STRING,
            primaryKey: true,
            unqiue: true,
        },
        questionChannel: {
            type: dataTypes.STRING,
        },
        currentQuestion: {
            type: dataTypes.STRING
        },
        status: {
            type: dataTypes.STRING,
            defaultValue: 'on',
            allowNull: false
        }
    })
}