# Paisa - Smart Financial Tracker

A modern, AI-powered financial tracking application that helps you manage your income, spending, and savings with intelligent insights and recommendations.

## Features

- **Income & Spending Tracking**
  - Add and categorize income and spending transactions
  - Track multiple income sources and spending categories
  - Detailed transaction history with descriptions

- **AI-Powered Analysis**
  - Smart spending pattern analysis
  - Category-wise insights and recommendations
  - Monthly reduction targets
  - Long-term savings planning

- **Savings Management**
  - Monthly savings tracking
  - Yearly savings progress monitoring
  - Customizable savings goals

- **Financial Overview**
  - Real-time income and spending summaries
  - Category-wise breakdowns
  - Net income calculations
  - Spending vs. Income ratios

## Tech Stack

- **Frontend**
  - Next.js 13+ with App Router
  - React
  - Tailwind CSS
  - Heroicons
  - React Hot Toast

- **Backend**
  - Next.js API Routes
  - MongoDB
  - Mongoose ODM

## Prerequisites

- Node.js 16.x or later
- MongoDB
- OpenRouter API key (for AI analysis)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/paisa-next.git
   cd paisa-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
paisa-next/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   ├── income/
│   │   │   ├── spending/
│   │   │   └── savings/
│   │   ├── page.js
│   │   └── layout.js
│   ├── components/
│   ├── lib/
│   └── models/
├── public/
└── package.json
```

## API Endpoints

- `POST /api/income` - Add new income
- `GET /api/income` - Get all income records
- `POST /api/spending` - Add new spending
- `GET /api/spending` - Get all spending records
- `POST /api/analyze` - Get AI-powered financial analysis
- `POST /api/savings` - Update monthly savings
- `GET /api/savings` - Get savings data

## Features in Detail

### Income & Spending Tracking
- Add transactions with title, amount, category, and description
- Predefined categories for both income and spending
- Real-time updates and validation

### AI Analysis
- Spending pattern recognition
- Category-wise recommendations
- Monthly reduction targets
- Long-term financial planning
- Savings optimization suggestions

### Savings Management
- Monthly savings tracking
- Yearly progress monitoring
- Customizable savings goals
- Visual progress indicators

### Financial Overview
- Comprehensive dashboard
- Category-wise breakdowns
- Spending vs. Income analysis
- Net income calculations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [OpenRouter](https://openrouter.ai/)
