const yargs = require("yargs");

const {
    readWhereMovie,
    updateMovie
} = require("./controllers/movieControler");

const {
    create,
    readAll,
    read,
    deleteEntry,
    updateActor
} = require("./controllers/actorControler");
const db = require("./models");
const handleYargsInput = async (args) => {

    //format yargs flags to match conditionals and database schema names
    let tableName = "";
    if (args.create) {
        tableName = args.create.charAt(0).toUpperCase() + args.create.slice(1).toLowerCase();
        console.log("table name", tableName)
    }
    if (args.readAll) {
        tableName = args.readAll.charAt(0).toUpperCase() + args.readAll.slice(1).toLowerCase();
        console.log("table name", tableName)
    }
    if (args.findAll) {
        tableName = args.findAll.charAt(0).toUpperCase() + args.findAll.slice(1).toLowerCase();
        console.log("table name", tableName)
    }
    if (args.delete) {
        tableName = args.delete.charAt(0).toUpperCase() + args.delete.slice(1).toLowerCase();
        console.log("table name", tableName)
    }
    if (args.read) {
        tableName = args.read.charAt(0).toUpperCase() + args.read.slice(1).toLowerCase();
        console.log("table name", tableName)
    }


    //open switch to format conditionals
    switch (true) {

        /*********
         *  --create actor --name --age --nationality
         */
        case args.create && args.create.toUpperCase() === "ACTOR":
            console.log("create actor");
            await create(tableName, {
                name: args.name,
                age: args.age,
                nationality: args.nationality

            })
            break;

        /*********
         *  --create movie --title --director --rating
         */
        case args.create && args.create.toUpperCase() === "MOVIE":
            console.log("create Movie");
            await create(tableName, {
                title: args.title,
                director: args.director,
                rating: args.rating
            })
            break;


        /****************************       
         * --readAll movie                                                             
         * --findAll movie
         * --readAll actor
         * --findAll actor
         * 
         * case conditional check done by determining if the flag value is "truthy" by conversion to boolean
         * 
         *****************************/
        case (!!args.readAll):
            await readAll(tableName);
            break;

        /*******
         *       --read movie --where "key:pair,key:pair"
         *       --read actor --where "key:pair,key:pair"
         * 
         *      if the --where format fails to build for the given <table> program defaults to 
         *      --read <table> where {}
         *      so allows users to also use the following as an alias to findAll or readAll
         *      --read <table>
         */
        case (!!args.read):
            await read(tableName, args.where)
            break;

        /*******
         * --delete movie --where "key:pair,key:pair"
         * --delete actor --where "key:pair,key:pair"
         */
        case (!!args.delete):
            await deleteEntry(tableName, args.where)
            break


        case (!!args.starredIn):
            try {
                //format yargs inputs as objects
                const whereActor = `name:${args.actor}`
                const whereMovie = `title:${args.movie}`
                if (!args.movie || !args.actor) throw "\nUse\n --starredIn --title <movie name> --actor <actor name>"
                //could use findOne call but....
                const actor_results = await read("Actor", whereActor)
                if (actor_results.length===0) throw `\t-could not find the actor ${args.actor}`

                const movie_results = await read("Movie", whereMovie)
                if (movie_results.length===0) throw `\t-could not find the movie ${args.movie}`
                // as name and title are set as unique we get only 1 result - index 0
                // add the film/actor to the m:m association table - ActorMovies 
                const as = await db.sequelize.models.ActorMovies.create(
                    {
                        movieId: movie_results[0].dataValues.id,
                        actorId: actor_results[0].dataValues.id
                    });
            } catch (e) {
                console.log(`error: associating actor: "${args.actor}" with movie:"${args.movie}"`)
                if ( !!e.parent) {console.table( e.parent.sqlMessage)}
                else {console.log(e)}
            }

            break;

        case (!!args.moviesWith):
            console.log("moviesWith")
            let actorResult = {};
            //find the actor by unique name
            try {
                actorResult = await db.sequelize.models.actor.findOne({
                    where: {
                        name: args.moviesWith
                        //joins the m:m associations 
                    }, include: db.sequelize.models.movie
                });
            } catch (e) { console.log(e) }

            let movies = [];
            try {
                //for every accosiated movie
                actorResult.movies.map((movie) => {
                    //push each found movies into an array to console.table
                    starred_in = JSON.parse(JSON.stringify(movie))
                    starred_in.actor = actorResult.name
                    movies.push(starred_in);
                })
                console.table(movies, ["actor", "title", "director", "rating"])
            } catch (e) {
                //if flag is true no name supplied
                if (args.moviesWith === true) {
                    console.log(`use \n --moviesWith "<actor name>"`)
                } else {
                    console.log(`Couldn't find any films featuring ${args.moviesWith}`)
                }
            }
            break;

        default:
            if (args.updateMovie) {
                await updateMovie(args.updateMovie, args);
            } else if (args.updateActor) {
                await updateActor(args.updateActor, args);
            } else { console.log("Command not supported") }
    }


};


const dummydata = async () => {
    await create("Movie", {
        title: "Mission Impossible III",
        director: "J.J.Abrams",
        rating: 3
    });
    await create("Movie", {
        title: "Star Trek Into Darkness",
        director: "J.J.Abrams",
        rating: 3
    });
    await create("Movie", {
        title: "Super 8",
        director: "J.J.Abrams",
        rating: 3
    });
    await create("Movie", {
        title: "Argo",
        director: "Ben Affleck",
        rating: 3
    });
    await create("Movie", {
        title: "Live by Night",
        director: "Ben Affleck",
        rating: 3
    });
    await create("Movie", {
        title: "The Town",
        director: "Ben Affleck",
        rating: 3
    });
    await create("Movie", {
        title: "Apache",
        director: "Robert Aldrich",
        rating: 3
    });
    await create("Movie", {
        title: "Rushmore",
        director: "Wes Anderson",
        rating: 3
    });
    await create("Movie", {
        title: "Trainspotting",
        director: "Danny Boyle",
        rating: 3
    });
    await create("Movie", {
        title: "The Beach",
        director: "Danny Boyle",
        rating: 3
    });


    await create("Actor", {
        name: "Robert Carlyle",
        nationality: "Scottish"
    });
    await create("Actor", {
        name: "Ewan McGregor",
        nationality: "Scottish"
    });
    await create("Actor", {
        name: "Jason Schwartzman",
        nationality: "American"
    });
    await create("Actor", {
        name: "Bill Murray",
        nationality: "American"
    });
    await create("Actor", {
        name: "Luke Wilson",
        nationality: "American"
    });
    await create("Actor", {
        name: "Burt Lancaster",
        nationality: "American"
    });
    await create("Actor", {
        name: "Charles Bronson",
        nationality: "American"
    });
    await create("Actor", {
        name: "Ben Affleck",
        nationality: "American"
    });
    await create("Actor", {
        name: "Titus Welliver",
        nationality: "American"
    });
    await create("Actor", {
        name: "Greg Grunberg",
        nationality: "American"
    });
    await create("Actor", {
        name: "Tony Guma",
        nationality: "American"
    });
    await create("Actor", {
        name: "Jeff Chase",
    });
    await create("Actor", {
        name: "Simon Pegg",
        nationality: "English"
    });
}
setTimeout(() => {
    // dummydata();
}, 1000);
setTimeout(() => {

    handleYargsInput(yargs.argv);
}, 1500);
