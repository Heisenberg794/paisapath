import 'package:http/http.dart' as http;
import 'dart:convert';

class AIService {
  static const String _baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  final String _apiKey;

  AIService(this._apiKey);

  Future<String> analyzeTransaction(String description, double amount) async {
    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiKey',
        },
        body: jsonEncode({
          'model': 'deepseek/deepseek-coder-33b-instruct',
          'messages': [
            {
              'role': 'system',
              'content': '''You are a financial advisor analyzing user transactions.
              Provide insights about spending patterns and suggestions for better financial management.
              Keep the response concise and actionable.''',
            },
            {
              'role': 'user',
              'content': 'Analyze this transaction: $description with amount ₹$amount',
            },
          ],
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['choices'][0]['message']['content'];
      } else {
        throw Exception('Failed to analyze transaction');
      }
    } catch (e) {
      print('Error in AI analysis: $e');
      return 'Unable to analyze transaction at this time.';
    }
  }

  Future<String> getInvestmentAdvice(List<Map<String, dynamic>> transactionHistory) async {
    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiKey',
        },
        body: jsonEncode({
          'model': 'deepseek/deepseek-coder-33b-instruct',
          'messages': [
            {
              'role': 'system',
              'content': '''You are a financial advisor providing investment advice.
              Analyze the user's spending patterns and suggest suitable investment opportunities.
              Focus on micro-investment strategies with amounts between ₹5 to ₹50.
              Keep the response concise and actionable.''',
            },
            {
              'role': 'user',
              'content': 'Analyze these transactions and provide investment advice: ${jsonEncode(transactionHistory)}',
            },
          ],
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['choices'][0]['message']['content'];
      } else {
        throw Exception('Failed to get investment advice');
      }
    } catch (e) {
      print('Error in AI investment advice: $e');
      return 'Unable to provide investment advice at this time.';
    }
  }
} 