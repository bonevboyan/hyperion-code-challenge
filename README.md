# Hyperion Code Challenge

This project implements a Market Classification Protocol (MCP) server in two different ways to demonstrate flexibility and modularity in design. It also includes a small client application as a proof of concept of how to use the deployed HTTP service.

## Project Overview

The repository consists of three main packages:

1. `mcp-stdio` - A core library package that implements the MCP protocol logic:
   - Published as `crypto-analysis-mcp` on npm
   - Can be integrated into any Node.js application
   - Uses standard input/output for communication
   - Perfect for applications needing direct protocol integration
   - [Detailed Documentation](packages/mcp-stdio/README.md)

2. `mcp-http` - A standalone HTTP server that exposes the MCP functionality:
   - Built on top of the `mcp-stdio` package
   - Provides a RESTful API interface
   - Containerized with Docker
   - Ideal for microservices and web-based integrations
   - [Detailed Documentation](packages/mcp-http/README.md)

3. `mcp-client` - A proof-of-concept client:
   - Demonstrates how to interact with the HTTP service
   - [Detailed Documentation](packages/mcp-client/README.md)

## Project Structure

```
packages/
├── mcp-stdio/          # Core MCP implementation (published as crypto-analysis-mcp)
│   ├── src/
│   │   ├── services/  # Analysis and price services
│   │   └── index.ts   # MCP protocol implementation
│   └── README.md      # Package documentation
│
├── mcp-http/          # HTTP server wrapper
│   ├── src/
│   │   └── index.ts   # Express server with MCP endpoint
│   └── README.md      # Server documentation
│
└── mcp-client/        # Client application
    ├── src/
    │   └── index.ts   # Client implementation
    └── README.md      # Client documentation
```

## Features

### Core Analysis Package (`crypto-analysis-mcp`)
- Uploaded to npm: https://www.npmjs.com/package/crypto-analysis-mcp
- Real-time cryptocurrency price data from CoinMarketCap
- Comprehensive technical analysis using TAAPI.io:
  - RSI, MACD, Bollinger Bands, ATR
  - Stochastic Oscillator (14,3)
  - SMA and EMA (20-period)
- AI-powered market regime classification using GPT-4
- Transport-agnostic design for maximum flexibility

### HTTP Server (`mcp-http`)
- Deployed as a service: https://hyperion-mcp-http.onrender.com
- RESTful API wrapper around the core MCP implementation
- Docker support for easy deployment
- Built on Express.js
- Example of how to integrate the core package in a web service

### Web Client (`mcp-client`)
- Example implementation of MCP protocol client
