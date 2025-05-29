import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

interface CoinMarketCapResponse {
  data: {
    [key: string]: {
      quote: {
        USD: {
          price: number;
        };
      };
    };
  };
}

export async function getCryptoPrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get<CoinMarketCapResponse>(`${CMC_BASE_URL}/cryptocurrency/quotes/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
      },
      params: {
        symbol: symbol.toUpperCase(),
      },
    });

    const price = response.data.data[symbol.toUpperCase()]?.quote.USD.price;
    if (!price) {
      throw new Error(`No price data found for ${symbol}`);
    }

    return price;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch price: ${error.message}`);
    }
    throw new Error('Failed to fetch price: Unknown error');
  }
} 