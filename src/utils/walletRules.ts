import { UserRole } from '../types';

export const MIN_WALLET_BALANCE_RULES: Record<UserRole, number> = {
  worker: 1000,
  organizer: 5000,
  admin: 0
};

export const MIN_WITHDRAWAL_AMOUNT = 1000;

export const WALLET_RULE_EXPLANATIONS: Record<UserRole, string> = {
  worker:
    'Workers must maintain a minimum wallet balance of ₹1,000 INR to remain active for job assignments, shift security guarantees, and account verification.',
  organizer:
    'Organizers must maintain a minimum wallet balance of ₹5,000 INR to guarantee shift wage escrow, immediate worker dispute settlements, and post active job listings.',
  admin: 'Admins have no minimum wallet balance constraint.'
};

/**
 * Returns the mandatory minimum wallet balance required for the given role.
 */
export function getMinimumWalletBalance(role?: UserRole): number {
  if (!role) return 1000;
  return MIN_WALLET_BALANCE_RULES[role] ?? 1000;
}

/**
 * Checks if the user's wallet balance satisfies the mandatory minimum threshold.
 */
export function isWalletBalanceMaintained(walletBalance: number, role?: UserRole): boolean {
  const minRequired = getMinimumWalletBalance(role);
  return (walletBalance || 0) >= minRequired;
}

/**
 * Returns how much the user needs to deposit to reach the mandatory minimum maintenance balance.
 */
export function getDeficitToMaintainBalance(walletBalance: number, role?: UserRole): number {
  const minRequired = getMinimumWalletBalance(role);
  const current = walletBalance || 0;
  return Math.max(0, minRequired - current);
}

/**
 * Calculates the maximum amount a user can withdraw while strictly maintaining
 * their mandatory minimum wallet balance (₹1,000 for workers, ₹5,000 for organizers).
 */
export function getMaxWithdrawableAmount(walletBalance: number, role?: UserRole): number {
  const minRequired = getMinimumWalletBalance(role);
  const current = walletBalance || 0;
  return Math.max(0, current - minRequired);
}

/**
 * Comprehensive withdrawal validator enforcing:
 * 1. Current balance must be >= minimum maintenance balance.
 * 2. Requested amount must be >= MIN_WITHDRAWAL_AMOUNT (₹1,000 INR).
 * 3. Requested amount cannot exceed available balance.
 * 4. Remaining balance after withdrawal must NOT drop below the mandatory minimum maintenance balance.
 */
export function validateWithdrawal(
  walletBalance: number,
  amount: number,
  role?: UserRole
): { valid: boolean; error?: string; maxWithdrawable: number; minRequiredBalance: number } {
  const minRequiredBalance = getMinimumWalletBalance(role);
  const maxWithdrawable = getMaxWithdrawableAmount(walletBalance, role);
  const roleLabel = role === 'organizer' ? 'Organizer' : role === 'admin' ? 'Admin' : 'Worker';

  // Rule 1: Current wallet balance is below the minimum threshold
  if (walletBalance < minRequiredBalance) {
    const deficit = minRequiredBalance - walletBalance;
    return {
      valid: false,
      error: `Withdrawal Rejected: As an ${roleLabel}, you must maintain a minimum wallet balance of ₹${minRequiredBalance.toLocaleString(
        'en-IN'
      )} INR. Your current balance is ₹${walletBalance.toLocaleString(
        'en-IN'
      )} INR (₹${deficit.toLocaleString('en-IN')} below required minimum). Please top up to restore compliance.`,
      maxWithdrawable,
      minRequiredBalance
    };
  }

  // Rule 2: Minimum withdrawal amount check
  if (amount < MIN_WITHDRAWAL_AMOUNT) {
    return {
      valid: false,
      error: `Withdrawal Rejected: Minimum withdrawal amount is ₹${MIN_WITHDRAWAL_AMOUNT.toLocaleString(
        'en-IN'
      )} INR.`,
      maxWithdrawable,
      minRequiredBalance
    };
  }

  // Rule 3: Amount cannot exceed current balance
  if (amount > walletBalance) {
    return {
      valid: false,
      error: `Withdrawal Rejected: Requested amount (₹${amount.toLocaleString(
        'en-IN'
      )}) exceeds your total wallet balance of ₹${walletBalance.toLocaleString('en-IN')} INR.`,
      maxWithdrawable,
      minRequiredBalance
    };
  }

  // Rule 4: Remaining balance after withdrawal must maintain the mandatory minimum threshold
  if (walletBalance - amount < minRequiredBalance) {
    return {
      valid: false,
      error: `Withdrawal Rejected: You must maintain a minimum balance of ₹${minRequiredBalance.toLocaleString(
        'en-IN'
      )} INR in your wallet. The maximum amount you can withdraw right now is ₹${maxWithdrawable.toLocaleString(
        'en-IN'
      )} INR.`,
      maxWithdrawable,
      minRequiredBalance
    };
  }

  return {
    valid: true,
    maxWithdrawable,
    minRequiredBalance
  };
}
