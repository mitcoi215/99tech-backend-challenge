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
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = tokens.filter(
    (t) => t.currency !== exclude && t.currency.toLowerCase().includes(search.toLowerCase()),
  );

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // Reset search when closed
  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  // ── Keyboard helpers ──────────────────────────────────────────────────────

  function getItemButtons() {
    return Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    );
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      getItemButtons()[0]?.focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleItemKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      getItemButtons()[index + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        searchRef.current?.focus();
      } else {
        getItemButtons()[index - 1]?.focus();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
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
        <svg
          className={`ml-auto w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-surface-700 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          {/* Search */}
          <div className="p-3 border-b border-white/10">
            <input
              ref={searchRef}
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search token..."
              aria-label="Search tokens"
              className="w-full bg-surface-800 text-white placeholder-gray-500 text-sm px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* List */}
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Select a token"
            className="max-h-52 overflow-y-auto scrollbar-hide"
          >
            {filtered.length === 0 ? (
              <li className="text-center text-gray-500 text-sm py-4">No tokens found</li>
            ) : (
              filtered.map((t, index) => (
                <li key={t.currency}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected === t.currency}
                    onClick={() => { onSelect(t.currency); setOpen(false); }}
                    onKeyDown={(e) => handleItemKeyDown(e, index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm
                      hover:bg-white/5 focus:bg-white/5 focus:outline-none transition-colors
                      ${selected === t.currency ? 'text-purple-400' : 'text-white'}`}
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
        className="rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-hidden="true"
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
      className="rounded-full shrink-0"
      onError={() => setError(true)}
    />
  );
}
