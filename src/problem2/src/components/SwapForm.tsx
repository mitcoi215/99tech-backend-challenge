import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useTokenPrices } from '../hooks/useTokenPrices';
import TokenSelector from './TokenSelector';
import Toast, { ToastType } from './Toast';

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z
  .object({
    fromToken: z.string().min(1, 'Select a source token'),
    toToken: z.string().min(1, 'Select a destination token'),
    fromAmount: z
      .string()
      .min(1, 'Enter an amount')
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
        message: 'Amount must be greater than zero',
      }),
  })
  .refine((d) => d.fromToken !== d.toToken, {
    message: 'Source and destination tokens must differ',
    path: ['toToken'],
  });

type FormValues = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SwapForm() {
  const { tokens, loading: pricesLoading } = useTokenPrices();
  const [isSwapping, setIsSwapping] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fromToken: '', toToken: '', fromAmount: '' },
  });

  const fromToken = watch('fromToken');
  const toToken = watch('toToken');
  const fromAmount = watch('fromAmount');

  const priceOf = useCallback(
    (symbol: string) => tokens.find((t) => t.currency === symbol)?.price ?? 0,
    [tokens],
  );

  // Derived values — recalculated on every relevant watch change
  const fromPrice = priceOf(fromToken);
  const toPrice = priceOf(toToken);
  const numericAmount = parseFloat(fromAmount);

  const toAmount =
    fromPrice && toPrice && !isNaN(numericAmount) && numericAmount > 0
      ? ((numericAmount * fromPrice) / toPrice).toFixed(6)
      : '';

  const exchangeRate =
    fromPrice && toPrice && fromToken && toToken
      ? (fromPrice / toPrice).toLocaleString(undefined, { maximumSignificantDigits: 6 })
      : null;

  function handleFlipTokens() {
    const prev = { from: fromToken, to: toToken };
    setValue('fromToken', prev.to, { shouldValidate: true });
    setValue('toToken', prev.from, { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    setIsSwapping(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      setToast({
        message: `Successfully swapped ${values.fromAmount} ${values.fromToken} → ${toAmount} ${values.toToken}`,
        type: 'success',
      });
    } catch {
      setToast({ message: 'Swap failed. Please try again.', type: 'error' });
    } finally {
      setIsSwapping(false);
    }
  }

  if (pricesLoading) return <SwapSkeleton />;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-800 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-2"
        noValidate
      >
        {/* ── FROM panel ── */}
        <Panel label="From" error={errors.fromAmount?.message ?? errors.fromToken?.message}>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              {...register('fromAmount')}
              // Block characters that type="number" accepts but make no sense here:
              // 'e'/'E' (scientific notation), '+'/'-' (sign). Users should only
              // be able to enter positive decimals.
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
              }}
              className="flex-1 bg-transparent text-2xl font-semibold text-white placeholder-gray-600 outline-none min-w-0
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Controller
              name="fromToken"
              control={control}
              render={({ field }) => (
                <TokenSelector
                  tokens={tokens}
                  selected={field.value}
                  onSelect={field.onChange}
                  exclude={toToken}
                />
              )}
            />
          </div>

          {fromToken && fromPrice > 0 && !isNaN(numericAmount) && numericAmount > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              ≈ ${(numericAmount * fromPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          )}
        </Panel>

        {/* ── Flip button ── */}
        <div className="flex justify-center py-0.5">
          <button
            type="button"
            onClick={handleFlipTokens}
            aria-label="Flip tokens"
            className="bg-surface-700 hover:bg-surface-600 border border-white/10 rounded-xl p-2.5
              text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* ── TO panel ── */}
        <Panel label="To" error={errors.toToken?.message}>
          <div className="flex items-center gap-3">
            <div className="flex-1 text-2xl font-semibold min-w-0 truncate">
              {toAmount ? (
                <span className="text-white">{toAmount}</span>
              ) : (
                <span className="text-gray-600">0.00</span>
              )}
            </div>
            <Controller
              name="toToken"
              control={control}
              render={({ field }) => (
                <TokenSelector
                  tokens={tokens}
                  selected={field.value}
                  onSelect={field.onChange}
                  exclude={fromToken}
                />
              )}
            />
          </div>

          {toToken && toPrice > 0 && toAmount && (
            <p className="text-xs text-gray-500 mt-1">
              ≈ ${(parseFloat(toAmount) * toPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          )}
        </Panel>

        {/* ── Exchange rate ── */}
        {exchangeRate && (
          <p className="text-center text-xs text-gray-500 py-1">
            1 {fromToken} ≈ {exchangeRate} {toToken}
          </p>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isSwapping}
          className="w-full mt-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed
            rounded-2xl py-4 text-white font-semibold text-base transition-all
            hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.99]"
        >
          {isSwapping ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Swapping…
            </span>
          ) : (
            'Swap'
          )}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-surface-700 rounded-2xl p-4 transition-colors ${error ? 'ring-1 ring-red-500/50' : ''}`}>
      <label className="text-xs text-gray-400 mb-2 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SwapSkeleton() {
  return (
    <div className="bg-surface-800 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3 animate-pulse">
      <div className="bg-surface-700 rounded-2xl h-24" />
      <div className="flex justify-center py-0.5">
        <div className="bg-surface-700 rounded-xl w-10 h-10" />
      </div>
      <div className="bg-surface-700 rounded-2xl h-24" />
      <div className="bg-purple-600/40 rounded-2xl h-14" />
    </div>
  );
}
