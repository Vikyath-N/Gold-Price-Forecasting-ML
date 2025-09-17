# 🥇 Multimodal Gold Price Forecasting with Deep Learning

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16.1-orange.svg)](https://tensorflow.org/)
[![License](https://img.shields.io/badge/License-Academic-green.svg)](LICENSE)

## 📖 Project Overview

This project implements a comprehensive multimodal approach to gold price forecasting using state-of-the-art deep learning architectures. By leveraging multiple economic indicators and advanced time series models, we achieve robust predictions for gold futures prices.

### 🎯 Key Features
- **Multiple Deep Learning Models**: Bi-GRU, TCN, and Transformer architectures
- **Multimodal Data Integration**: Gold prices, USD Index, Oil prices, and CPI data
- **Ensemble Learning**: Combines multiple model predictions for improved accuracy
- **Comprehensive Evaluation**: RMSE and directional accuracy metrics

## 📊 Dataset

Our multimodal dataset incorporates several key financial and economic indicators:

| Data Source | Symbol | Description |
|-------------|---------|-------------|
| **Gold Futures** | GC=F | Primary target variable - gold futures prices |
| **US Dollar Index** | DX-Y.NYB | Currency strength indicator affecting gold prices |
| **Crude Oil Futures** | CL=F | Commodity correlation and inflation proxy |
| **Consumer Price Index** | CPI | Inflation measure impacting gold demand |

**Data Period**: Historical data with train/validation split for robust evaluation
**Data Source**: Yahoo Finance API and FRED Economic Data

## 🏗️ Project Structure

```
📁 Multimodal GOLD-Price Forecasting ML/
├── 📊 Raw Data/
│   ├── ensemble_pred.csv          # Ensemble model predictions
│   ├── metrics.json               # Comprehensive model metrics
│   ├── pred_bi_gru.csv           # Bi-GRU predictions
│   ├── pred_tcn.csv              # TCN predictions  
│   ├── pred_transformer.csv      # Transformer predictions
│   ├── raw.csv                   # Original dataset
│   ├── scaler.pkl                # Data normalization scaler
│   ├── train.npy / val.npy       # Preprocessed training/validation data
│   ├── y_train.npy / y_val.npy   # Target labels
│   └── transformer_simple.pt     # Trained transformer model
│
├── 📓 Python Notebooks/
│   ├── data_pipeline.ipynb       # Data collection & preprocessing
│   ├── features.ipynb            # Feature engineering & analysis
│   ├── bi_gru.ipynb             # Bidirectional GRU implementation
│   ├── tcn.ipynb                # Temporal Convolutional Network
│   └── ensemble.ipynb           # Ensemble model & final predictions
│
├── 📄 CSCI___567___Final_Report.pdf
├── 🎯 Final Presentation.pdf
└── 📝 README.md
```

## 🤖 Model Architectures

### 1. **Bidirectional GRU (Bi-GRU)**
- **Architecture**: Bidirectional Gated Recurrent Unit network
- **Strengths**: Captures both forward and backward temporal dependencies
- **Performance**: RMSE: 0.067, Direction Accuracy: 49.3%

### 2. **Temporal Convolutional Network (TCN)**
- **Architecture**: Dilated convolutions with residual connections
- **Strengths**: Parallel processing and long-range dependencies
- **Performance**: RMSE: 0.813, Direction Accuracy: 51.4%

### 3. **Transformer Model**
- **Architecture**: Self-attention mechanism for time series
- **Strengths**: Attention-based feature learning
- **Performance**: RMSE: 0.148, Direction Accuracy: 52.7%

### 4. **Ensemble Methods**
- **Ridge Regression Ensemble** (Best): RMSE: 0.062, Direction Accuracy: 49.3%
- **Mean Ensemble**: RMSE: 0.258, Direction Accuracy: 50.2%
- **RMSE-Weighted Ensemble**: RMSE: 0.067, Direction Accuracy: 49.3%

## 📈 Performance Results

| Model | RMSE ↓ | Direction Accuracy ↑ | Rank |
|-------|---------|---------------------|------|
| **Ridge Ensemble** | **0.062** | 49.3% | 🥇 1st |
| Bi-GRU | 0.067 | 49.3% | 🥈 2nd |
| Transformer | 0.148 | **52.7%** | 🥉 3rd |
| Mean Ensemble | 0.258 | 50.2% | 4th |
| TCN | 0.813 | 51.4% | 5th |

> **Note**: Ridge Ensemble achieved the best RMSE performance, while Transformer showed the highest directional accuracy.

## 🚀 Quick Start

### Prerequisites
```bash
# Python 3.8+
# Jupyter Notebook/Lab
# CUDA-compatible GPU (recommended)
```

### Installation
```bash
# Clone the repository
git clone https://github.com/Vikyath-N/Multimodal-Gold-Price-Forecasting.git
cd Multimodal-Gold-Price-Forecasting

# Install required packages
pip install -r requirements.txt

# Launch Jupyter
jupyter notebook
```

### Usage Workflow
1. **📊 Data Pipeline**: Start with `data_pipeline.ipynb` for data collection and preprocessing
2. **🔧 Feature Engineering**: Explore `features.ipynb` for feature analysis and engineering
3. **🤖 Model Training**: Run individual model notebooks:
   - `bi_gru.ipynb` - Bidirectional GRU model
   - `tcn.ipynb` - Temporal Convolutional Network
   - `transformer.ipynb` - Transformer model (if available)
4. **🎯 Ensemble**: Use `ensemble.ipynb` to combine predictions and evaluate performance

## 🔬 Technical Implementation

### Data Preprocessing
- **Normalization**: StandardScaler for feature scaling
- **Sequence Generation**: Sliding window approach for time series
- **Train/Validation Split**: Temporal split to prevent data leakage

### Model Training
- **Framework**: TensorFlow 2.16.1
- **Optimization**: Adam optimizer with learning rate scheduling
- **Regularization**: Dropout and early stopping
- **Hardware**: Google Colab with Tesla T4 GPU

### Evaluation Metrics
- **RMSE**: Root Mean Square Error for prediction accuracy
- **Directional Accuracy**: Percentage of correct price movement predictions

## 👥 Team

| Name | Role | GitHub |
|------|------|---------|
| **Vikyath Naradasi** | Lead Developer | [@Vikyath-N](https://github.com/Vikyath-N) |
| **Abhinav Vadhera** | Model Architecture | |
| **Rodrigo Lopez** | Data Analysis | |

## 🎓 Academic Context

**Course**: CSCI 567 - Machine Learning  
**Institution**: University of Southern California  
**Semester**: Summer 2025  
**Project Type**: Final Course Project

## 📚 Key Learnings

1. **Multimodal Integration**: Successfully combined multiple economic indicators for improved forecasting
2. **Ensemble Benefits**: Ensemble methods often outperform individual models
3. **Architecture Trade-offs**: Different models excel at different aspects (RMSE vs. directional accuracy)
4. **Financial Time Series**: Unique challenges in financial forecasting including market volatility

## 🔮 Future Enhancements

- [ ] **Real-time Data Integration**: Live data feeds for continuous predictions
- [ ] **Additional Features**: Sentiment analysis from financial news
- [ ] **Advanced Ensembles**: Meta-learning approaches for model combination
- [ ] **Deployment**: Web application for interactive forecasting
- [ ] **Extended Timeframes**: Multi-horizon forecasting capabilities

## 📄 Documentation

- **📊 Final Report**: [CSCI___567___Final_Report.pdf](CSCI___567___Final_Report.pdf)
- **🎯 Presentation**: [Final Presentation.pdf](Final%20Presentation.pdf)

## 📜 License

This project is developed for academic purposes as part of CSCI 567 coursework at USC. All rights reserved for educational use.

---

### 🌟 If you found this project helpful, please consider giving it a star!

**Connect with the team:**
- LinkedIn: [Vikyath Naradasi](https://www.linkedin.com/in/vikyathnaradasi/)
- Email: [Contact through GitHub](https://github.com/Vikyath-N)

---
*Built with ❤️ at University of Southern California*
