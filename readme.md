# Netflix simple API
This is based on the data provided by [kaggle datasets](https://www.kaggle.com/datasets/victorsoeiro/netflix-tv-shows-and-movies). Both GET and POST are supported for different features. This created using Node.js with Express.js for hosting and MongoDB for the database.

### Install
```
npm install
```
Also requires MongoDB running on localhost on port 27017 but that can be changed in `src/modules/databaseManager.js`.

### Run the app
```
npm start
```

### Run the tests
```
npm test
```


# REST API
The REST API can be access two ways. The first is by GET which is much simpler but does not allow filtering by multiple properties. The second is POST which allows filtering.

# GET


## Find a Show/Movie

#### Request

##### By title
```
/NetflixAPI/titles/byTitle/title_of_show_or_movie
```

##### By credits
```
/NetflixAPI/titles/byCredit/actor_or_director_name
```
#### Response
```
[{
    id,
    title,
    type,
    description,
    release_year,
    age_certification,
    runetime,
    genres[],
    production_countries[],
    seasons,
    imdb_id,
    imdb_score,
    imdb_votes,
    tmdb_popularity,
    tmdb_score
}]
```

## Find all credited actors/directors

#### Request

##### By title
```
/NetflixAPI/credits/byTitle/title_of_show_or_movie
```

##### By credits
```
/NetflixAPI/credits/byCredit/actor_or_director_name
```
#### Response
```
[{
    person_id,
    id,
    name,
    character,
    role
}]
```
