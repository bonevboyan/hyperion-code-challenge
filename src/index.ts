import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from 'express';
import { z } from "zod";
import { analyzeMarketRegime } from "./services/analysis";
import { getCryptoPrice } from "./services/price";
import dotenv from 'dotenv';

dotenv.config();

function getServer(): McpServer {
  const server = new McpServer({
    name: "Crypto Analysis MCP",
    version: "1.0.0"
  });

  // Tool to get crypto price
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

  // Tool to get technical indicators
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

async function main(): Promise<void> {
  const app = express();
  app.use(express.json());
  console.log("Starting server...");

  app.post('/mcp', async (req: Request, res: Response) => {
    try {
      const server = getServer(); 
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      
      res.on('close', () => {
        console.log('Request closed');
        transport.close();
        server.close();
      });
      
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  app.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));
  });

  app.delete('/mcp', async (req: Request, res: Response) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(PORT, () => {
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
  });
}

main().catch(error => {
  console.error('Server failed to start:', error);
  process.exit(1);
}); 