05/25/22 - date sorting and limiting is working - see last source below - trying to fix date format in output

05/24/22 - look at felavid's comments on Exercise Tracker - he seems to have figured it out

05/12/22 - check if "from" and "to" are correct string types? - look at "Mongoose greater than and equal" below

05/11/22 - it is passing all tests but the "from" and "to" in the date still don't work correctly - need to resolve how to fix
-things to do - 1. keep "from" and "to" from query as a string - make it match database format
- 2. compare date string vs. date string for "from" and "to"
  3. Use MongoDB aggregate if necessary

04/25/22 - limit is working correctly.  Now need to fix the "date" issue with "from" and "to" - then it should pass all tests

04/07/22 - the "username" object is what is causing problems.  A find on "description" works fine.  Need to see what is causing the problem and possibly reformat the Schema to accomodate a different "username" - in MongoDB it is an "Object"

03/04/22 - still working on getting log - look at Ayobami project for how he got the log data populated

02/15/22 - log search still not working - do search for objectId and mongoose

02/14/22 - log endpoint is not doing correct search for username field; need to figure out how to pull exercise records by username

02/04/22 - post to exercise is working correctly and giving correct response; now need to get log created and working with limit, etc.

02/03/22 - username is correctly populating in post/exercise response; now need to get date function to work properly; it is creating a new date but is not using a date if you give it one to start with (every date output is today) - it's only going through the first part of the if statement (not the else) - this is resolved 02/04/22

01/30/22 - look into fixing date; exercise is otherwise posting

# To-Do:

## Steps to complete project:

Sources:
- https://github.com/OsakaStarbux/exercise-tracker
- https://replit.com/@hermanceaser/boilerplate-project-exercisetracker
- https://forum.freecodecamp.org/t/im-stuck-on-exercise-tracker/481643
- https://replit.com/@shugyoza/boilerplate-project-exercisetracker // excellent notes with references
- https://replit.com/@candrepa1/boilerplate-project-exercisetracker
- https://replit.com/@sssmsm/boilerplate-project-exercisetracker
- https://replit.com/@AyobamiMichael/boilerplate-project-exercisetracker-1#server.js
- https://mongoosejs.com/docs/queries.html
- https://www.reddit.com/r/node/comments/imh5gq/what_is_the_benefit_of_chaining_exec_function_in/
- https://dev.to/itz_giddy/how-to-query-documents-in-mongodb-that-fall-within-a-specified-date-range-using-mongoose-and-node-524a
- https://stackoverflow.com/questions/26814456/how-to-get-all-the-values-that-contains-part-of-a-string-using-mongoose-find
- https://stackoverflow.com/questions/33499125/in-mongodb-how-to-get-10-documents-with-id-lesser-than-100-but-not-from-1-to-10
- https://stackoverflow.com/questions/17039018/how-to-use-a-variable-as-a-field-name-in-mongodb-native-findone
- https://stackoverflow.com/questions/50043003/mongoose-greater-than-and-equal
- https://stackoverflow.com/questions/56371728/javascript-filter-nested-objects-and-arrays
- https://stackoverflow.com/questions/56895203/how-to-format-a-date-that-is-a-value-in-an-array-of-objects
- https://replit.com/@Eidan78/boilerplate-project-exercisetracker#server.js
- https://github.com/gyataro/Freecodecamp-Projects/blob/master/5.%20Apis%20%26%20Microservices/Exercise%20Tracker%20REST%20API/server.js
- https://replit.com/@AlisterXavier/boilerplate-project-exercisetracker#server.js

1. ~~Setup database connection~~
    1. ~~setup secrets file and process.env variables~~
    2. ~~setup mongoose connection~~
    3. ~~setup test API endpoint~~
    4. ~~setup user schema~~
    5. ~~setup exercise schema~~
2. ~~Setup new user `POST`~~
    1. ~~setup route~~
        1. ~~post to `/api/users` with form data `username`~~
    2. ~~setup control function~~
        1. ~~Convert form data to readable text for search and saving record - N/A~~
        2. ~~Search current database to make sure user is not a duplicate - if so throw error~~
        3. ~~If not a duplicate - save new record and have JSON response below~~
    3. ~~response (a JSON object) should include~~
        1. ~~username: "fcc-test"~~
        2. ~~_id: "jklsdmfslkm"~~
3. ~~Setup user list `GET`~~
    1. ~~setup route~~
        1. ~~`GET` request to `/api/users` to return a list of all users~~
            1. ~~same `GET` request returns an array~~
                1. ~~each element in the array returns an object literal containing a user's `username` and `_id`~~
                2. ~~To do this the array will need to be started as empty and then iterate over the array as you go through the collection from the database~~
4. ~~Setup exercise `POST`~~
    1. ~~setup route~~
        1. ~~`POST` to `/api/users/:_id/exercise` with form data `description`, `duration`, and optionally `date`.~~
            1. ~~if no date given the current date is used~~
            2. ~~the response from the same `POST` will be the user object with exercise fields added~~
    2. ~~setup control function~~
    3. ~~response should include~~
        1. ~~username: "fcc-test"~~
        2. ~~description: "test"~~
        3. ~~duration: 60 (number?)~~
        4. ~~date: "Mon Jan 01 1990" - use "toDateString" property method of the Date API~~
        5. ~~id: "jlkmernklsd"~~
5. Setup log `GET`
    1. setup route
        1. Route is `/api/users/:_id/logs` - get full exercise log of any user
    2. setup control function
        1. First - return full exercise list of users
        2. Second - establish count of exercises of users (count variable)
        3. Third - set up if/else statements for to / from
        4. Fourth - set up if/else statement for limit - to limit results at end
    3. response should include
        1. username: "fcc-test"
        2. count: 1 - this is the number of exercises that belong to that user
        3. id: "mkmerlkgm"
        4. log (which should include): (this is an array of each exercise)
            1. description: "test" - should be a string
            2. duration: 60 - should be a number
            3. date: "Mon Jan 01 1990" 
                1. use "toDateString" property method of the Date API
                2. should be a string
        5. you can add `from`, `to`, and `limit` parameters to a `GET` to `/api/users/:_id/logs` request to retrieve part of the log of any user
            1. `from` and `to` are dates in `yyyy-mm-dd` format
            2. `limit` is an integer of how many logs to send back


  ~~strikethrough~~

  **bold text**

  *italicized text*

  > blockquote

  - unordered list
  
  `code`

  ### h3 heading

  
