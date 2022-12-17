const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Actor = sequelize.define("actor", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        age: {
            type: DataTypes.INTEGER
        },
        nationality: {
            type:DataTypes.STRING
        }
    })
    return Actor;
}