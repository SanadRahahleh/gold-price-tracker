# Gold Price Tracker

A lightweight web app for tracking live gold prices, viewing recent gold price history, and managing a personal gold portfolio. The project is built with plain HTML, CSS, and JavaScript, and it uses the Gold API to fetch current and historical market data in real time.

## What It Does

- Shows the live price of gold in USD and JOD
- Displays a 30-day gold price chart
- Calculates the value of different karat gold forms (24K, 21K, 18K)
- Lets users add and track gold assets in a personal portfolio
- Stores portfolio data locally in the browser using `localStorage`
- Supports search and value calculations for each tracked asset

## Project Overview

This app is designed as a simple portfolio dashboard for gold investors. The main screen shows:

- current gold price per ounce
- conversion cards for gold by purity level
- coin and bar pricing panels
- a chart for recent gold price movement
- a modal calculator for estimating value by weight

The project is intentionally simple and does not use a backend framework or database. It is a front-end-only application focused on user experience and live market tracking.

## Tech Stack

- HTML
- CSS
- JavaScript
- Bootstrap 5
- Chart.js
- Gold API (`https://api.gold-api.com`)

## Project Structure

```text
.
├── index.html                 # Main landing page with live price and chart
├── Assets.html                # Portfolio page for user owned gold assets
├── Assets.js                  # Portfolio logic and localStorage handling
├── Assets.css                 # Portfolio styling (if used)
├── Login.html                 # Login screen
├── SignUp.html                # Registration screen
├── News.html                  # News section
├── add-asset.html             # Page for adding a new asset
├── css/
│   ├── bootstrap.min.css
│   ├── all.min.css
│   └── style.css             # Main app styling
├── js/
│   └── main.js                # Gold data fetch, chart rendering, currency updates
├── src/
│   ├── GoldBars.png
│   ├── RashidiCoin.png
│   ├── EnghlishCoin.png
│   └── ...                   # UI images used throughout the app
└── README.md                  # Documentation
```

## Main Features

### 1. Live Gold Price
The app fetches the current gold price using the Gold API:

```javascript
fetch("https://api.gold-api.com/price/XAU")
```

The result is used to update:
- live price display
- 24K / 21K / 18K calculations
- coin and bar pricing

### 2. Historical Chart
The app also fetches historical gold data for the last 30 days:

```javascript
fetch(`https://api.gold-api.com/history?symbol=XAU&groupBy=day&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`)
```

This data is drawn with Chart.js in a line chart.

### 3. Currency Conversion
The app supports both:
- USD
- JOD

The conversion is done in the frontend using a fixed exchange ratio:

```javascript
function USDToJOD(num) {
  return num * 0.709;
}
```

### 4. Portfolio Tracking
Each user receives a generated local ID and a portfolio key in `localStorage`, such as:

```javascript
localStorage.getItem("myGoldAssets_" + userId)
```

The portfolio stores gold asset data like:
- asset name
- weight
- karat
- purchase price
- profit/loss status

### 5. Search and Filtering
On the assets page, users can search their holdings by asset name.

## How the App Works

### Frontend flow
1. The app loads `index.html`.
2. `js/main.js` initializes the gold price and chart.
3. Data is fetched from the Gold API.
4. The page updates all values in the UI.
5. User interactions (currency toggle, calculator, modal) update the interface without a backend.

### Portfolio flow
1. A user ID is created in localStorage.
2. Gold assets are saved under a user-specific key.
3. Each asset’s current value is calculated using the live gold price and its karat purity.
4. Profit/loss is calculated using the purchase price.
5. The grid is rendered dynamically with JavaScript.

## Running the Project

Because this is a static web app, there is no installation step required beyond opening the project in a browser.

### Option 1: Open directly
Double-click `index.html` or `Assets.html` in a browser.

### Option 2: Use a local web server
```bash
cd path/to/project
python -m http.server 8080
```
Then open:

```text
http://localhost:8080/index.html
```

## Important Note About API Security

This project currently stores the Gold API key directly in the frontend script (`js/main.js`):

```javascript
headers: {
  "x-api-key": "3a999d7b4773470018fcfb0777ddf0052e9c81dbb899461059c3a2245c99aee9"
}
```

This is not recommended for production. The key should be moved to a secure backend service or environment variable, because exposing API keys in browser code is unsafe.

## Suggested Improvements

- Add a backend service to hide the API key
- Add login and user authentication
- Store portfolios in a real database
- Add asset editing and deletion features
- Add multi-user support with server-side storage
- Improve price history filters and date ranges
- Add dark/light theme switch
- Add error handling for failed API requests

## Files of Interest

- `index.html` — main dashboard
- `js/main.js` — main logic and API calls
- `Assets.js` — portfolio calculation and localStorage logic
- `Assets.html` — portfolio UI
- `css/style.css` — visual styling

## License

No explicit license has been provided for this project.
