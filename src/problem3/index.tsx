/**
 * Problem 3 — Messy React: refactored solution.
 *
 * All issues identified in README.md have been addressed here.
 */

import React, { useMemo } from 'react';
import WalletRow from './WalletRow';
import { useWalletBalances } from './hooks';
import { usePrices } from './hooks';
import { BoxProps } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

// Fix #6a: added missing `blockchain` field; narrowed to a string union where
// appropriate for your app, or keep `string` for maximum compatibility.
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// ─── Priority lookup — extracted to module scope ──────────────────────────────
//
// Fix #5: declaring this outside the component gives it a stable reference
// across renders and removes the need for useCallback.
// Fix #6b: parameter typed as `string`, not `any`.

const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

function getPriority(blockchain: string): number {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props extends BoxProps {
  children?: React.ReactNode;
}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Fix #2:  removed `prices` from deps — it is not used inside this callback.
  // Fix #1a: renamed `lhsPriority` → `balancePriority`.
  // Fix #1b: corrected filter predicate — keep positive-amount, known-chain balances.
  // Fix #3:  merged formattedBalances into this memo to avoid a second O(n) pass.
  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Keep only balances on a recognised blockchain with a positive amount.
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const priorityDiff = getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
        if (priorityDiff !== 0) return priorityDiff;
        // Secondary sort: descending amount for a stable, deterministic order.
        return rhs.amount - lhs.amount;
      })
      .map((balance: WalletBalance): FormattedWalletBalance => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      }));
  }, [balances]); // Fix #2: `prices` removed — not a dependency of this computation

  // Fix #4: iterate `formattedBalances` so `.formatted` is always defined.
  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      // Fix #7: stable composite key instead of array index.
      <WalletRow
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
