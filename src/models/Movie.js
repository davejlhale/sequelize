const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define("movie", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        director: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "not specified"
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0,

        }

    })
    return Movie;
}