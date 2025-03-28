import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Income from '@/models/Income';
import Spending from '@/models/Spending';

// OpenRouter AI configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Standard spending limits as percentage of income
const SPENDING_LIMITS = {
  'Food & Dining': 0.15,    // 15% of income
  'Transportation': 0.10,   // 10% of income
  'Entertainment': 0.05,    // 5% of income
  'Shopping': 0.05,         // 5% of income
  'Utilities': 0.05,        // 5% of income
  'Personal Care': 0.03,    // 3% of income
  'Travel': 0.05,           // 5% of income
  'Healthcare': 0.05,       // 5% of income
  'Education': 0.05,        // 5% of income
  'Housing': 0.30,          // 30% of income
  'Insurance': 0.05,        // 5% of income
  'Savings': 0.20,          // 20% of income
  'Other': 0.05             // 5% of income
};

async function getAIAnalysis(incomes, spendings) {
  try {
    // Calculate total income and spending
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalSpending = spendings.reduce((sum, sp) => sum + sp.amount, 0);
    const netIncome = totalIncome - totalSpending;

    // Calculate category-wise spending
    const spendingByCategory = spendings.reduce((acc, sp) => {
      acc[sp.category] = (acc[sp.category] || 0) + sp.amount;
      return acc;
    }, {});

    // Calculate excessive spending
    const excessiveSpending = {};
    let totalPotentialSavings = 0;

    Object.entries(spendingByCategory).forEach(([category, amount]) => {
      const limit = SPENDING_LIMITS[category] || SPENDING_LIMITS['Other'];
      const limitAmount = totalIncome * limit;
      
      if (amount > limitAmount) {
        const excess = amount - limitAmount;
        totalPotentialSavings += excess;
        
        excessiveSpending[category] = {
          currentSpending: amount,
          recommendedLimit: limitAmount,
          excessAmount: excess,
          percentageOverLimit: ((amount / limitAmount) * 100).toFixed(1),
          monthlyReductionTarget: excess / 12,
          recommendations: [
            `Reduce ${category} spending by $${excess.toFixed(2)} (${((amount / limitAmount) * 100).toFixed(1)}%)`,
            `Set a monthly budget of $${limitAmount.toFixed(2)}`,
            `Aim to reduce by $${(excess / 12).toFixed(2)} per month`,
            `Track ${category} expenses weekly to identify areas for reduction`
          ]
        };
      }
    });

    // Calculate monthly savings plan
    const monthlySavingsPlan = {
      totalMonthlyReduction: totalPotentialSavings / 12,
      categories: Object.entries(excessiveSpending).map(([category, data]) => ({
        category,
        currentSpending: data.currentSpending,
        targetSpending: data.recommendedLimit,
        excessAmount: data.excessAmount,
        monthlyReduction: data.monthlyReductionTarget,
        reductionPercentage: data.percentageOverLimit,
        recommendations: data.recommendations
      })),
      timeline: {
        threeMonths: {
          target: (totalPotentialSavings / 12) * 3,
          description: `Save $${((totalPotentialSavings / 12) * 3).toFixed(2)} in 3 months`
        },
        sixMonths: {
          target: (totalPotentialSavings / 12) * 6,
          description: `Save $${((totalPotentialSavings / 12) * 6).toFixed(2)} in 6 months`
        },
        twelveMonths: {
          target: totalPotentialSavings,
          description: `Achieve full savings target of $${totalPotentialSavings.toFixed(2)}`
        }
      }
    };

    // Calculate category breakdowns
    const incomeCategoryBreakdown = incomes.reduce((acc, inc) => {
      acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
      return acc;
    }, {});

    const spendingCategoryBreakdown = spendingByCategory;

    // Prepare the analysis response
    const analysis = {
      summary: {
        totalIncome,
        totalSpending,
        netIncome,
        incomeCategoryBreakdown,
        spendingCategoryBreakdown
      },
      spendingAnalysis: {
        totalPotentialSavings,
        monthlySavingsPlan
      },
      insights: {
        spendingPatterns: [
          `Total monthly spending is $${(totalSpending / (spendings.length || 1)).toFixed(2)}`,
          `Net monthly income is $${(netIncome / (incomes.length || 1)).toFixed(2)}`,
          `Current savings rate is ${((netIncome / totalIncome) * 100).toFixed(1)}%`
        ],
        priorityCategories: Object.keys(excessiveSpending),
        immediateActions: Object.entries(excessiveSpending).map(([category, data]) => 
          `Reduce ${category} spending by $${data.monthlyReductionTarget.toFixed(2)} per month`
        ),
        longTermStrategies: [
          `Create a monthly budget for each category`,
          `Track expenses daily to identify spending patterns`,
          `Set up automatic savings transfers`,
          `Review and adjust spending habits monthly`
        ]
      }
    };

    return analysis;
  } catch (error) {
    console.error('Analysis Error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { incomes, spendings } = await request.json();

    if ((!incomes || incomes.length === 0) && (!spendings || spendings.length === 0)) {
      return NextResponse.json(
        { 
          error: 'No data to analyze',
          details: 'Both incomes and spendings are empty'
        }, 
        { status: 400 }
      );
    }

    // Get analysis
    const analysis = await getAIAnalysis(incomes, spendings);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze data',
        details: error.toString()
      }, 
      { status: 500 }
    );
  }
}