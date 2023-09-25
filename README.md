# What is it?
## Infrastracture
This project was done during and after discovery of Graph databases. As an example I used free, open-source graph database `Janus Graph`. However `Janus` does not provide ability to store data without additional `storage backends`. I've chosen `Cassandra` as `storage` for `Janus Graph`. Also it is possible to connect `External indexing backend`, so I've chosen `Elastic`.

## Run Database
All these thing can be run and configured using one simple command `docker-compose up`

## Code
In `src/Gremlin.ts` you can see a class that implements `ORM-pattern` that sould help developer to write his code without thinking too much about `Gremlin queries`. To test this class I created 2 more classes `User` and `Software`. I managed to easily create, list all, search by id, add relation and get all relations of these 2 models.
What's more I managed to save all the types by correct usage of `Typescript`.