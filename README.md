# PaisaPath - Smart Financial Management App

PaisaPath is a Flutter-based financial management application that helps users track their expenses, analyze spending patterns, and make informed investment decisions through AI-powered insights.

## Features

- **Expense Tracking**: Track daily, monthly, and yearly income and expenses
- **AI-Powered Analysis**: Get insights about spending patterns and suggestions for better financial management
- **Stock Market Integration**: Real-time stock market data and AI-powered investment suggestions
- **Micro-Investment**: Automated micro-investments ranging from ₹5 to ₹50
- **Smart Notifications**: Get alerts for spending patterns, investment opportunities, and stock market movements
- **Bank Integration**: Link bank accounts for automated transaction tracking and micro-investments

## Getting Started

### Prerequisites

- Flutter SDK (latest version)
- OpenRouter API Key (for AI analysis)
- Alpha Vantage API Key (for stock market data)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/paisapath.git
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure API keys:
   - Create a `.env` file in the root directory
   - Add your API keys:
     ```
     OPENROUTER_API_KEY=your_openrouter_api_key
     ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
     ```

4. Run the app:
```bash
flutter run
```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── providers/            # State management
│   └── finance_provider.dart
├── screens/             # App screens
│   └── home_screen.dart
├── widgets/             # Reusable widgets
│   ├── transaction_list.dart
│   └── stock_watchlist.dart
└── services/           # API and service integrations
    ├── ai_service.dart
    ├── stock_service.dart
    └── notification_service.dart
```

## Dependencies

- `provider`: State management
- `http`: API calls
- `flutter_local_notifications`: Local notifications
- `intl`: Date formatting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter API for AI analysis
- Alpha Vantage for stock market data
- Flutter team for the amazing framework
