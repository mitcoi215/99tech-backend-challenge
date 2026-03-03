/**
 * Problem 4: Three ways to sum to n
 * Provides 3 unique implementations of summing integers from 1 to n.
 *
 * Note on edge cases: the problem states n is "any integer", but summation
 * to n is only meaningful for positive integers. All three implementations
 * consistently return 0 for n <= 0 (defensive programming — guard against
 * bad input rather than returning a mathematically undefined result).
 */

/**
 * Implementation A: Gaussian formula (arithmetic series)
 * Time complexity:  O(1) — single arithmetic operation regardless of n
 * Space complexity: O(1) — no extra memory used
 */
export function sum_to_n_a(n: number): number {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}

/**
 * Implementation B: Iterative (for loop)
 * Time complexity:  O(n) — iterates once through all values from 1 to n
 * Space complexity: O(1) — only one accumulator variable is maintained
 */
export function sum_to_n_b(n: number): number {
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation C: Recursive
 * Time complexity:  O(n) — makes n recursive calls
 * Space complexity: O(n) — each call frame is pushed onto the call stack,
 *                          consuming O(n) stack space (risk of stack overflow for very large n)
 */
export function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
