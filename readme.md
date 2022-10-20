# Netflix simple API
This is based on the data provided by [kaggle datasets](https://www.kaggle.com/datasets/victorsoeiro/netflix-tv-shows-and-movies). Both GET and POST are supported for different features. This created using Node.js with Express.js for hosting and MongoDB for the database.

### Install
```
npm install
```
Also requires MongoDB running on localhost on port 27017 but that can be changed in `src/modules/databaseManager.js` line 25.

### Run the Server
```
npm start
```

### Run the tests
Runs 25 GET/POST tests and evaluates the responses to make sure they have correct values.
```
npm test
```


# REST API
The REST API can be access two ways. The first is by GET which is much simpler but does not allow filtering by multiple properties, these also require exact matches on titles and actor names. The second is POST which allows filtering and searches.

# GET


## Find a Show/Movie

#### Request

##### By title
```
/NetflixAPI/titles/byTitle/title_of_show_or_movie
```

##### By Actor
```
/NetflixAPI/titles/byActor/actor_name
```
#### Response
```
[{
    id: The title ID on JustWatch
    title: The name of the show/movie
    type: Either "MOVIE" or "SHOW"
    description: A brief description
    release_year: The release year
    age_certification: The age certification
    runtime: The length of the episode (SHOW) or movie
    genres[]: A list of genres
    production_countries[]: A list of countries that produced the title
    seasons: Number of seasons if it's a SHOW
    imdb_id: The title ID on IMDB
    imdb_score: Score on IMDB
    imdb_votes: Votes on IMDB
    tmdb_popularity: Popularity on TMDB
    tmdb_score: Score on TMDB
}]
```

## Find all credited actors/directors

#### Request

##### By title
```
/NetflixAPI/credits/byTitle/title_of_show_or_movie
```

#### Response
```
[{
    person_id: The person ID on JustWatch.
    id: The title ID on JustWatch.
    name: The actor or director's name.
    character: The character name.
    role: ACTOR or DIRECTOR.
}]
```

# POST
POST allows the ability to filter using JSON in the content. Each property is optional
### Filters
| Property            | Type                    | Description                                                     | Example                        |
|---------------------|-------------------------|-----------------------------------------------------------------|--------------------------------|
| `isExactMatch`      | Boolean                 | Should this search only allow exact matches. Defaults to false. | `{isExactMatch: true}`         |
| `title`             | String                  | Only show titles that include or exactly match this title.      | `{title: "Breaking Bad"}`      |
| `type`              | String                  | Either "SHOW" or "MOVIE".                                       | `{type: "SHOW"}`               |
| `release_year`      | String \| Number        | Released in this year.                                          | `{release_year: 1970}`         |
| `age_certification` | String                  | Must be this age certification.                                 | `{age_certification: "R"}`     |
| `genres`            | String \| Array<String> | Titles with these genres.                                       | `{genres: ["drama","crime"]}`  |
| `credits`           | String                  | This person must be credited.                                   | `{credits: "Spike Lee"}`       |
| `actor`             | String                  | This person must be an actor.                                   | `{actor: "Bryan Cranston"}`    |
| `director`          | String                  | This person must be a director.                                 | `{director: "John Carpenter"}` |

## Search for titles
#### Request
```
/NetflixAPI/titles
```
#### Response
```
[{
    id: The title ID on JustWatch
    title: The name of the show/movie
    type: Either "MOVIE" or "SHOW"
    description: A brief description
    release_year: The release year
    age_certification: The age certification
    runtime: The length of the episode (SHOW) or movie
    genres[]: A list of genres
    production_countries[]: A list of countries that produced the title
    seasons: Number of seasons if it's a SHOW
    imdb_id: The title ID on IMDB
    imdb_score: Score on IMDB
    imdb_votes: Votes on IMDB
    tmdb_popularity: Popularity on TMDB
    tmdb_score: Score on TMDB
}]
```


## Search for credits
#### Request
```
/NetflixAPI/credits
```
#### Response
```
[{
    person_id: The person ID on JustWatch.
    id: The title ID on JustWatch.
    name: The actor or director's name.
    character: The character name.
    role: ACTOR or DIRECTOR.
}]
```