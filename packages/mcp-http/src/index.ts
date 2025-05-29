import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getServer } from 'crypto-analysis-mcp';

dotenv.config();

async function main(): Promise<void> {
  const app = express();
  app.use(express.json());
  console.log("Starting server...");

  app.post('/mcp', async (req: Request, res: Response) => {
    console.log(`Received MCP request: ${JSON.stringify(req.body)}`);
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

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(PORT, () => {
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
  });
}

main().catch(error => {
  console.error('Server failed to start:', error);
  process.exit(1);
}); 