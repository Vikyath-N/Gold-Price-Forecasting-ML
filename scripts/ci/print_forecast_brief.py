import json
import sys


def main() -> int:
    try:
        with open('docs/data/latest_forecast.json', 'r') as f:
            data = json.load(f)
        current = data.get('current_price', 0) or 0
        ensemble = (
            data.get('predictions', {})
            .get('models', {})
            .get('ensemble') or [0]
        )
        trend = (
            data.get('insights', {})
            .get('trend', {})
            .get('direction', 'Unknown')
        )
        print(f'📊 Current Price: ${current:.2f}')
        if ensemble:
            print(f'🔮 Tomorrow Prediction: ${float(ensemble[0]):.2f}')
        print(f'📈 Trend: {trend}')
        return 0
    except Exception as e:  # noqa: BLE001
        print(f'❌ Brief output failed: {e}')
        return 0


if __name__ == '__main__':
    sys.exit(main())
