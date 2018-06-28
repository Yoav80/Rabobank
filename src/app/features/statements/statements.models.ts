export interface StatementRecord  {
    reference: number;
    accountNumber: string;
    description: string;
    startBalance: number;
    mutation: number;
    endBalance: number;
    isValid: boolean;
  }