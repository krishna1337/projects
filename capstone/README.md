## Description

My final project is a chat application. Users can login and register, and reach other users by their registered username. A channel will be created between two users, when either one reaches the other. They will be able to message each other.

A websocket connection will get opened if the user is logged in. In the navigation bar, there is a input field, which takes in username of a user. On submission, a channel will be created for the current user and the other user. However if a channel already exists between the two, a new channel won't be created. In both cases a channel ID will be returned in the response, and the browser will dynamically redirect to that channel. In mobile view, the input field will be replaced by the breadcrumb button, clicking on it will cause the input field to appear with a transition effect.

On the homepage there is a sidebar on left, which contains links to the channels to which the current user is related to. On clicking any of the links, the messages of that specific channel will load. To be database efficient, only last 10 messages load every time, further messages load as the user scrolls. In mobile view, the sidebar can be shown and hided by swiping.

And as the messages come through websocket, they will get appended to the messages list, making the communications really fast. All the above is done dynamically.

## Files Structure

- `final/`: django project directory
  - `asgi.py`: manage ASGI deployment, and protocol routing
- `capstone/`: django app directory
  - `consumers.py`: handle websocket events
  - `models.py`: contains 3 models, `User`, `Channel` and `Message`
  - `views.py`: handle API routes
  - `urls.py`: dispatch API routes to views, respectively
- `frontend/src/`: React directory
  - `components/`: React components directory
    - `Register.js`: register page
    - `Login.js`: login page
    - `Navbar.js`: navigation bar and links on the basis of login data
    - `Home.js`: home page, contains the sidebar and links to channels
    - `Chat.js`: messages container and a input field in the bottom
  - `App.js`: handles frontend routing, fetches login and channels data, and initializes websocket connection

## Deployment

Install the project dependencies from `requirements.txt` file. The two python libraries other than Django are `channels` and `channels_redis`. Former was used for websocket support and latter was used for Redis support in Django channels. Redis was being used as a backing store for websocket events, so it should be installed to deploy this project. You can either install Redis from source, or use its docker image. I was using frontend library React, so it should also be installed, you can install it by running `npm install` in the `frontend` directory and build the source files by running `npm build` in the same directory. After all of the above start the django server.

## Justification

My justification for why my project is more complex and distinct than other projects is that no other project required to create a chat system and neither to use websockets. React was also not required by any of the projects. My project is also mobile responsive. I utilized at least one django model and used javascript.
