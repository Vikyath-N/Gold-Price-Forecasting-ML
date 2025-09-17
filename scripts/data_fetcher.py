#!/usr/bin/env python3
"""
Gold Price Data Fetcher
Fetches real-time gold prices and market data from free APIs
"""

import json
import os
import requests
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, List, Any
import time

class GoldDataFetcher:
    def __init__(self):
        self.base_url_yahoo = "https://query1.finance.yahoo.com/v8/finance/chart/"
        self.base_url_alpha = "https://www.alphavantage.co/query"
        self.alpha_key = os.getenv('ALPHA_VANTAGE_KEY', 'demo')
        self.data_dir = "docs/data"
        self.ensure_data_dir()
    
    def ensure_data_dir(self):
        """Create data directory if it doesn't exist"""
        os.makedirs(self.data_dir, exist_ok=True)
    
    def fetch_yahoo_gold_price(self, symbol="GC=F", period="1y") -> Dict[str, Any]:
        """
        Fetch gold price data from Yahoo Finance
        GC=F is the gold futures symbol
        """
        try:
            url = f"{self.base_url_yahoo}{symbol}"
            params = {
                'interval': '1d',
                'range': period,
                'events': 'history'
            }
            
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            result = data['chart']['result'][0]
            
            timestamps = result['timestamp']
            quotes = result['indicators']['quote'][0]
            
            # Convert to pandas DataFrame
            df_data = []
            for i, timestamp in enumerate(timestamps):
                if quotes['close'][i] is not None:
                    df_data.append({
                        'date': datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d'),
                        'open': quotes['open'][i],
                        'high': quotes['high'][i],
                        'low': quotes['low'][i],
                        'close': quotes['close'][i],
                        'volume': quotes['volume'][i] if quotes['volume'][i] else 0
                    })
            
            df = pd.DataFrame(df_data)
            return {
                'success': True,
                'data': df.to_dict('records'),
                'current_price': df.iloc[-1]['close'] if not df.empty else None,
                'source': 'Yahoo Finance',
                'symbol': symbol
            }
            
        except Exception as e:
            print(f"Error fetching Yahoo data: {e}")
            return {'success': False, 'error': str(e)}
    
    def fetch_alpha_vantage_data(self, symbol="GOLD") -> Dict[str, Any]:
        """
        Fetch gold price data from Alpha Vantage
        """
        try:
            params = {
                'function': 'TIME_SERIES_DAILY',
                'symbol': f'{symbol}',
                'apikey': self.alpha_key,
                'outputsize': 'full'
            }
            
            response = requests.get(self.base_url_alpha, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'Error Message' in data:
                return {'success': False, 'error': data['Error Message']}
            
            if 'Note' in data:
                return {'success': False, 'error': 'API call frequency limit reached'}
            
            time_series = data.get('Time Series (Daily)', {})
            
            df_data = []
            for date_str, values in time_series.items():
                df_data.append({
                    'date': date_str,
                    'open': float(values['1. open']),
                    'high': float(values['2. high']),
                    'low': float(values['3. low']),
                    'close': float(values['4. close']),
                    'volume': int(values['5. volume'])
                })
            
            df = pd.DataFrame(df_data)
            df = df.sort_values('date')
            
            return {
                'success': True,
                'data': df.to_dict('records'),
                'current_price': df.iloc[-1]['close'] if not df.empty else None,
                'source': 'Alpha Vantage',
                'symbol': symbol
            }
            
        except Exception as e:
            print(f"Error fetching Alpha Vantage data: {e}")
            return {'success': False, 'error': str(e)}
    
    def fetch_economic_indicators(self) -> Dict[str, Any]:
        """
        Fetch economic indicators that affect gold prices
        """
        indicators = {
            'usd_index': self.fetch_yahoo_gold_price("DX-Y.NYB", "3mo"),
            'sp500': self.fetch_yahoo_gold_price("^GSPC", "3mo"),
            'vix': self.fetch_yahoo_gold_price("^VIX", "3mo"),
            'ten_year_treasury': self.fetch_yahoo_gold_price("^TNX", "3mo")
        }
        
        return indicators
    
    def generate_features(self, price_data: List[Dict]) -> Dict[str, Any]:
        """
        Generate technical indicators and features for ML models
        """
        if not price_data:
            return {}
        
        df = pd.DataFrame(price_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Technical indicators
        df['sma_5'] = df['close'].rolling(window=5).mean()
        df['sma_20'] = df['close'].rolling(window=20).mean()
        df['sma_50'] = df['close'].rolling(window=50).mean()
        
        # RSI
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # MACD
        ema_12 = df['close'].ewm(span=12).mean()
        ema_26 = df['close'].ewm(span=26).mean()
        df['macd'] = ema_12 - ema_26
        df['macd_signal'] = df['macd'].ewm(span=9).mean()
        
        # Volatility
        df['volatility'] = df['close'].pct_change().rolling(window=20).std()
        
        # Price changes
        df['price_change_1d'] = df['close'].pct_change()
        df['price_change_5d'] = df['close'].pct_change(periods=5)
        df['price_change_20d'] = df['close'].pct_change(periods=20)
        
        return {
            'features': df.fillna(0).to_dict('records'),
            'latest_features': df.iloc[-1].fillna(0).to_dict() if not df.empty else {}
        }
    
    def save_data(self, data: Dict[str, Any], filename: str):
        """Save data to JSON file"""
        filepath = os.path.join(self.data_dir, filename)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        print(f"✅ Data saved to {filepath}")
    
    def load_existing_data(self, filename: str) -> Dict[str, Any]:
        """Load existing data from JSON file"""
        filepath = os.path.join(self.data_dir, filename)
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def run_data_collection(self):
        """Main data collection pipeline"""
        print("🚀 Starting gold price data collection...")
        
        # Fetch gold price data (try Yahoo first, fallback to Alpha Vantage)
        gold_data = self.fetch_yahoo_gold_price("GC=F", "1y")
        
        if not gold_data['success']:
            print("Yahoo Finance failed, trying Alpha Vantage...")
            gold_data = self.fetch_alpha_vantage_data("GOLD")
        
        if not gold_data['success']:
            print("❌ Failed to fetch gold price data")
            return False
        
        print(f"✅ Fetched gold data from {gold_data['source']}")
        print(f"📊 Current gold price: ${gold_data['current_price']:.2f}")
        
        # Generate features
        features = self.generate_features(gold_data['data'])
        
        # Fetch economic indicators
        print("📈 Fetching economic indicators...")
        indicators = self.fetch_economic_indicators()
        
        # Prepare final dataset
        final_data = {
            'timestamp': datetime.now().isoformat(),
            'gold_price': {
                'current': gold_data['current_price'],
                'data': gold_data['data'][-90:],  # Keep last 90 days
                'source': gold_data['source']
            },
            'features': features,
            'economic_indicators': indicators,
            'metadata': {
                'data_points': len(gold_data['data']),
                'date_range': {
                    'start': gold_data['data'][0]['date'] if gold_data['data'] else None,
                    'end': gold_data['data'][-1]['date'] if gold_data['data'] else None
                }
            }
        }
        
        # Save data
        self.save_data(final_data, 'market_data.json')
        
        # Create a simplified version for the web app
        web_data = {
            'timestamp': datetime.now().isoformat(),
            'current_price': gold_data['current_price'],
            'historical_data': gold_data['data'][-90:],
            'latest_features': features.get('latest_features', {}),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')
        }
        
        self.save_data(web_data, 'latest_data.json')
        
        print("✅ Data collection completed successfully!")
        return True

def main():
    """Main execution function"""
    fetcher = GoldDataFetcher()
    success = fetcher.run_data_collection()
    
    if not success:
        print("❌ Data collection failed!")
        exit(1)
    
    print("🎉 All data collection tasks completed!")

if __name__ == "__main__":
    main()
