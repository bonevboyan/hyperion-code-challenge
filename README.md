# Hyperion Crypto MCP

A Model-Consumer-Provider (MCP) server that analyzes cryptocurrency assets to determine if they are in a trending or ranging regime using TypeScript and Vercel's AI SDK.

## Features

- Fetch real-time cryptocurrency prices using CoinMarketCap API
- Analyze market regimes using technical indicators from TAAPI
- AI-powered analysis using OpenAI's GPT-4
- MCP protocol implementation for integration with AI agents
- Docker support for easy deployment

## Technical Indicators Used

The server uses the following technical indicators to determine market regime:
- Moving Average Convergence Divergence (MACD)
- Relative Strength Index (RSI)
- Bollinger Bands
- Average True Range (ATR)

## Prerequisites

- Node.js 20 or higher
- Docker and Docker Compose (optional)
- API Keys for:
  - [CoinMarketCap](https://coinmarketcap.com/api/)
  - [TAAPI](https://taapi.io/)
  - [OpenAI](https://platform.openai.com/)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hyperion-crypto-mcp.git
cd hyperion-crypto-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
TAAPI_API_KEY=your_taapi_api_key
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

## Running the Project

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Using Docker
```bash
# Build and start the container
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

## MCP Tools

The server exposes two main tools through the MCP protocol:

1. `get_crypto_price`
   - Input: `symbol` (string) - The cryptocurrency symbol (e.g., BTC, ETH)
   - Output: Current price of the specified cryptocurrency

2. `analyze_market_regime`
   - Input: `symbol` (string) - The cryptocurrency symbol (e.g., BTC, ETH)
   - Output: Detailed analysis of whether the market is trending or ranging, with reasoning based on technical indicators

## API Endpoints

The MCP server exposes a single endpoint:

- `POST /mcp`: Main MCP endpoint for tool invocation
  - Accepts MCP protocol messages
  - Returns tool execution results

## Market Regime Classification

The server classifies market regimes as follows:

### Trending Market
- Clear directional movement (upward or downward)
- Strong momentum indicators
- Price moving outside Bollinger Bands
- High ATR values

### Ranging Market
- Price moving within defined boundaries
- Neutral momentum indicators
- Price contained within Bollinger Bands
- Lower ATR values

## Code Quality

The project uses ESLint for code quality. Run the linter:
```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint:fix
```

## Error Handling

The server implements comprehensive error handling:
- API errors from external services
- Invalid input validation
- Rate limiting
- Network issues

## Security

- All API keys are stored as environment variables
- Input validation using Zod
- Rate limiting on API endpoints
- Error messages don't expose sensitive information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.