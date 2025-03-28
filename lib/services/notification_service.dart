import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);
    await _notifications.initialize(initializationSettings);
  }

  Future<void> showTransactionAnalysis(String title, String body) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'transaction_analysis',
      'Transaction Analysis',
      channelDescription: 'Notifications for transaction analysis and insights',
      importance: Importance.high,
      priority: Priority.high,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await _notifications.show(
      0,
      title,
      body,
      platformDetails,
    );
  }

  Future<void> showStockAlert(String title, String body) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'stock_alerts',
      'Stock Alerts',
      channelDescription: 'Notifications for stock market alerts and updates',
      importance: Importance.high,
      priority: Priority.high,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await _notifications.show(
      1,
      title,
      body,
      platformDetails,
    );
  }

  Future<void> showInvestmentAdvice(String title, String body) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'investment_advice',
      'Investment Advice',
      channelDescription: 'Notifications for investment advice and opportunities',
      importance: Importance.high,
      priority: Priority.high,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await _notifications.show(
      2,
      title,
      body,
      platformDetails,
    );
  }

  Future<void> showSpendingAlert(String title, String body) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'spending_alerts',
      'Spending Alerts',
      channelDescription: 'Notifications for spending pattern alerts',
      importance: Importance.medium,
      priority: Priority.medium,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await _notifications.show(
      3,
      title,
      body,
      platformDetails,
    );
  }
} 