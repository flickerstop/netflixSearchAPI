## What are these?

These files are modules that I've created to help with my personal projects. All of these files are used to simplify some common method calls across different tools and frameworks. I've slowly built them up to do exactly what I need.

## Why are they here?

I typically have them in their own private project then use `npm link` to access them but opted to import them into this project so it can be used without issue.

## How do they work?
### jrConsole
This is a module that improves upon the standard `console` and adds some nice formatting options for easier debugging.

### jrCSV
Used to convert a CSV file into an array of JSON objects.

### jrMongo
Contains a bunch of useful functions that return promises to interact with MongoDB 