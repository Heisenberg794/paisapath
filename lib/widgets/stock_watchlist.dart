import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:paisapath/providers/finance_provider.dart';

class StockWatchlist extends StatelessWidget {
  const StockWatchlist({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<FinanceProvider>(
      builder: (context, financeProvider, child) {
        final stocks = financeProvider.watchlist;
        
        if (stocks.isEmpty) {
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  const Text('No stocks in watchlist'),
                  const SizedBox(height: 8),
                  ElevatedButton.icon(
                    onPressed: () {
                      // Add stock to watchlist
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Stock'),
                  ),
                ],
              ),
            ),
          );
        }

        return Card(
          child: ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: stocks.length,
            itemBuilder: (context, index) {
              final stock = stocks[index];
              return ListTile(
                leading: const CircleAvatar(
                  child: Icon(Icons.show_chart),
                ),
                title: Text(stock.symbol),
                subtitle: Text(
                  '₹${stock.currentPrice.toStringAsFixed(2)}',
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '₹${stock.change.toStringAsFixed(2)}',
                      style: TextStyle(
                        color: stock.change >= 0 ? Colors.green : Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${stock.changePercent.toStringAsFixed(2)}%',
                      style: TextStyle(
                        color: stock.changePercent >= 0 ? Colors.green : Colors.red,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                onTap: () {
                  // Show stock details
                },
              );
            },
          ),
        );
      },
    );
  }
} 