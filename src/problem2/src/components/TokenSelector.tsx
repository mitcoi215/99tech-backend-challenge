import { useState, useRef, useEffect } from 'react';
import { TokenPrice, getTokenIconUrl } from '../hooks/useTokenPrices';

interface Props {
  tokens: TokenPrice[];
  selected: string;
  onSelect: (symbol: string) => void;
  exclude?: string;
}

export default function TokenSelector({ tokens, selected, onSelect, exclude }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = tokens.filter(
    (t) => t.currency !== exclude && t.currency.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-surface-600 hover:bg-surface-700 transition-colors rounded-xl px-3 py-2 text-sm font-semibold text-white min-w-[110px]"
      >
        {selected ? (
          <>
            <TokenIcon symbol={selected} size={20} />
            <span>{selected}</span>
          </>
        ) : (
          <span className="text-gray-400">Select</span>
        )}
        <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-surface-700 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-white/10">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search token..."
              className="w-full bg-surface-800 text-white placeholder-gray-500 text-sm px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto scrollbar-hide">
            {filtered.length === 0 ? (
              <li className="text-center text-gray-500 text-sm py-4">No tokens found</li>
            ) : (
              filtered.map((t) => (
                <li key={t.currency}>
                  <button
                    type="button"
                    onClick={() => { onSelect(t.currency); setOpen(false); setSearch(''); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${selected === t.currency ? 'text-purple-400' : 'text-white'}`}
                  >
                    <TokenIcon symbol={t.currency} size={24} />
                    <span className="font-medium">{t.currency}</span>
                    <span className="ml-auto text-gray-400 text-xs">
                      ${t.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function TokenIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span
        className="rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {symbol.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={getTokenIconUrl(symbol)}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full"
      onError={() => setError(true)}
    />
  );
}
