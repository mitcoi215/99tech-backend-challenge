# Problem 2 — Fancy Form

A currency swap UI built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Framework  | React 18 + Vite 5                |
| Language   | TypeScript 5 (strict)            |
| Styling    | Tailwind CSS v3 (dark theme)     |
| Forms      | React Hook Form + Zod            |
| Prices API | interview.switcheo.com/prices.json |

---

## Features

- Live token prices fetched on mount, deduplicated to latest entry per currency
- Searchable token selector dropdowns with SVG icons (fallback to gradient initials)
- Real-time exchange rate and USD value display
- Cross-field validation — prevents swapping a token with itself
- 1.5 s simulated swap with loading spinner
- Success / error toast notification with auto-dismiss
- Skeleton loading state while prices are fetched
- Flip button to instantly swap source ↔ destination tokens

---

## Getting Started

```bash
cd src/problem2
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── SwapForm.tsx      # Main form — validation, exchange rate, submit
│   ├── TokenSelector.tsx # Searchable dropdown + token icon component
│   └── Toast.tsx         # Auto-dismiss notification
├── hooks/
│   └── useTokenPrices.ts # Fetch + deduplicate token prices
├── App.tsx
├── main.tsx
└── index.css
```
