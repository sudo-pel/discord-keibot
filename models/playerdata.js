module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        questionsCorrect: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        answeredToday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        currentlyAnswering: {
            type: DataTypes.STRING
        },
        streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        maxStreak: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        timestamps: false
    })
}