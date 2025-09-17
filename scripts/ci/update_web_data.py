import json
import sys
from datetime import datetime


def main() -> int:
    try:
        with open('docs/data/latest_forecast.json', 'r') as f:
            forecast = json.load(f)

        with open('docs/data/market_data.json', 'r') as f:
            market = json.load(f)

        web_data = {
            'timestamp': datetime.now().isoformat(),
            'current_price': forecast.get('current_price', 0),
            'predictions': forecast.get('predictions', {}),
            'confidence': forecast.get('confidence', {}),
            'insights': forecast.get('insights', {}),
            'model_performance': forecast.get('model_performance', {}),
            'historical_data': market.get('gold_price', {}).get('data', [])[-30:],
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
            'data_source': market.get('gold_price', {}).get('source', 'Unknown'),
            'next_update': 'Daily at 6:00 AM EST',
        }

        with open('docs/data/web_data.json', 'w') as f:
            json.dump(web_data, f, indent=2, default=str)

        print('✅ Web application data updated successfully!')
        return 0
    except Exception as e:  # noqa: BLE001
        print(f'❌ Error updating web data: {e}')
        return 1


if __name__ == '__main__':
    sys.exit(main())
