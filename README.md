# weather-dashboard-2

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing Guidelines](#contributing-guidelines)
- [Testing](#testing)
- [Authors and Acknowledgements](#authors-and-acknowledgements)
- [Questions](#questions)

## Description

A typescript weather dashboard app that calls https://openweathermap.org/forecast5 and displays a 5-day forecast for various cities using metric units.

## Installation

To get started with this project, implement the following steps:

1. Clone the repository:

```zsh
git clone git@github.com:gina-t/weather-dashboard-2.git
```

2. Create package.json for server directory and install dependancies:

```zsh
npm install dayjs dotenv express uuid node-fetch
npm install nodemon typescript @types/dotenv @types/express @types/node @types/uuid --save-dev
```

Add the following scripts:

```javascript
"scripts": {
    "start": "npm run build && node dist/server.js --ignore client",
    "dev": "npx nodemon"
  }
```

3. In root directory create `.gitignore` file and add:

node_modules
.env

4. In root directory create `.env` file:

GEO_API_BASE_URL=https://api.openweathermap.org/geo/1.0
WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
API_KEY=your_api_key_here

5. In server directory, create the following folders:

- `src/routes/api`
- `src/routes/htmlRoutes.ts`
- `src/routes/index.ts`
- `src/service/historyService.ts`
- `src/service/weatherService.ts`

6. In server.ts, define routes and middleware:

```typescript
app.use(routes);
app.use(express.json());
```

7. In client directory, initialize a new Vite project:

```zsh
cd client
npm create vite@latest
```

8. In client directory, install dependencies:

```zsh
cd client
npm install dayjs
npm install typescript --save-dev
npm run dev
```

## Usage

Link to render deployment:

[weather-dashboard-2](https://weather-dashboard-2.onrender.com/)

Screenshots of app demonstrating functionality:

### screenshot-1

![Sydney](./client/src/assets/screenshot-1.png)

### screenshot-2

![London](./client/src/assets/screenshot-2.png)


## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contributing Guidelines

Create a new branch for the commit and start a pull request.

## Testing

To ensure the app works correctly, the following E2E test is implemented:

Install cypress:

```zsh
npm install cypress --save-dev
npx cypress open
```

## Authors and Acknowledgements

For enquiries, please contact me at:

[email] (ginadrcoder@gmail.com)

[github] (https://github.com/gina-t)


## Questions

For enquiries, please contact me at:

[email] (ginadrcoder@gmail.com)

[github] (https://github.com/gina-t)

