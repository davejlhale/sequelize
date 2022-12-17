const db = require("../models");

exports.updateMovie = async (string, args) => {
    console.log("update");
    const Movie = db.Movie;
    let results = {};
    try {
        //find the entry to update.
        let whereClause = buildObjFromString(string, "Movie")
        let isEmpty = Object.entries(whereClause).length === 0;
        if (isEmpty) throw "Full table update disabled"
        results = await Movie.findAll({
            where: whereClause
        });
        console.log(`Found ${results.length} objects matching query string to update`)

        let updateCount = 0;
        //map results and update
        results.map((movie) => {
            if (args.title) {
                movie.title = args.title;
            }
            if (args.actor) {
                movie.actor = args.actor;
            }
            if (args.director) {
                movie.director = args.director;
            }
            if (args.rating || args.rating === 0) {
                movie.rating = args.rating;
                console.log("rating,", args.rating)
            }
            console.log(`updated ${++updateCount} records`)
            movie.save();
            displayAsTable(results);
        })//end mapping update

    } catch (error) {
        console.error(error);
    }
}

const displayAsTable = (results) => {
    //data =  results[0].toJSON()
    data = JSON.parse(JSON.stringify(results));
    console.table(data);
}

const buildObjFromString = (argsString, table) => {
    let obj = {};
    try {
        console.log(`building filter Object from the string: "${argsString}"`)
        const dbModel = db[table];

        //get an array of all keys in our Movie schema
        const props = Object.keys(dbModel.getAttributes());

        //split the string at each ,  into key:values then split those inturn at the :
        let buildQueryFrom = argsString.split(/,(?=[^,]+:)/).map(s => s.split(':'));
        //map over the array of [ [key ,value] ... [key ,value]  ]
        buildQueryFrom.map((pair) => {
            //for each key in schema 
            props.map((key) => {
                //if pair[0] is a schema key 
                if (pair[0] === key) {
                    //add the key:value to our obj
                    obj[pair[0]] = pair[1]
                }
            })
        });
    } catch (e) {
        console.log("error forming where clause - using default")
        obj = {}
    }
    console.log("where clause ", obj)
    return obj;
}