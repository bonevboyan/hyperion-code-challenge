# Hyperion Crypto Analysis

A comprehensive cryptocurrency market analysis solution consisting of two packages:
- A reusable analysis library (`crypto-analysis-mcp`)
- An HTTP server that exposes the analysis tools (`mcp-http`)

## Project Structure

```
packages/
├── mcp-stdio/          # Core analysis package (published as crypto-analysis-mcp)
│   ├── src/
│   │   ├── services/  # Analysis and price services
│   │   └── index.ts   # MCP server implementation
│   └── README.md      # Package documentation
│
└── mcp-http/          # HTTP server implementation
    ├── src/
    │   └── index.ts   # Express server with MCP endpoint
    └── README.md      # Server documentation
```

## Features

### Core Analysis Package (`crypto-analysis-mcp`)
- Real-time cryptocurrency price data from CoinMarketCap
- Comprehensive technical analysis using TAAPI.io:
  - RSI, MACD, Bollinger Bands, ATR
  - Stochastic Oscillator (14,3)
  - SMA and EMA (20-period)
- AI-powered market regime classification using GPT-4
- Published on npm as `crypto-analysis-mcp`

### HTTP Server (`mcp-http`)
- RESTful endpoint for MCP protocol interactions
- Docker support for easy deployment
- Built on Express.js
- Integrates the core analysis package

## Quick Start

### Using the Analysis Package

1. Install the package:
```bash
npm install crypto-analysis-mcp
```

2. Use in your code:
```typescript
import { getServer } from 'crypto-analysis-mcp';

const server = getServer();
// Connect to your transport of choice
```

### Running the HTTP Server

1. Navigate to the server package:
```bash
cd packages/mcp-http
```

2. Create a `.env` file:
```env
PORT=3000
TAAPI_API_KEY=your_taapi_api_key
COINMARKETCAP_API_KEY=your_cmc_api_key
OPENAI_API_KEY=your_openai_api_key
```

3. Run with Docker:
```bash
docker-compose up --build
```

Or run locally:
```bash
npm install
npm run dev
```

## API Usage

Send POST requests to `/mcp` with MCP protocol messages:

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

## Available Tools

1. `get_crypto_price`: Get current cryptocurrency prices
2. `analyze_market_regime`: Full market analysis with:
   - Current price
   - Technical indicators
   - Market regime classification

## Development

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Docker (optional)
- API keys for TAAPI.io, CoinMarketCap, and OpenAI

### Setup
```bash
# Install dependencies for both packages
cd packages/mcp-stdio && npm install
cd ../mcp-http && npm install
```

### Building
```bash
# Build the core package
cd packages/mcp-stdio
npm run build

# Build the HTTP server
cd ../mcp-http
npm run build
```
