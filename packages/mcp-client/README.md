# Crypto MCP Client Example

This example is a proof-of-concept of how to use the deployed Hyperion MCP HTTP/SSE service with the Vercel AI SDK to create AI-powered clients with tool access to live crypto data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file, copy over the contents of the `.sample.env` file and enter your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

By running this, the client should return the current BTC price using the hosted MCP server.
```bash
npm start
```

## How it Works

1. The client uses the Vercel AI SDK to create a chat completion with GPT-4o
2. It provides two tools to GPT-4o:
   - `getCurrentPrice`: Get current cryptocurrency prices
   - `analyzeMarket`: Get full market analysis with technical indicators
3. The tools make requests to the deployed MCP HTTP service
4. GPT-4o processes the results and provides a natural language response
