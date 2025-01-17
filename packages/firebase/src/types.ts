export interface SubscriptionDataInterface {
  expiryDate: number;
  lastChecked: number;
  isExpired: boolean;
  id: string;
  plan: string;
  isStudent: boolean;
  isStaff: boolean;
}