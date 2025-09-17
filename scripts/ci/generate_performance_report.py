import json
import os
import sys
from datetime import datetime, timedelta


def main() -> int:
    try:
        with open('docs/data/latest_forecast.json', 'r') as f:
            forecast = json.load(f)

        log_entry = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'timestamp': datetime.now().isoformat(),
            'current_price': forecast.get('current_price', 0),
            'predictions': {
                model: (preds[0] if preds else 0)
                for model, preds in forecast.get('predictions', {}).get('models', {}).items()
            },
            'confidence': {
                model: conf.get('avg_confidence', 0)
                for model, conf in forecast.get('confidence', {}).items()
            },
        }

        log_file = 'docs/data/performance_log.json'
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                performance_log = json.load(f)
        else:
            performance_log = {'entries': []}

        performance_log['entries'].append(log_entry)

        cutoff_date = datetime.now() - timedelta(days=30)
        performance_log['entries'] = [
            entry
            for entry in performance_log['entries']
            if datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00')) > cutoff_date
        ]

        with open(log_file, 'w') as f:
            json.dump(performance_log, f, indent=2, default=str)

        print(f'✅ Performance log updated with {len(performance_log["entries"])} entries')
        return 0
    except Exception as e:  # noqa: BLE001
        print(f'❌ Error generating performance report: {e}')
        return 1


if __name__ == '__main__':
    sys.exit(main())
