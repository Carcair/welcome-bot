# Welcome Bot for Slack

## Description

Full-stack application for Slack Bot control. The application contains Admin service and User service. Admin has a UI in which he can create messages that are available to Bot or the user. These messages can be connected to a certain date and time of day, linking it to a schedule, or to a certain trigger, linking them to an event, e.g. joining the chat, leaving the chat.
Users don’t have much control of the app, but they will be able to use triggers through certain commands (if Admin specifies it) to prompt bot to send a message.

## Installation

`npm install`

## Start

To access config data, you need transcrypt data.

Run server with:
`npm run start`

or using nodemon for development run:
`npm run dev`

Development is running at http://localhost:5000 by default.

API endpoints (token verification needed):

- Login:
  - `http://localhost:5000/login`
- Messages:
  - `http://localhost:5000/api/messages`
- Schedules:
  - `http://localhost:5000/api/schedules`
- Triggers:
  - `http://localhost:5000/api/triggers`
- Channels:
  - `http://localhost:5000/api/channels`
- Reports:
  - `http://localhost:5000/api/reports`

## Login endpoints

After starting local server visit [Link]{ http://localhost:5000/api-docs } for detailed endpoint description.
Or visit api-docs from demonstration link [Link]{ https://praksans.dyndns.org:450/api-docs/ }

Gives back token for use if login successful (correct admin username & password)

- `http://localhost:5000/login`
- Expects POST method with body data (JSON object), e.g.:

  ```
  {
    "username": "keanu",
    "pass": "reaves",
  }
  ```

Verifies token (testing endpoint, since all verification is being done on attempted access to other endpoints)

- `http://localhost:5000/login/test`
- Expects Authorization with payload:

```
Bearer <token>
```

# Each attempt on next endpoints requires authorization token as in example /test above

## Messages endpoints

Get messages:

- Get method
- `http://localhost:5000/api/messages`
- sends back JSON object of multiple messages, e.g.:
  ```
  [
    {
      "id":"222",
      "title":"Hello",
      "text":"Hello, is there anybody out there?",
      "cr_date":"11/08/2020"
    },
    ...
  ]
  ```

Insert messages:

- POST method
- `http://localhost:5000/api/messages`
- expects JSON object from body:

  ```
  {
    "title": "NewTitle",
    "text": "Some New Text",
    "cr_date": "dd/mm/yyyy",
  }
  ```

  - title: min 5 char, max 30 char
  - text: min 20 char

Delete a message:

- DELETE method
- `http://localhost:5000/api/messages/:title`
- expects title name in url params

Edit a message:

- POST method
- `http://localhost:5000/api/messages/:title`
- expects title name in url params and JSON object in body
- payload is identical as in inserting new message

## Schedules endpoints

Get schedules:

- Get method
- `http://localhost:5000/api/schedules`
- sends back JSON object of multiple schedules, e.g.:
  ```
  [
    {
      "message": "Regular",
      "run_date": "26/8/2020",
      "active": "true",
      "repeat_range": "1"
    },
    ...
  ]
  ```

Insert schedule:

- POST method
- `http://localhost:5000/api/schedules`
- expects JSON object from body:

  ```
  {
    "message": "MessageTitle",
    "run_date": "dd/mm/yyyy",
    "active": "true | false",
    "repeat_range": "0 | 1 | 7 | 30"
  }
  ```

  - "active" field decides if message will be activated or not
  - "repeat_range" field decides if message will be repeated:
    - 0 -> no repeat
    - 1 -> repeat after 1 day
    - 7 -> repeat after 7 day
    - 30 -> repeat after 1 month

Delete a schedule:

- DELETE method
- `http://localhost:5000/api/schedules/:title`
- expects message title name in url params

Edit a schedule:

- POST method
- `http://localhost:5000/api/schedules/:title`
- expects message title name in url params and JSON object in body
- payload is identical as in inserting new schedules

## Triggers endpoint

Get triggers:

- Get method
- `http://localhost:5000/api/triggers`
- sends back JSON object of multiple triggers, e.g.:
  ```
  [
    {
      "message": "Hello",
      "trigger_word": "hello",
      "channel": "Private",
      "active": "true",
    }
    ...
  ]
  ```

Insert trigger:

- POST method
- `http://localhost:5000/api/triggers`
- expects JSON object from body:

  ```
    {
      "message": "MessageTitle",
      "trigger_word": "command",
      "channel": "channelName",
      "active": "true | false",
    }
  ```

  - "active" field decides if message can be activated or not

Delete a trigger:

- DELETE method
- `http://localhost:5000/api/triggers/:title`
- expects message title name in url params

Edit a trigger:

- POST method
- `http://localhost:5000/api/triggers/:title`
- expects message title name in url params and JSON object in body
- payload is identical as in inserting new triggers

## Channels endpoint

- Get method, lists all channels available on Slack Workspace
- `http://localhost:5000/api/channels`
- sends back JSON object of multiple channels, e.g.:
  ```
  {
    "tempArray": [
        "general",
        "random",
        ...
    ]
  }
  ```

## Reports endpoints

- Get method, lists all reports info:
- `http://localhost:5000/api/reports`

  ```
  {
    "reports": [
      {
        "id": 1,
        "report_name": "Messages count",
        "report_value": "5",
        "last_update": "25.8.2020"
      },
      ...
    ]
  }
  ```

- Get method, lists number of times commands were called on certain dates:
- `http://localhost:5000/api/reports/usage`
  ```
  {
    "usage": [
      {
        "id": 1,
        "date": "5.8.2020",
        "called": "5"
      },
      ...
    ]
  }
  ```

## Misc

Follow demonstration for Bot Managment at [Link]{ https://praksans.dyndns.org:460/ }
