require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_URI,{ logging: false});
const db = {};

sequelize.authenticate()
    .then(() => {
        console.log('connected..')
        db.sequelize = sequelize;
        db.Sequelize = Sequelize;
        
        db.Actor = require("./Actor")(sequelize, DataTypes)
        db.Movie = require("./Movie")(sequelize, DataTypes)

        db.Movie .belongsToMany(db.Actor, { through: 'ActorMovies' });
        db.Actor.belongsToMany(db.Movie , { through: 'ActorMovies' });

        sequelize.sync().then(() => { console.log("re-sync done") });
    //    { force: true }
         
    })
    .catch(err => {
        console.log('Error' + err)
    })

module.exports = db;