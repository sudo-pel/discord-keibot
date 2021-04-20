module.exports = (sequelize, DataTypes) => {
    return sequelize.define('parameters', {
        guild: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            unique: true,
            allowNull: false
        },
        qotdID: {
            type: DataTypes.STRING
        },
        answered: {
            type: DataTypes.STRING
        },
        channel: {
            type: DataTypes.STRING
        }
    })
}