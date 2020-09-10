#### DEVELOPER Notes

The implemantation is build on top feathersJs(help me with the base structure) as the framework of node 
its `REQUIRE` to use `node v14.10.0` due to the use of dns promises.

For the architecture I choose microservices for the workers that have REST API'S that communicate to each of the external APIs
    - To Run we need to run all 4 microservices under `Workers` and the main service
        -`npm run dev`
    - Unit testing only implemented on one project as proof knowledge but due to time restraints
        - `npm run test` //only for main Service
    - ES Lint and some custome rules where included

Main service and individual sub calls are defined on the `./Postman collection` to help testing and developing