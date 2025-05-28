import axios from 'axios';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const TAAPI_API_KEY = process.env.TAAPI_API_KEY;
const TAAPI_BASE_URL = 'https://api.taapi.io';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
}

async function getTechnicalIndicators(symbol: string): Promise<TechnicalIndicators> {
  try {
    console.error(`[DEBUG] Fetching RSI...`);
    const rsiData = await axios.get(`${TAAPI_BASE_URL}/rsi`, {
      params: {
        secret: TAAPI_API_KEY,
        exchange: 'binance',
        symbol: `${symbol}/USDT`,
        interval: '1h'
      }
    }).then(response => response.data);
    
    console.error(`[DEBUG] Fetching MACD...`);
    const macdData = await axios.get(`${TAAPI_BASE_URL}/macd`, {
      params: {
        secret: TAAPI_API_KEY,
        exchange: 'binance',
        symbol: `${symbol}/USDT`,
        interval: '1h'
      }
    }).then(response => response.data);
    
    console.error(`[DEBUG] Fetching Bollinger Bands...`);
    const bbData = await axios.get(`${TAAPI_BASE_URL}/bbands`, {
      params: {
        secret: TAAPI_API_KEY,
        exchange: 'binance',
        symbol: `${symbol}/USDT`,
        interval: '1h'
      }
    }).then(response => response.data);
    
    console.error(`[DEBUG] Fetching ATR...`);
    const atrData = await axios.get(`${TAAPI_BASE_URL}/atr`, {
      params: {
        secret: TAAPI_API_KEY,
        exchange: 'binance',
        symbol: `${symbol}/USDT`,
        interval: '1h'
      }
    }).then(response => response.data);

    return {
      rsi: rsiData.value,
      macd: {
        valueMACD: macdData.valueMACD,
        valueMACDSignal: macdData.valueMACDSignal,
        valueMACDHist: macdData.valueMACDHist
      },
      bb: {
        valueUpperBand: bbData.valueUpperBand,
        valueMiddleBand: bbData.valueMiddleBand,
        valueLowerBand: bbData.valueLowerBand
      },
      atr: atrData.value
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch technical indicators: ${error.message}`);
    }
    throw new Error('Failed to fetch technical indicators: Unknown error');
  }
}

export async function analyzeMarketRegime(symbol: string): Promise<string> {
  try {
    const indicators = await getTechnicalIndicators(symbol);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency market analyst. Analyze the technical indicators to determine if the market is in a trending or ranging regime. Provide a clear analysis with reasoning."
        },
        {
          role: "user",
          content: `Analyze these technical indicators for ${symbol} to determine if we're in a trending or ranging market:
            - RSI: ${indicators.rsi}
            - MACD: ${indicators.macd.valueMACD} (Signal: ${indicators.macd.valueMACDSignal}, Hist: ${indicators.macd.valueMACDHist})
            - Bollinger Bands: Upper: ${indicators.bb.valueUpperBand}, Middle: ${indicators.bb.valueMiddleBand}, Lower: ${indicators.bb.valueLowerBand}
            - ATR: ${indicators.atr}`
        }
      ]
    });

    const result = completion.choices[0]?.message?.content || 'Unable to analyze market regime';
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to analyze market regime: ${error.message}`);
    }
    throw new Error('Failed to analyze market regime: Unknown error');
  }
} 