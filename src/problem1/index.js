/**
 * Problem 1: Three ways to sum to n
 *
 * Note on edge cases: the problem states n is "any integer", but summation
 * to n is only meaningful for positive integers. All three implementations
 * consistently return 0 for n <= 0 (defensive programming).
 */

/**
 * Implementation A: Gaussian formula (arithmetic series)
 *
 * Uses the closed-form formula: n * (n + 1) / 2
 *
 * @param {number} n - Any integer. Returns 0 for n <= 0.
 * @returns {number} The sum of integers from 1 to n.
 *
 * Time complexity:  O(1) — single arithmetic operation regardless of n
 * Space complexity: O(1) — no extra memory allocated
 */
var sum_to_n_a = function (n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

/**
 * Implementation B: Iterative (for loop)
 *
 * Accumulates the sum by iterating from 1 to n.
 *
 * @param {number} n - Any integer. Returns 0 for n <= 0.
 * @returns {number} The sum of integers from 1 to n.
 *
 * Time complexity:  O(n) — iterates once through all values 1..n
 * Space complexity: O(1) — only one accumulator variable maintained
 */
var sum_to_n_b = function (n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Implementation C: Recursive
 *
 * Reduces the problem to sum_to_n(n - 1) + n until the base case n <= 0.
 *
 * @param {number} n - Any integer. Returns 0 for n <= 0.
 * @returns {number} The sum of integers from 1 to n.
 *
 * Time complexity:  O(n) — makes n recursive calls
 * Space complexity: O(n) — each call frame occupies the call stack
 *                          (risk of stack overflow for very large n)
 */
var sum_to_n_c = function (n) {
  if (!Number.isInteger(n) || n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};
