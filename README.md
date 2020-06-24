# Welcome Bot for Slack

## Description

Full-stack application for Slack Bot control. The application contains Admin service and User service. Admin has a UI in which he can create messages that are available to Bot or the user. These messages can be connected to a certain date and time of day, linking it to a schedule, or to a certain trigger, linking them to an event, e.g. joining the chat, leaving the chat.
Users don’t have much control of the app, but they will be able to use triggers through certain commands (if Admin specifies it) to prompt bot to send a message.

## Installation
`npm install`

## Start

First step is to create a file called `.env` in root directory. Follow instructions in `envexample` to create its content. DB credentials will be provided on demand.

Run server with:
`npm run start`

or using nodemon for development run:
`npm run dev`

Development is running at http://localhost:5000 by default.

Routes:
`/api/messages`
`/api/schedules`
`/api/triggers`

Using postman you can test, e.g. messages:

- Get method for selecting:
  - all rows:
    `http://localhost:5000/api/messages`
  - one row:
    `http://localhost:5000/api/messages/MESSAGE_TITLE`

- Post method for inserting and editing
  - insert row:
    `http://localhost:5000/api/messages`
  - edit row:
    `http://localhost:5000/api/messages/MESSAGE_TITLE`
  - Post expecting JSON object:
    ```
    {
      "title": "sample_title",
      "text": "sample text",
      "cr_date": "0123456"
    }  
    ```
  - Edit also needs all three variables.

- Delete method:
    `http://localhost:5000/api/messages/MESSAGE_TITLE`

Reason it lacks data processing is because it will be done in front-end, before sending, to ease processing burden on back-end.


## Misc
Follow demonstration at [Link]{https://welcome-bot-slack.herokuapp.com/messages}
Connection to application might be slow since we've used free package from heroku.