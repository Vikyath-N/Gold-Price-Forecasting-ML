import json
import sys


def main() -> int:
    try:
        with open('docs/data/latest_forecast.json', 'r') as f:
            data = json.load(f)

        current = data.get('current_price', 0)
        predictions = data.get('predictions', {}).get('models', {})
        insights = data.get('insights', {})

        print('### 📊 Market Data')
        if current is not None:
            print(f'- **Current Price**: ${current:.2f}')
        print(
            f'- **Data Source**: '
            f'{data.get("metadata", {}).get("data_points", 0)} '
            'historical points'
        )
        print('')

        print('### 🔮 Tomorrow Predictions')
        if predictions:
            for model, preds in predictions.items():
                if preds and preds[0] is not None:
                    print(f'- **{model.upper()}**: ${preds[0]:.2f}')
        else:
            print('- No predictions available.')
        print('')

        print('### 📈 Market Insights')
        trend = insights.get('trend', {})
        print(
            f'- **Trend**: {trend.get("direction", "Unknown")} '
            f'({trend.get("change_percent", 0):.2f}%)'
        )
        print(
            f'- **Volatility**: {insights.get("volatility", {}).get("level", "Unknown")}'
        )
        print(
            f'- **Support**: $'
            f'{insights.get("key_levels", {}).get("support", 0):.2f}'
        )
        print(
            f'- **Resistance**: $'
            f'{insights.get("key_levels", {}).get("resistance", 0):.2f}'
        )
        print('')

        print('### 🎯 Model Performance')
        performance = data.get('model_performance', {})
        if performance:
            for model, accuracy in performance.items():
                print(f'- **{model.upper()}**: {accuracy:.1f}% accuracy')
        else:
            print('- No performance data available.')
        return 0
    except Exception as e:  # noqa: BLE001
        print(f'❌ Error generating summary: {e}')
        return 1


if __name__ == '__main__':
    sys.exit(main())
