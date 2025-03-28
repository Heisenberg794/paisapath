import 'package:http/http.dart' as http;
import 'dart:convert';

class StockService {
  static const String _baseUrl = 'https://www.alphavantage.co/query';
  final String _apiKey;

  StockService(this._apiKey);

  Future<Map<String, dynamic>> getStockQuote(String symbol) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl?function=GLOBAL_QUOTE&symbol=$symbol&apikey=$_apiKey'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['Global Quote'];
      } else {
        throw Exception('Failed to fetch stock data');
      }
    } catch (e) {
      print('Error fetching stock data: $e');
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> searchStocks(String query) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl?function=SYMBOL_SEARCH&keywords=$query&apikey=$_apiKey'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['bestMatches']);
      } else {
        throw Exception('Failed to search stocks');
      }
    } catch (e) {
      print('Error searching stocks: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getStockIntraday(String symbol) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl?function=TIME_SERIES_INTRADAY&symbol=$symbol&interval=5min&apikey=$_apiKey'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['Time Series (5min)'];
      } else {
        throw Exception('Failed to fetch intraday data');
      }
    } catch (e) {
      print('Error fetching intraday data: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getStockDaily(String symbol) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl?function=TIME_SERIES_DAILY&symbol=$symbol&apikey=$_apiKey'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['Time Series (Daily)'];
      } else {
        throw Exception('Failed to fetch daily data');
      }
    } catch (e) {
      print('Error fetching daily data: $e');
      rethrow;
    }
  }
} 