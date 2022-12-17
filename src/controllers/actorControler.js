const db = require("../models");


exports.create = async (table, dataObj) => {
    table = table.charAt(0).toUpperCase() + table.slice(1);
    const dbModel = db[table];
    try {
        const results = await dbModel.create(dataObj);
    } catch (error) {
        console.error(error);
    }
};

exports.readAll = async (table) => {
    console.log("readAll", table);
    table = table.charAt(0).toUpperCase() + table.slice(1);
    const dbModel = db[table];
    let results = {};
    try {
        results = await dbModel.findAll();
        displayAsTable(results);
    } catch (error) {
        console.error(error);
    }
    return results;
};

exports.read = async (table, queryString) => {
    const dbModel = db[table];
    console.log("read");
    let results = {};
    try {
        let whereClause = buildObjFromString(queryString, table)
        results = await dbModel.findAll({
            where: whereClause
        });
        if (results.length > 0)
            displayAsTable(results);
    } catch (error) {
        console.error(error);
    }
    return results;
};

exports.deleteEntry = async (table, queryString) => {
    const dbModel = db[table];
    console.log("delete");
    let results = {};
    try {
        let whereClause = buildObjFromString(queryString, table)
        results = await dbModel.destroy({
            where: whereClause
        });
        console.debug(`${table} table is now`)
        this.readAll(table);
    } catch (error) {

    }
}

exports.updateActor = async (string, args) => {
    console.log("update");
    const Actor = db.Actor;
    let results = {};
    try {
        //find the entry to update.
        let whereClause = buildObjFromString(string)
        results = await Actor.findAll({
            where: whereClause
        });

        console.log(`Found ${results.length} objects matching query string to update`)

        let updateCount = 0;
        //map results and update
        results.map((actor) => {
            if (args.name) {
                actor.name = args.name;
            }
            if (args.age) {
                actor.age = args.age;
            }
            if (args.nationality) {
                actor.nationality = args.nationality;
            }

            console.log(`updated ${++updateCount} records`)
            actor.save();
            displayAsTable(results)
        })//end mapping update


    } catch (error) {
        console.error(error);
    }
}

const displayAsTable = (results) => {
    data = JSON.parse(JSON.stringify(results));
    console.table(data);
}

const buildObjFromString = (argsString, table) => {
    let obj = {};
    try {
        const dbModel = db[table];
        console.debug(`building where clause from the string: "${argsString}" for table ${table}`)

        //get an array of all keys in our Actor schema
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
    console.log("where  ", obj)
    return obj;
}