# Babel chat

## 💻 Live demo

_It require **10 seconds** warm up to bootstrap at first time each 30 minutes of inactivity due the server is located in free cost plan_

- Main room
  [http://babel-chat.herokuapp.com](http://babel-chat.herokuapp.com).
- Private room [http://babel-chat.herokuapp.com/private-name-room-you-want](http://babel-chat.herokuapp.com/private-name-room-you-want).

## 📚️ Requeriments

- Node v14.3.0
- Yarn 1.22.4

## 🛠️ Environment configuration

1. Create an application in Google Cloud and get a google application file credentials to Cloud Translation API
2. Copy the default environment variables from `.env.dist` to `.env`
3. Modify the environment variables in `.env` with google application file credentials location and application client id
4. Install dependencies
   ```sh
     $ yarn install
   ```

## 🌍 Application execution

1. Start the application with : `yarn dev`
2. Go to [http://localhost:3000](http://localhost:3000)

## 🚀 Try production bundle

1. Build application baundle with: `yarn build`
2. Run application on production mode: `yarn start`
