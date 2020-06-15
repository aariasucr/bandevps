export interface UserData {
  created: number;
  creationDate: string;
  registered: boolean;
  email: string;
  fullName: string;
  id: string;
}

export interface UserInformation {
  address: string;
  occupation: string;
  phoneNumber: string;
}

export interface BankAccountData {
  id: string;
  number: string;
  display: string;
}

export interface CreditCardData {
  id: string;
  number: string;
  display: string;
}

export interface BankAccountInfo {
  id: string;
  number: string;
  currency: string;
  balance: number;
}

export interface CreditCardInfo {
  id: string;
  number: string;
  display: string;
  limit_usd: number;
  balance_usd: number;
  type: string;
}

export interface MovementInfo {
  date: string;
  type: string;
  detail: string;
  amount: number;
}
