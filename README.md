# Welcome Bot for Slack

## Description

Full-stack application for Slack Bot control. The application contains Admin service and User service. Admin has a UI in which he can create messages that are available to Bot or the user. These messages can be connected to a certain date and time of day, linking it to a schedule, or to a certain trigger, linking them to an event, e.g. joining the chat, leaving the chat.
Users don’t have much control of the app, but they will be able to use triggers through certain commands (if Admin specifies it) to prompt bot to send a message.

## Installation
`npm install`

## Start

First step is to create a file called `.env` in root directory. Follow instructions in `.env.example` to create its content.

Run server with:
`npm run start`

or using nodemon:
`npm run dev`

## Misc
Follow demonstration at [Link]{https://welcome-bot-slack.herokuapp.com/}
Connection to application might be slow since we've used free package from heroku.