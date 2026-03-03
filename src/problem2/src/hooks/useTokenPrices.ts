import { useState, useEffect } from 'react';

export interface TokenPrice {
  currency: string;
  price: number;
}

interface RawPrice {
  currency: string;
  date: string;
  price: number;
}

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export function getTokenIconUrl(symbol: string): string {
  return `${ICON_BASE}/${symbol}.svg`;
}

export function useTokenPrices() {
  const [tokens, setTokens] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPrices() {
      try {
        const res = await fetch(PRICES_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw: RawPrice[] = await res.json();

        // Keep only the latest price per currency (compare dates, not against now)
        const latest = new Map<string, RawPrice>();
        for (const item of raw) {
          const existing = latest.get(item.currency);
          if (!existing || new Date(item.date) > new Date(existing.date)) {
            latest.set(item.currency, item);
          }
        }

        setTokens(
          Array.from(latest.values())
            .map(({ currency, price }) => ({ currency, price }))
            .sort((a, b) => a.currency.localeCompare(b.currency)),
        );
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to fetch token prices. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    return () => controller.abort();
  }, []);

  return { tokens, loading, error };
}
