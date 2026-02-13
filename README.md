# News and Weather Dashboard - Asynchronous Programming Demo

This project is a TypeScript-based demonstration of various asynchronous programming patterns in Node.js. It fetches weather data and news headlines using three different approaches: Callbacks, Promises, and Async/Await.

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm (Node Package Manager)

## Setup and Installation

1. Clone the repository to your local machine.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables by creating a .env file based on the provided .env.example:
   ```bash
   LAT=-26.2041
   LON=28.0473
   OPENWEATHER_API_KEY=your_openweather_api_key
   NEWSDATA_API_KEY=your_newsdata_api_key
   ```

## Available Scripts

In the project directory, you can run the following commands:

### Build the Project
Compiles the TypeScript source files into the dist directory:
```bash
npm run build
```

### Run Callback Version
Executes the implementation using traditional callback patterns:
```bash
npm run callback
```

### Run Promise Version
Executes the implementation using ES6 Promises, including demonstrations of Promise.all and Promise.race:
```bash
npm run promise
```

### Run Async/Await Version
Executes the implementation using modern Async/Await syntax with structured error handling:
```bash
npm run async
```

### Run All Versions
Builds the project and runs all three demonstrations sequentially:
```bash
npm run all
```

## Project Structure

- src/callbackVersion.ts: Implementation using callbacks and demonstrations of "callback hell".
- src/promiseVersion.ts: Implementation using the Promise API.
- src/asyncAwaitVersion.ts: The most modern implementation using async and await keywords.
- src/apiClient.ts: Shared HTTP client configuration using Axios.
- src/config.ts: Configuration management and environment variable loading.
- src/logger.ts: Utility for formatted console output.
- src/types.ts: TypeScript interface definitions for API responses.

## License

This project is licensed under the ISC License.
