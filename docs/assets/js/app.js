// Gold Price Forecasting AI Web Application
class GoldForecastApp {
    constructor() {
        this.currentPrice = 0;
        this.predictions = {};
        this.historicalData = [];
        this.models = {};
        this.charts = {};
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Gold Forecast App...');
            
            // Show loading overlay
            this.showLoading();
            
            // Initialize components
            await this.loadData();
            await this.initializeCharts();
            this.setupEventListeners();
            this.startDataRefresh();
            
            // Hide loading overlay
            this.hideLoading();
            
            console.log('✅ App initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.showError('Failed to initialize application');
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1000);
        }
    }

    async loadData() {
        console.log('📊 Loading market data...');
        
        try {
            // Try to load real data from the API
            const response = await fetch('./data/sample_data.json');
            if (response.ok) {
                const data = await response.json();
                this.processLoadedData(data);
                console.log('✅ Loaded real market data');
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.log('⚠️ Failed to load real data, using generated sample data');
            // Fallback to generated sample data
            await this.generateSampleData();
        }
        
        // Update UI with loaded data
        this.updateUI();
    }

    processLoadedData(data) {
        // Process loaded data from API
        this.currentPrice = data.current_price || 2000;
        this.historicalData = data.historical_data || [];
        
        // Process predictions
        if (data.predictions && data.predictions.models) {
            this.predictions = {
                today: {},
                week: [],
                confidence: 90
            };
            
            // Extract today's predictions (first day)
            Object.entries(data.predictions.models).forEach(([model, preds]) => {
                if (preds && preds.length > 0) {
                    this.predictions.today[model] = preds[0];
                }
            });
            
            // Extract week predictions (ensemble model)
            if (data.predictions.models.ensemble) {
                data.predictions.dates.forEach((date, index) => {
                    if (data.predictions.models.ensemble[index]) {
                        this.predictions.week.push({
                            date: date,
                            price: data.predictions.models.ensemble[index]
                        });
                    }
                });
            }
            
            // Set confidence from ensemble model
            if (data.confidence && data.confidence.ensemble) {
                this.predictions.confidence = data.confidence.ensemble.avg_confidence || 90;
            }
        } else {
            // Fallback to generated predictions
            this.generatePredictions();
        }
    }

    generatePredictions() {
        // Generate predictions when no real data available
        this.predictions = {
            today: {
                biGRU: this.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                tcn: this.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                transformer: this.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                ensemble: this.currentPrice * (1 + (Math.random() - 0.5) * 0.008)
            },
            week: [],
            confidence: 85 + Math.random() * 10
        };
        
        // Generate 7-day predictions
        let currentPred = this.predictions.today.ensemble;
        const now = new Date();
        for (let i = 1; i <= 7; i++) {
            currentPred *= (1 + (Math.random() - 0.5) * 0.015);
            this.predictions.week.push({
                date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                price: Math.round(currentPred * 100) / 100
            });
        }
    }

    async generateSampleData() {
        // Generate realistic gold price data
        const basePrice = 2000; // Current approximate gold price
        const days = 90;
        const now = new Date();
        
        this.historicalData = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const volatility = 0.02; // 2% daily volatility
            const trend = -0.0001 * i; // Slight downward trend
            const randomChange = (Math.random() - 0.5) * volatility;
            
            let price;
            if (i === days) {
                price = basePrice;
            } else {
                const previousPrice = this.historicalData[this.historicalData.length - 1].price;
                price = previousPrice * (1 + trend + randomChange);
            }
            
            this.historicalData.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(price * 100) / 100,
                volume: Math.floor(Math.random() * 100000) + 50000
            });
        }
        
        this.currentPrice = this.historicalData[this.historicalData.length - 1].price;
        
        // Generate predictions for different models
        this.predictions = {
            today: {
                biGRU: this.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                tcn: this.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                transformer: this.currentPrice * (1 + (Math.random() - 0.5) * 0.01),
                ensemble: this.currentPrice * (1 + (Math.random() - 0.5) * 0.008)
            },
            week: [],
            confidence: 85 + Math.random() * 10 // 85-95% confidence
        };
        
        // Generate 7-day predictions
        let currentPred = this.predictions.today.ensemble;
        for (let i = 1; i <= 7; i++) {
            currentPred *= (1 + (Math.random() - 0.5) * 0.015);
            this.predictions.week.push({
                date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                price: Math.round(currentPred * 100) / 100
            });
        }
        
        console.log('📈 Sample data generated:', {
            currentPrice: this.currentPrice,
            dataPoints: this.historicalData.length,
            predictions: this.predictions
        });
    }

    updateUI() {
        // Update current price
        const currentPriceEl = document.getElementById('currentPrice');
        if (currentPriceEl) {
            currentPriceEl.textContent = `$${this.currentPrice.toFixed(2)}`;
        }
        
        // Update last update time
        const lastUpdateEl = document.getElementById('lastUpdate');
        if (lastUpdateEl) {
            lastUpdateEl.textContent = new Date().toLocaleString();
        }
        
        // Update today's prediction
        const todayPredEl = document.getElementById('todayPrediction');
        const changeEl = document.getElementById('predictionChange');
        if (todayPredEl && changeEl) {
            const prediction = this.predictions.today.ensemble;
            const change = ((prediction - this.currentPrice) / this.currentPrice) * 100;
            
            todayPredEl.textContent = `$${prediction.toFixed(2)}`;
            changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            changeEl.className = `prediction-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update confidence
        const confidenceBar = document.getElementById('confidenceBar');
        const confidenceValue = document.getElementById('confidenceValue');
        if (confidenceBar && confidenceValue) {
            const confidence = this.predictions.confidence;
            confidenceBar.style.width = `${confidence}%`;
            confidenceValue.textContent = `${confidence.toFixed(0)}%`;
        }
        
        // Update 7-day outlook
        const weekHigh = Math.max(...this.predictions.week.map(p => p.price));
        const weekLow = Math.min(...this.predictions.week.map(p => p.price));
        const weekTrend = this.predictions.week[6].price > this.currentPrice ? 'Bullish' : 'Bearish';
        
        const weekHighEl = document.getElementById('weekHigh');
        const weekLowEl = document.getElementById('weekLow');
        const weekTrendEl = document.getElementById('weekTrend');
        
        if (weekHighEl) weekHighEl.textContent = `$${weekHigh.toFixed(2)}`;
        if (weekLowEl) weekLowEl.textContent = `$${weekLow.toFixed(2)}`;
        if (weekTrendEl) {
            weekTrendEl.textContent = weekTrend;
            weekTrendEl.className = `stat-value trend ${weekTrend.toLowerCase()}`;
        }
        
        // Update model accuracies (simulated)
        const accuracies = {
            biGRU: 87.5 + Math.random() * 5,
            tcn: 85.2 + Math.random() * 5,
            transformer: 89.1 + Math.random() * 5,
            ensemble: 91.8 + Math.random() * 3
        };
        
        Object.entries(accuracies).forEach(([model, accuracy]) => {
            const el = document.getElementById(`${model}Accuracy`);
            if (el) {
                el.textContent = `${accuracy.toFixed(1)}%`;
            }
        });
    }

    async initializeCharts() {
        console.log('📊 Initializing charts...');
        
        // Initialize main price chart
        this.initPriceChart();
        
        // Initialize comparison chart
        this.initComparisonChart();
    }

    initPriceChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;
        
        const last30Days = this.historicalData.slice(-30);
        const futureData = this.predictions.week;
        
        this.charts.price = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    ...last30Days.map(d => new Date(d.date).toLocaleDateString()),
                    ...futureData.map(d => new Date(d.date).toLocaleDateString())
                ],
                datasets: [
                    {
                        label: 'Historical Price',
                        data: [...last30Days.map(d => d.price), ...Array(futureData.length).fill(null)],
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Predicted Price',
                        data: [...Array(last30Days.length).fill(null), ...futureData.map(d => d.price)],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(36, 43, 61, 0.9)',
                        titleColor: '#FFD700',
                        bodyColor: '#FFFFFF',
                        borderColor: '#FFD700',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#B0BEC5'
                        },
                        grid: {
                            color: 'rgba(55, 71, 79, 0.5)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#B0BEC5',
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'rgba(55, 71, 79, 0.5)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    initComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;
        
        const models = ['Bi-GRU', 'TCN', 'Transformer', 'Ensemble'];
        const predictions = [
            this.predictions.today.biGRU,
            this.predictions.today.tcn,
            this.predictions.today.transformer,
            this.predictions.today.ensemble
        ];
        
        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: models,
                datasets: [{
                    label: 'Today\'s Prediction',
                    data: predictions,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(36, 43, 61, 0.9)',
                        titleColor: '#FFD700',
                        bodyColor: '#FFFFFF',
                        borderColor: '#FFD700',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `Prediction: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#B0BEC5'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ticks: {
                            color: '#B0BEC5',
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'rgba(55, 71, 79, 0.5)'
                        }
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Chart period buttons
        const chartButtons = document.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                chartButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update chart based on selected period
                const period = parseInt(e.target.dataset.period);
                this.updateChartPeriod(period);
            });
        });
    }

    updateChartPeriod(days) {
        if (!this.charts.price) return;
        
        const historicalData = this.historicalData.slice(-days);
        const futureData = this.predictions.week;
        
        this.charts.price.data.labels = [
            ...historicalData.map(d => new Date(d.date).toLocaleDateString()),
            ...futureData.map(d => new Date(d.date).toLocaleDateString())
        ];
        
        this.charts.price.data.datasets[0].data = [
            ...historicalData.map(d => d.price),
            ...Array(futureData.length).fill(null)
        ];
        
        this.charts.price.data.datasets[1].data = [
            ...Array(historicalData.length).fill(null),
            ...futureData.map(d => d.price)
        ];
        
        this.charts.price.update();
    }

    startDataRefresh() {
        // Refresh data every 5 minutes (300000ms)
        setInterval(() => {
            this.refreshData();
        }, 300000);
        
        console.log('🔄 Data refresh scheduled every 5 minutes');
    }

    async refreshData() {
        console.log('🔄 Refreshing data...');
        try {
            // In production, this would fetch real data from APIs
            // For demo, we'll simulate small price changes
            this.simulateMarketMovement();
            this.updateUI();
            this.updateCharts();
        } catch (error) {
            console.error('❌ Error refreshing data:', error);
        }
    }

    simulateMarketMovement() {
        // Simulate small price movements
        const change = (Math.random() - 0.5) * 0.005; // ±0.5% change
        this.currentPrice *= (1 + change);
        
        // Update predictions slightly
        Object.keys(this.predictions.today).forEach(model => {
            this.predictions.today[model] *= (1 + (Math.random() - 0.5) * 0.003);
        });
        
        // Add new data point
        const now = new Date();
        this.historicalData.push({
            date: now.toISOString().split('T')[0],
            price: this.currentPrice,
            volume: Math.floor(Math.random() * 100000) + 50000
        });
        
        // Keep only last 90 days
        if (this.historicalData.length > 90) {
            this.historicalData = this.historicalData.slice(-90);
        }
    }

    updateCharts() {
        if (this.charts.price) {
            // Update with latest data
            const activePeriod = document.querySelector('.chart-btn.active');
            const days = activePeriod ? parseInt(activePeriod.dataset.period) : 30;
            this.updateChartPeriod(days);
        }
        
        if (this.charts.comparison) {
            // Update comparison chart
            this.charts.comparison.data.datasets[0].data = [
                this.predictions.today.biGRU,
                this.predictions.today.tcn,
                this.predictions.today.transformer,
                this.predictions.today.ensemble
            ];
            this.charts.comparison.update();
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.goldApp = new GoldForecastApp();
});

// Add error notification styles
const errorStyles = `
.error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #F44336;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    animation: slideIn 0.3s ease;
}

.error-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);
