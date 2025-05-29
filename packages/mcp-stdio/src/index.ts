#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { analyzeMarketRegime } from "./services/analysis";
import { getCryptoPrice } from "./services/price";
import dotenv from 'dotenv';

dotenv.config();

export function getServer(): McpServer {
  const server = new McpServer({
    name: "Crypto Analysis MCP",
    version: "1.0.0"
  });

  server.tool(
    "get_crypto_price",
    {
      symbol: z.string().describe("The cryptocurrency symbol (e.g., BTC, ETH)"),
    },
    async ({ symbol }) => {
      try {
        const price = await getCryptoPrice(symbol);
        return {
          content: [{ 
            type: "text", 
            text: `Current price of ${symbol}: $${price}` 
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [{ 
            type: "text", 
            text: `Error fetching price: ${errorMessage}` 
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "analyze_market_regime",
    {
      symbol: z.string().describe("The cryptocurrency symbol (e.g., BTC, ETH)"),
    },
    async ({ symbol }) => {
      try {
        const indicators = await analyzeMarketRegime(symbol);
        return {
          content: [{ 
            type: "text", 
            text: `Technical indicators for ${symbol}:\n${JSON.stringify(indicators, null, 2)}` 
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [{ 
            type: "text", 
            text: `Error fetching technical indicators: ${errorMessage}` 
          }],
          isError: true
        };
      }
    }
  );

  return server;
}

async function main():  Promise<void> {
  const server = getServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Server failed to start:', error);
    process.exit(1);
  });
}