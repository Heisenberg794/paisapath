'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, ChartBarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Predefined categories for income and spending
const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Side Business',
  'Other'
];

const SPENDING_CATEGORIES = [
  'Housing',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Debt Payments',
  'Savings',
  'Gifts & Donations',
  'Travel',
  'Personal Care',
  'Other'
];

export default function Home() {
  const [incomes, setIncomes] = useState([]);
  const [spendings, setSpendings] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    amount: '',
    category: '',
    description: ''
  });

  // Add new state for savings form
  const [savingsForm, setSavingsForm] = useState({
    amount: ''
  });

  // Fetch savings data
  const fetchSavings = async () => {
    try {
      const response = await fetch('/api/savings');
      if (!response.ok) throw new Error('Failed to fetch savings data');
      const data = await response.json();
      setCurrentSavings(data.currentMonth.amount);
      setYearlySavings(data.yearlyTotal);
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSavings();
  }, []);

  // Handle savings form submission
  const handleSavingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/savings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(savingsForm.amount) }),
      });

      if (!response.ok) throw new Error('Failed to save savings data');
      
      await fetchSavings();
      setSavingsForm({ amount: '' });
      toast.success('Savings updated successfully');
    } catch (error) {
      toast.error('Failed to update savings');
    }
  };

  const fetchData = async () => {
    try {
      const [incomesRes, spendingsRes] = await Promise.all([
        fetch('/api/income'),
        fetch('/api/spending')
      ]);

      if (!incomesRes.ok || !spendingsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [incomesData, spendingsData] = await Promise.all([
        incomesRes.json(),
        spendingsRes.json()
      ]);

      // Always set the state with the fetched data, even if empty
      setIncomes(Array.isArray(incomesData) ? incomesData : []);
      setSpendings(Array.isArray(spendingsData) ? spendingsData : []);
      
      // Clear analysis if there's no data
      if ((!incomesData || incomesData.length === 0) && (!spendingsData || spendingsData.length === 0)) {
        setAnalysis(null);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      setError(error.message);
      // Clear all state on error
      setIncomes([]);
      setSpendings([]);
      setAnalysis(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.type === 'income' ? '/api/income' : '/api/spending';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          userId: 'user123', // In a real app, this would come from authentication
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add ${formData.type}`);
      }

      toast.success(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} added successfully`);
      setFormData({ title: '', amount: '', category: '', description: '', type: formData.type });
      fetchData();
    } catch (error) {
      toast.error(error.message || `Failed to add ${formData.type}`);
      setError(error.message);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // First fetch the latest data
      await fetchData();

      // Then perform the analysis with the latest data
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incomes, spendings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze data');
      }

      setAnalysis(data);
      toast.success('Analysis completed successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze data');
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get categories based on type
  const getCategories = () => {
    return formData.type === 'income' ? INCOME_CATEGORIES : SPENDING_CATEGORIES;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
            Income & Spending Tracker
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Track your income, spending, and get AI-powered insights to make smarter financial decisions
          </p>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-3 flex justify-center">
            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 w-full max-w-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
                  Add New Transaction
                </h3>
                <p className="mt-2 text-slate-600">
                  Track your income and spending to better manage your finances
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === 'income'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'spending' })}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === 'spending'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Spending
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                    placeholder="Enter transaction title"
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="block w-full rounded-xl border-2 border-slate-200 bg-white pl-8 pr-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 sm:text-sm"
                    placeholder="Add a description for this transaction"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Financial Overview - Always visible */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
                      try {
                        const response = await fetch('/api/delete-all', {
                          method: 'DELETE',
                        });
                        const data = await response.json();
                        
                        if (data.success) {
                          toast.success(`Deleted ${data.deletedCount.income} income records and ${data.deletedCount.spending} spending records`);
                          setIncomes([]);
                          setSpendings([]);
                          setAnalysis(null);
                        } else {
                          throw new Error(data.error || 'Failed to delete data');
                        }
                      } catch (error) {
                        toast.error(error.message || 'Failed to delete data');
                      }
                    }
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete All Data
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (incomes.length === 0 && spendings.length === 0)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Finances'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 p-6 border-b border-slate-100">Income History</h3>
                <ul className="divide-y divide-slate-100">
                  {incomes.map((income) => (
                    <li key={income._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-slate-900">{income.title}</h4>
                          <p className="text-sm text-slate-500">{income.category}</p>
                          {income.description && (
                            <p className="text-sm text-slate-500 mt-1">{income.description}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-emerald-600">
                            ${income.amount.toFixed(2)}
                          </span>
                          <span className="ml-4 text-sm text-slate-500">
                            {new Date(income.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 p-6 border-b border-slate-100">Spending History</h3>
                <ul className="divide-y divide-slate-100">
                  {spendings.map((spending) => (
                    <li key={spending._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-slate-900">{spending.title}</h4>
                          <p className="text-sm text-slate-500">{spending.category}</p>
                          {spending.description && (
                            <p className="text-sm text-slate-500 mt-1">{spending.description}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-rose-600">
                            ${spending.amount.toFixed(2)}
                          </span>
                          <span className="ml-4 text-sm text-slate-500">
                            {new Date(spending.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Dynamic Analysis Section - Appears after clicking Analyze */}
          {analysis && (
            <div className="lg:col-span-3 space-y-8">
              {/* Exact Savings Targets */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Exact Savings Targets</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-100">
                    <h4 className="text-lg font-medium text-emerald-800">Total Potential Savings</h4>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                      ${Math.round(analysis.spendingAnalysis?.totalPotentialSavings + currentSavings).toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Including current savings of ${Math.round(currentSavings).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                    <h4 className="text-lg font-medium text-blue-800">Monthly Reduction Target</h4>
                    <p className="mt-2 text-3xl font-bold text-blue-600">
                      ${(analysis.spendingAnalysis?.monthlySavingsPlan?.categories?.[0]?.monthlyReduction || 0).toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      Amount to reduce spending each month
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-100">
                    <h4 className="text-lg font-medium text-amber-800">Current Savings Rate</h4>
                    <p className="mt-2 text-3xl font-bold text-amber-600">
                      {((currentSavings / analysis.summary.totalIncome) * 100).toFixed(1)}%
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      Of your total income that can be saved
                    </p>
                  </div>
                </div>

                {/* Yearly Savings Progress */}
                <div className="mt-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-lg font-medium text-slate-900 mb-4">Yearly Savings Progress</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Current Year Savings</span>
                      <span className="text-lg font-semibold text-slate-900">
                        ${yearlySavings.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((yearlySavings / (analysis.spendingAnalysis?.monthlySavingsPlan?.timeline?.twelveMonths?.target || 1)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category-wise Excess Spending */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">Excess Spending by Category</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">Total Excess:</span>
                    <span className="text-lg font-semibold text-rose-600">
                      ${analysis.spendingAnalysis?.totalPotentialSavings.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {analysis.spendingAnalysis?.monthlySavingsPlan?.categories.map((category, index) => (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="text-lg font-medium text-slate-900">{category.category}</h5>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-slate-600">
                              Current Spending: <span className="font-medium text-rose-600">${category.currentSpending.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                              Target Spending: <span className="font-medium text-emerald-600">${category.targetSpending.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                              Monthly Reduction: <span className="font-medium text-blue-600">${category.monthlyReduction.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-700">
                            {category.reductionPercentage}% reduction needed
                          </span>
                          <p className="mt-2 text-sm text-slate-600">
                            Excess: <span className="font-medium text-rose-600">${category.excessAmount.toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Spending Progress</span>
                          <span>{Math.round((category.currentSpending / category.targetSpending) * 100)}% of target</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-rose-600 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((category.currentSpending / category.targetSpending) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h6 className="text-sm font-medium text-slate-900 mb-2">Recommendations:</h6>
                        <ul className="space-y-2">
                          {category.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-emerald-500 mr-2">•</span>
                              <span className="text-sm text-slate-600">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                  <h4 className="text-lg font-medium text-blue-800 mb-2">Monthly Savings Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600">3-Month Target</p>
                      <p className="text-xl font-bold text-blue-700">
                        ${analysis.spendingAnalysis?.monthlySavingsPlan?.timeline?.threeMonths?.target.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600">6-Month Target</p>
                      <p className="text-xl font-bold text-blue-700">
                        ${analysis.spendingAnalysis?.monthlySavingsPlan?.timeline?.sixMonths?.target.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600">12-Month Target</p>
                      <p className="text-xl font-bold text-blue-700">
                        ${analysis.spendingAnalysis?.monthlySavingsPlan?.timeline?.twelveMonths?.target.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Analysis */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-100">
                    <h3 className="text-lg font-medium text-emerald-800">Total Income</h3>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                      ${analysis.summary.totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl border border-rose-100">
                    <h3 className="text-lg font-medium text-rose-800">Total Spending</h3>
                    <p className="mt-2 text-3xl font-bold text-rose-600">
                      ${analysis.summary.totalSpending.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800">Net Income</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">
                      ${analysis.summary.netIncome.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Category Breakdown</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h4 className="text-lg font-medium text-slate-900 mb-4">Income Categories</h4>
                      <ul className="space-y-3">
                        {Object.entries(analysis.summary.incomeCategoryBreakdown).map(([category, amount]) => (
                          <li key={category} className="flex justify-between items-center">
                            <span className="text-slate-600">{category}</span>
                            <span className="font-medium text-emerald-600">${amount.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h4 className="text-lg font-medium text-slate-900 mb-4">Spending Categories</h4>
                      <ul className="space-y-3">
                        {Object.entries(analysis.summary.spendingCategoryBreakdown).map(([category, amount]) => (
                          <li key={category} className="flex justify-between items-center">
                            <span className="text-slate-600">{category}</span>
                            <span className="font-medium text-rose-600">${amount.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">AI Recommendations</h3>
                  <div className="space-y-6">
                    {/* Spending Pattern Analysis */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h4 className="text-lg font-medium text-slate-900 mb-4">Spending Pattern Analysis</h4>
                      <div className="space-y-4">
                        {/* Top Spending Categories */}
                        <div>
                          <h5 className="font-medium text-slate-900 mb-3">Top Spending Categories</h5>
                          <div className="space-y-3">
                            {Object.entries(analysis.summary.spendingCategoryBreakdown)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 5)
                              .map(([category, amount]) => (
                                <div key={category} className="relative">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-slate-700">{category}</span>
                                    <span className="text-sm text-slate-600">${amount.toFixed(2)}</span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                      className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${(amount / analysis.summary.totalSpending) * 100}%`
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Monthly Spending Trends */}
                        <div>
                          <h5 className="font-medium text-slate-900 mb-3">Monthly Spending Trends</h5>
                          <div className="space-y-3">
                            {analysis.insights?.spendingPatterns?.map((pattern, index) => (
                              <div key={index} className="flex items-start">
                                <span className="text-emerald-500 mr-2">•</span>
                                <p className="text-sm text-slate-600">{pattern}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spending vs Income Ratio */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h5 className="font-medium text-slate-900 mb-4">Spending vs Income Ratio</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Income</span>
                          <span className="text-sm font-medium text-emerald-600">
                            ${analysis.summary.totalIncome.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Spending</span>
                          <span className="text-sm font-medium text-rose-600">
                            ${analysis.summary.totalSpending.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-rose-600 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${(analysis.summary.totalSpending / analysis.summary.totalIncome) * 100}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-600">
                          {((analysis.summary.totalSpending / analysis.summary.totalIncome) * 100).toFixed(1)}% of income spent
                        </p>
                      </div>
                    </div>

                    {/* Category-wise Insights */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <h5 className="font-medium text-slate-900 mb-4">Category-wise Insights</h5>
                      <div className="space-y-4">
                        {analysis.insights?.priorityCategories?.map((category, index) => (
                          <div key={index} className="border-b border-slate-200 pb-4 last:border-0">
                            <h6 className="text-sm font-medium text-slate-900 mb-2">{category}</h6>
                            <ul className="space-y-2">
                              {analysis.spendingAnalysis?.monthlySavingsPlan?.categories
                                ?.find(c => c.category === category)
                                ?.recommendations
                                ?.slice(0, 2)
                                ?.map((rec, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-emerald-500 mr-2">•</span>
                                    <span className="text-sm text-slate-600">{rec}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Savings Form */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Update Monthly Savings</h3>
            <form onSubmit={handleSavingsSubmit} className="space-y-6">
              <div>
                <label htmlFor="savingsAmount" className="block text-sm font-medium text-slate-700 mb-2">
                  Amount Saved This Month
                </label>
                <input
                  type="number"
                  id="savingsAmount"
                  value={savingsForm.amount}
                  onChange={(e) => setSavingsForm({ amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 sm:text-sm"
                  placeholder="Enter amount saved"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Update Savings
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
