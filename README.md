# Sequelize, nodejs, mysql , yargs

command line use  

node src/app.js --flags "values"

--flags
<...> user defined surround with "" if word breaks


### create table entries

```
--create movie --title <title> --director <director> --rating <int>
--create actor --name <name> --age <int> --nationality <nationality>
```
(--title and --name required others optional)

eg
```
--create movie --title ET --director "S.Spielburg" --rating 9
--create movie --title Jaws --director "S.Spielburg" 
```
  
  
  ### reading a full table
  
  ```
  --readAll actor
  --readAll movie
  --read actor
  --read movie
  ```
  
  ### read table with a query/where clause
  
  ```
  --read actor --where "query string"
  --read movie --where "query string"
  ```
  the query string needs to be surrouned by ""
  the string is a ```key:value``` chain matching table keys
  eg
  ```
  --read actor --where "name:Ben Affleck"
  --read movie --where "rating:3"
  --read movie --where "rating:3,director:Ben Affleck"
  --read actor --where "nationality:english,age:32"
  ```
** n.b. if the where clause forms incorrectly it will default to where {} and thus act as an alias to --readALL**

### deleting entries

```
--delete  movie --where "title:Argo" 
--delete  actor --where "age:32" 
--delete  movie --where "director:J.J.Abrams,rating:3"
```


### updating entries

n.b. 
  --where flag currently not used as each table has its own update flag
  
```
--updateMovie "title:The Beach" --rating 4
--updateActor "name:Charles Bronson" --age 81
--updateMovie  "rating:3,director:Danny Boyle" --rating 4
```

### add actor - movie association

```
--starredIn --actor <name> --movie <name>
```

### display associations

```
--moviesWith "Ben Affleck"
```

