# Crypto Analysis HTTP Server

An HTTP server that exposes cryptocurrency market analysis tools through the Model-Consumer-Provider (MCP) protocol. This server integrates with the `crypto-analysis-mcp` package to provide technical analysis and market regime classification.

## Features

- **HTTP Endpoint**: Exposes an `/mcp` endpoint for MCP protocol interactions
- **Technical Analysis**: Access to multiple technical indicators:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
  - ATR (Average True Range)
  - Stochastic Oscillator (14,3)
  - SMA (20-period)
  - EMA (20-period)
- **Real-time Data**: Current cryptocurrency prices from CoinMarketCap
- **AI-Powered Analysis**: Market regime classification using GPT-4

## Prerequisites

- Node.js 20 or higher
- Docker (optional)
- API Keys for:
  - TAAPI.io
  - CoinMarketCap
  - OpenAI

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=3000
TAAPI_API_KEY=your_taapi_api_key
COINMARKETCAP_API_KEY=your_cmc_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Usage

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose up --build
```

## API Endpoint

The server exposes a single endpoint:

- **POST** `/mcp`
  - Accepts MCP protocol messages
  - Returns analysis results or price data

### Available Tools

1. `get_crypto_price`
   - Input: `symbol` (string) - Cryptocurrency symbol (e.g., "BTC")
   - Output: Current price in USD

2. `analyze_market_regime`
   - Input: `symbol` (string) - Cryptocurrency symbol (e.g., "BTC")
   - Output: Market analysis including:
     - Current price
     - Technical indicators
     - Market regime classification (Trending Up/Down/Ranging)

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "analyze_market_regime",
  "params": {
    "symbol": "BTC"
  },
  "id": 1
}
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `TAAPI_API_KEY`: API key for technical indicators
- `COINMARKETCAP_API_KEY`: API key for price data
- `OPENAI_API_KEY`: API key for AI analysis
- `NODE_ENV`: Environment setting (development/production)

## Scripts

- `npm run dev` - Run in development mode
- `npm run build` - Build TypeScript code
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

## Dependencies

- `crypto-analysis-mcp` - Core analysis functionality
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `express` - HTTP server framework
- `dotenv` - Environment variable management

## License

MIT License 