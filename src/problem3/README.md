# Problem 3 — Messy React

## Code Review

The following issues were identified in the original component.
They are grouped by severity and category.

---

### 1. Logic Bugs (Critical)

#### 1a. `lhsPriority` is never defined

```tsx
// ❌ Original — ReferenceError at runtime
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {
  if (balance.amount <= 0) return true;
}
```

`lhsPriority` is used but the variable declared two lines above is named
`balancePriority`. Every call to this filter throws a `ReferenceError`.

**Fix:** replace `lhsPriority` with `balancePriority`.

---

#### 1b. Filter predicate is inverted

Even with the naming bug fixed, the filter condition is semantically wrong.
The intent is _"keep balances with a known blockchain and a positive amount"_,
but the predicate returns `true` when `amount <= 0`:

```tsx
// ❌ Keeps zero/negative balances, drops positive ones
if (balancePriority > -99) {
  if (balance.amount <= 0) return true;
}
return false;
```

**Fix:**

```tsx
// ✅ Keep only balances that have a valid priority and a positive amount
return balancePriority > -99 && balance.amount > 0;
```

---

### 2. Incorrect `useMemo` Dependencies (Performance / Correctness)

```tsx
// ❌ prices is in the dep array but is never used inside this useMemo
const sortedBalances = useMemo(() => {
  return balances.filter(...).sort(...);
}, [balances, prices]);
```

`prices` is not read inside the memo callback. Including it causes the sorted
list to be recomputed every time prices refresh, even when balances have not
changed.

**Fix:** remove `prices` from the dependency array.

---

### 3. Derived State Computed Outside Memoization (Performance)

```tsx
// ❌ formattedBalances is recalculated on every render
const formattedBalances = sortedBalances.map((balance) => ({
  ...balance,
  formatted: balance.amount.toFixed(),
}));
```

This allocation happens unconditionally on every render. Wrapping it in
`useMemo` (or computing it inside the existing memo) eliminates the
unnecessary work.

---

### 4. Memoized Data Ignored in Render (Bug)

```tsx
const formattedBalances = sortedBalances.map(...); // computed here

// ❌ rows uses sortedBalances — the unformatted list
const rows = sortedBalances.map((balance: FormattedWalletBalance) => (
  <WalletRow
    ...
    formattedAmount={balance.formatted}  // ← always undefined
  />
));
```

`rows` iterates over `sortedBalances` (which has no `formatted` field) while
casting each element as `FormattedWalletBalance`. The `formattedAmount` prop
is always `undefined` because `.formatted` does not exist on `WalletBalance`.

**Fix:** iterate over `formattedBalances`.

---

### 5. Unstable Function Reference (Performance)

```tsx
// ❌ getPriority is recreated on every render
const getPriority = (blockchain: any): number => { ... };
```

Because `getPriority` is declared inside the component body without
`useCallback`, it gets a new reference on every render. Any child or effect
that depends on it receives a stale-function warning or unnecessary update.

**Fix:** extract the pure lookup to module scope (it has no closure over
component state) — or use `useCallback` with an empty dependency array.

---

### 6. TypeScript Issues

| Issue | Location | Fix |
|---|---|---|
| `blockchain: any` parameter in `getPriority` | `getPriority` | Type as `string` or a `Blockchain` string-union |
| `WalletBalance` lacks `blockchain` field | Interface definition | Add `blockchain: string` |
| `FormattedWalletBalance` extends `WalletBalance` but `WalletBalance` is missing fields used in JSX | `rows` map | Align interfaces so the type chain is sound |

---

### 7. Missing `prices` Entry Produces NaN (Crash Risk)

```tsx
// ❌ If prices API doesn't include this currency, result is NaN
const usdValue = prices[balance.currency] * balance.amount;
```

`prices` comes from an external API and may not contain every currency a wallet
holds. `undefined * number` evaluates to `NaN`, which silently breaks any
downstream formatting (`.toFixed`, `.toLocaleString`) and renders as an empty
field, or throws if passed to a component expecting a number.

**Fix:**

```tsx
const tokenPrice = prices[balance.currency] ?? 0;
const usdValue = tokenPrice * balance.amount;
```

---

### 8. React Anti-Patterns

```tsx
// ❌ Array index as key — breaks reconciliation on reorder / filter
{rows.map((row, index) => <WalletRow key={index} ... />)}
```

Using the array index as a key means React cannot identify individual items
after sorting or filtering changes. Use a stable, unique identifier such as
`${balance.blockchain}-${balance.currency}`.

---

---

## Refactored Code

See [`index.tsx`](./index.tsx) for the corrected implementation.

### Summary of changes

- Fixed `lhsPriority` → `balancePriority` (ReferenceError)
- Fixed filter predicate to retain positive-amount balances only
- Removed `prices` from `sortedBalances` memo dependency
- Extracted `getPriority` to module scope (stable reference, no closure needed)
- Merged `formattedBalances` into the existing `useMemo` to avoid a second pass
- Rendered from `formattedBalances` so `.formatted` is actually defined
- Added `blockchain: string` to `WalletBalance` interface
- Replaced `any` with `string` in `getPriority`
- Added `?? 0` guard on `prices[balance.currency]` to prevent NaN
- Used composite stable key instead of array index
