
export interface PriceRangeRow {
  range: string;
  shares: number;
  cost: number;
  pnl: number;
}

export interface ActivityRow {
  activity: string;
  share: number;
  cost: number;
  sold: number;
  netPnl: number;
}

export interface CalculationRow {
  avgDailyTweet: number;
  forecastRange: number;
  group: string;
  mark: string;
}

export interface TradingBlockData {
  title: string;
  priceRanges: PriceRangeRow[];
  activities: ActivityRow[];
  currentPrice: number;
}

export interface ForecastInputs {
  totalTweet: number;
  average: number;
  elapsed: number;
  remainingDays: number;
  remainingHours: number;
  sensitivity: number;
}

export interface GlobalState {
  inputsA: ForecastInputs;
  inputsB: ForecastInputs;
  calculationRows: CalculationRow[];
  tradingBlocks: TradingBlockData[];
  // Legacy fields for migration
  totalTweet?: number;
  average?: number;
  elapsed?: number;
  remainingDays?: number;
  remainingHours?: number;
}

// Added missing interfaces for amortization calculations
export interface CalculationInputs {
  principal: number;
  annualInterestRate: number;
  termYears: number;
  startDate: string;
  extraPayment: number;
}

export interface AmortizationRow {
  period: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  totalPayment: number;
  balance: number;
}

export interface SummaryData {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  payoffDate: string;
  savingsWithExtra: number;
}
