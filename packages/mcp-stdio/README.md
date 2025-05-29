# MCP STDIO Crypto Service

A command-line interface for analyzing cryptocurrency market regimes for the past 1 hour using technical indicators and AI-powered analysis.

## Features

- **Real-time Market Analysis**: Combines multiple data sources for comprehensive insights:
  - Current prices from CoinMarketCap
  - Technical indicators from TAAPI.io
  - AI-powered regime classification using GPT-4

- **Technical Indicators**:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
  - ATR (Average True Range)
  - Stochastic Oscillator (14,3)
  - SMA (20-period)
  - EMA (20-period)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file using the `.env.sample` and add your API keys:
```env
TAAPI_API_KEY=your_taapi_api_key
COINMARKETCAP_API_KEY=your_cmc_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Usage

1. Build the project:
```bash
npm run build
```

2. Edit the `claude_desktop_config.json` for your Claude Desktop with the following setup:
```json
{
  "mcpServers": {
    "crypto-analysis": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "your_api_key",
        "TAAPI_API_KEY": "your_api_key",
        "COINMARKETCAP_API_KEY": "your_api_key"
      }
    }
  }
}
```

Alternatively, you could use the already uploaded npm package: https://www.npmjs.com/package/crypto-analysis-mcp

The `claude_desktop_config.json` would then look like this:
```json
{
  "mcpServers": {
    "crypto-analysis": {
      "command": "npx",
      "args": ["crypto-analysis-mcp"],
      "env": {
        "OPENAI_API_KEY": "your_api_key",
        "TAAPI_API_KEY": "your_api_key",
        "COINMARKETCAP_API_KEY": "your_api_key"
      }
    }
  }
}
```

## Response Format

The analysis returns a comprehensive market analysis object:

```typescript
interface MarketAnalysis {
  regime: MarketRegime;        // Market regime classification
  currentPrice: number;        // Current cryptocurrency price
  technicalIndicators: {
    rsi: number;              // Relative Strength Index
    macd: {
      valueMACD: number;      // MACD Line
      valueMACDSignal: number;// Signal Line
      valueMACDHist: number;  // MACD Histogram
    };
    bb: {
      valueUpperBand: number; // Bollinger Upper Band
      valueMiddleBand: number;// Bollinger Middle Band
      valueLowerBand: number; // Bollinger Lower Band
    };
    atr: number;             // Average True Range
    stoch: {
      valueK: number;        // Stochastic %K
      valueD: number;        // Stochastic %D
    };
    sma: {
      value: number;         // Simple Moving Average (20)
      period: number;        // Period setting
    };
    ema: {
      value: number;        // Exponential Moving Average (20)
      period: number;       // Period setting
    };
  };
}
```

## Scripts

- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Build the TypeScript project
- `npm start` - Run the built project
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix auto-fixable ESLint issues

## Dependencies

- `@ai-sdk/openai` - AI SDK for OpenAI integration
- `ai` - Vercel AI utilities
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable management
- `openai` - OpenAI API client
