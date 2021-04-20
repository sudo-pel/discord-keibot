module.exports = (sequelize, DataTypes) => {
    return sequelize.define('questions', {
        title: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            unique: true,
        },
        answer: {
            type: DataTypes.STRING,
        },
        baseReward: {
            type: DataTypes.INTEGER,
            defaultValue: 500
        },
        diagram: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    })
}