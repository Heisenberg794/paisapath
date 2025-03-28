import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:paisapath/providers/finance_provider.dart';
import 'package:intl/intl.dart';

class TransactionList extends StatelessWidget {
  const TransactionList({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<FinanceProvider>(
      builder: (context, financeProvider, child) {
        final transactions = financeProvider.transactions;
        
        if (transactions.isEmpty) {
          return const Card(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Text('No transactions yet'),
            ),
          );
        }

        return Card(
          child: ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: transactions.length,
            itemBuilder: (context, index) {
              final transaction = transactions[index];
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: transaction.type == TransactionType.income
                      ? Colors.green
                      : Colors.red,
                  child: Icon(
                    transaction.type == TransactionType.income
                        ? Icons.add
                        : Icons.remove,
                    color: Colors.white,
                  ),
                ),
                title: Text(transaction.description),
                subtitle: Text(
                  DateFormat('MMM dd, yyyy').format(transaction.date),
                ),
                trailing: Text(
                  '₹${transaction.amount.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: transaction.type == TransactionType.income
                        ? Colors.green
                        : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
} 