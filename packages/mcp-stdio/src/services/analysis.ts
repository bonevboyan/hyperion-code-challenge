import axios from 'axios';
import dotenv from 'dotenv';
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { getCryptoPrice } from './price';

dotenv.config();

const TAAPI_API_KEY = process.env.TAAPI_API_KEY;
const TAAPI_BASE_URL = 'https://api.taapi.io';

enum MarketRegime {
  TRENDING_UP = 'Trending Up',
  TRENDING_DOWN = 'Trending Down',
  RANGING = 'Ranging'
}

interface TechnicalIndicators {
  rsi: number;
  macd: {
    valueMACD: number;
    valueMACDSignal: number;
    valueMACDHist: number;
  };
  bb: {
    valueUpperBand: number;
    valueMiddleBand: number;
    valueLowerBand: number;
  };
  atr: number;
  stoch: {
    valueK: number;
    valueD: number;
  };
  sma: {
    value: number;
    period: number;
  };
  ema: {
    value: number;
    period: number;
  };
}

interface BulkResponse {
  data: Array<{
    id: string;
    result: any;
    errors: string[];
  }>;
}

interface MarketAnalysis {
  regime: MarketRegime;
  currentPrice: number;
  technicalIndicators: TechnicalIndicators;
}

async function getTechnicalIndicators(symbol: string): Promise<TechnicalIndicators> {
  try {
    const bulkQuery = {
      secret: TAAPI_API_KEY,
      construct: {
        exchange: 'binance',
        symbol: `${symbol}/USDT`,
        interval: '1h',
        indicators: [
          {
            id: 'rsi',
            indicator: 'rsi'
          },
          {
            id: 'macd',
            indicator: 'macd'
          },
          {
            id: 'bb',
            indicator: 'bbands'
          },
          {
            id: 'atr',
            indicator: 'atr'
          },
          {
            id: 'stoch',
            indicator: 'stoch',
            kPeriod: 14,
            dPeriod: 3
          },
          {
            id: 'sma',
            indicator: 'sma',
            period: 20
          },
          {
            id: 'ema',
            indicator: 'ema',
            period: 20
          }
        ]
      }
    };

    const response = await axios.post<BulkResponse>(
      `${TAAPI_BASE_URL}/bulk`,
      bulkQuery,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'application/json'
        }
      }
    );

    const results = new Map(response.data.data.map(item => [item.id, item.result]));

    const errors = response.data.data
      .filter(item => item.errors.length > 0)
      .map(item => `${item.id}: ${item.errors.join(', ')}`);

    if (errors.length > 0) {
      throw new Error(`Indicator errors: ${errors.join('; ')}`);
    }

    return {
      rsi: results.get('rsi').value,
      macd: {
        valueMACD: results.get('macd').valueMACD,
        valueMACDSignal: results.get('macd').valueMACDSignal,
        valueMACDHist: results.get('macd').valueMACDHist
      },
      bb: {
        valueUpperBand: results.get('bb').valueUpperBand,
        valueMiddleBand: results.get('bb').valueMiddleBand,
        valueLowerBand: results.get('bb').valueLowerBand
      },
      atr: results.get('atr').value,
      stoch: {
        valueK: results.get('stoch').valueK,
        valueD: results.get('stoch').valueD
      },
      sma: {
        value: results.get('sma').value,
        period: 20
      },
      ema: {
        value: results.get('ema').value,
        period: 20
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch technical indicators: ${error.message}`);
    }
    throw new Error('Failed to fetch technical indicators: Unknown error');
  }
}

export async function analyzeMarketRegime(symbol: string): Promise<MarketAnalysis> {
  try {
    const [indicators, currentPrice] = await Promise.all([
      getTechnicalIndicators(symbol),
      getCryptoPrice(symbol)
    ]);
    
    const { object: regime } = await generateObject({
      model: openai("gpt-4o-mini"),
      output: 'enum',
      enum: Object.values(MarketRegime),
      system: `You are a cryptocurrency market analyst. Analyze the technical indicators to classify if the market is in a trending or ranging regime.`,
      prompt: `Classify the market regime based on these technical indicators for ${symbol}:
        - Current Price: $${currentPrice}
        - RSI: ${indicators.rsi}
        - MACD: ${indicators.macd.valueMACD} (Signal: ${indicators.macd.valueMACDSignal}, Hist: ${indicators.macd.valueMACDHist})
        - Bollinger Bands: Upper: ${indicators.bb.valueUpperBand}, Middle: ${indicators.bb.valueMiddleBand}, Lower: ${indicators.bb.valueLowerBand}
        - ATR: ${indicators.atr}
        - Stochastic: K: ${indicators.stoch.valueK}, D: ${indicators.stoch.valueD}
        - SMA(20): ${indicators.sma.value}
        - EMA(20): ${indicators.ema.value}`
    });

    return {
      regime,
      currentPrice,
      technicalIndicators: indicators
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to analyze market regime: ${error.message}`);
    }
    throw new Error('Failed to analyze market regime: Unknown error');
  }
} 