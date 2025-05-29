import 'dotenv/config';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { experimental_createMCPClient } from 'ai';

import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp';

const transport = new StreamableHTTPClientTransport(
  new URL(process.env.MCP_SERVER_URL || 'http://localhost:3000/mcp')
);

const mcpClient = await experimental_createMCPClient({transport});

async function main() {
  const tools = await mcpClient.tools();

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'What is the current price of Bitcoin?',
    tools,
    maxSteps: 2,
  });

  console.log(text);

}

main().catch(console.error);
