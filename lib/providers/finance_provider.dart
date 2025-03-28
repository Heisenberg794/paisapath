import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class FinanceProvider with ChangeNotifier {
  // User's financial data
  double _balance = 0.0;
  final List<Transaction> _transactions = [];
  final List<Stock> _watchlist = [];
  
  // API Keys (should be stored securely in production)
  static const String _openRouterApiKey = 'YOUR_OPENROUTER_API_KEY';
  static const String _alphaVantageApiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';

  // Getters
  double get balance => _balance;
  List<Transaction> get transactions => _transactions;
  List<Stock> get watchlist => _watchlist;

  // Add transaction
  Future<void> addTransaction(Transaction transaction) async {
    _transactions.add(transaction);
    _balance += transaction.amount;
    notifyListeners();
    
    // Analyze transaction with AI
    await analyzeTransaction(transaction);
  }

  // Analyze transaction with AI
  Future<void> analyzeTransaction(Transaction transaction) async {
    try {
      final response = await http.post(
        Uri.parse('https://openrouter.ai/api/v1/chat/completions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_openRouterApiKey',
        },
        body: jsonEncode({
          'model': 'deepseek/deepseek-coder-33b-instruct',
          'messages': [
            {
              'role': 'system',
              'content': 'You are a financial advisor analyzing user transactions.',
            },
            {
              'role': 'user',
              'content': 'Analyze this transaction: ${transaction.description} with amount ${transaction.amount}',
            },
          ],
        }),
      );

      if (response.statusCode == 200) {
        final analysis = jsonDecode(response.body);
        // Handle AI analysis and suggestions
      }
    } catch (e) {
      print('Error analyzing transaction: $e');
    }
  }

  // Get stock data
  Future<void> fetchStockData(String symbol) async {
    try {
      final response = await http.get(
        Uri.parse('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=$symbol&apikey=$_alphaVantageApiKey'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Process stock data
      }
    } catch (e) {
      print('Error fetching stock data: $e');
    }
  }
}

class Transaction {
  final String description;
  final double amount;
  final DateTime date;
  final TransactionType type;

  Transaction({
    required this.description,
    required this.amount,
    required this.date,
    required this.type,
  });
}

enum TransactionType {
  income,
  expense,
}

class Stock {
  final String symbol;
  final double currentPrice;
  final double change;
  final double changePercent;

  Stock({
    required this.symbol,
    required this.currentPrice,
    required this.change,
    required this.changePercent,
  });
} 