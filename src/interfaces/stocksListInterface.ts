export interface Stock {
  filename: String;
  align?: "right";
  minWidth?: number;
}

export interface StockResponseData {
  nasdaq_traded: string;
  symbol: string;
  security_name: string;
  listing_exchange: string;
  market_category: string;
  etf: string;
  round_lot_size: string;
  test_issue: string;
  financial_status: string;
  cqs_symbol: string;
  nasdaq_symbol: string;
  next_shares: string;
}
