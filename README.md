# Backend Developer Exercise

## Introduction

- your task is to implement a simple single-user blogging engine in Node.js or Ruby on Rails
- you don't have to complete all subtasks, just do what you have the time and skills for
- the goal here is not just to see if you can do an app, but how you do it. So please write it as if it were a big production app, that includes code structure, validations, usage of git, documentation, tests, linting, etc.
- we realize that some subtasks can be very time consuming, if you just don't have the time, you can write short text description of how would you solve the problem
- on the flip side, you can improve on many things, if you have the time. For example, we don't need you to implement user registration, but you are free to do so
- feel free to use this exercise (including the instruction) for evaluation by other companies

## Technologies

### Common

- we use Docker for containerization, Swagger/OpenAPI for API documentation

### Node.js

- we prefer Restify or Nest.js, Apollo Server, PostgreSQL, TypeORM or Sequelize, Jest and of course TypeScript
- but if you know other technologies and don't want to learn/use any of our favorites, feel free to do so

### Ruby on Rails

- we prefer PostgreSQL and RSpec
- but if you know other technologies and don't want to learn/use any of our favorites, feel free to do so
- bonus points for Sorbet types

## The Exercise

- design the API yourself and document it
    - ideally, create both REST and GraphQL
    - document the API - REST in Swagger, GraphQL with documentation comments in schema
    - write Swagger yourself or generate it, you can expose it as an endpoint
    - for GraphQL, expose GraphiQL or GraphQL Playground
- dockerize your app
    - create a Dockerfile for your app
    - create a docker-compose file that can be used to run your app with all dependencies
- implement login
    - the user should just need a password to login
    - seed the database with user data
- create simple CRUD for blog posts (articles)
    - each article should have title, perex and content
    - each article should also have a unique generated id
    - each article should also have a timestamp
- add the possibility to add comments to articles
    - a comment should have an author (just a string) and content
    - each comment should also have a timestamp
    - comments are flat, with relation only to article
        - nested comments are for bonus points
- add the possibility to vote on comments (Reddit-style + and -)
    - votes should identified by IP address and unique
- add the option to make commenting and voting realtime
    - via GraphQL Subscriptions or WebSockets
- present your ability to test the code
    - You don't have to test everything, add at least some unit tests
    - Optionally also include some integration and e2e tests