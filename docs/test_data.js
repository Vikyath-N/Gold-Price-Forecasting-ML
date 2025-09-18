// Test data loading and processing
async function testDataLoading() {
    const sources = [
        './data/web_data.json',
        './data/latest_forecast.json',
        './data/sample_data.json'
    ];

    console.group('🔍 Testing Data Files');
    
    for (const url of sources) {
        console.group(`Testing ${url}`);
        try {
            const res = await fetch(url, { cache: 'no-store' });
            console.log('Response status:', res.status);
            
            if (!res.ok) {
                console.error(`❌ HTTP ${res.status}: ${res.statusText}`);
                console.groupEnd();
                continue;
            }
            
            const data = await res.json();
            console.log('Data loaded:', {
                timestamp: data.timestamp,
                current_price: data.current_price,
                has_predictions: !!data.predictions,
                predictions_dates: data.predictions?.dates?.length,
                models: Object.keys(data.predictions?.models || {})
            });
            
            // Test data structure
            const required = {
                timestamp: 'string',
                current_price: 'number',
                predictions: 'object'
            };
            
            Object.entries(required).forEach(([key, type]) => {
                const value = data[key];
                const actualType = typeof value;
                console.log(`${key}: ${actualType === type ? '✅' : '❌'} (${actualType})`);
            });
            
            // Test predictions structure
            if (data.predictions) {
                console.group('Predictions Structure');
                console.log('dates:', Array.isArray(data.predictions.dates));
                console.log('models:', typeof data.predictions.models === 'object');
                if (data.predictions.models) {
                    Object.entries(data.predictions.models).forEach(([model, predictions]) => {
                        console.log(`${model}: ${Array.isArray(predictions)} (${predictions?.length || 0} values)`);
                    });
                }
                console.groupEnd();
            }
            
            console.log('✅ Data file valid');
            console.groupEnd();
            return data;
        } catch (error) {
            console.error('❌ Error:', error.message);
            console.groupEnd();
        }
    }
    
    console.groupEnd();
    return null;
}

// Test chart data preparation
function testChartDataPrep(data) {
    if (!data) return;
    
    console.group('📊 Testing Chart Data Preparation');
    
    try {
        // Test historical data processing
        const historicalData = data.historical_data || [];
        console.log('Historical data points:', historicalData.length);
        
        if (historicalData.length > 0) {
            console.log('Sample historical point:', historicalData[0]);
        }
        
        // Test predictions processing
        const predictions = data.predictions || {};
        console.log('Prediction models:', Object.keys(predictions.models || {}));
        
        if (predictions.dates) {
            console.log('Prediction dates:', predictions.dates.length);
        }
        
        // Test data ranges
        const prices = historicalData.map(d => d.close || d.price).filter(p => p);
        if (prices.length > 0) {
            console.log('Price range:', {
                min: Math.min(...prices),
                max: Math.max(...prices),
                avg: prices.reduce((a, b) => a + b, 0) / prices.length
            });
        }
        
        console.log('✅ Chart data preparation valid');
    } catch (error) {
        console.error('❌ Chart data preparation error:', error.message);
    }
    
    console.groupEnd();
}

// Run tests
async function runTests() {
    console.log('🚀 Starting data tests...');
    const data = await testDataLoading();
    if (data) {
        testChartDataPrep(data);
    }
    console.log('🏁 Tests completed');
}

// Run tests when script loads
runTests().catch(console.error);
