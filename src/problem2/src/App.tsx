import SwapForm from './components/SwapForm';

export default function App() {
  return (
    <main className="min-h-screen bg-surface-900 flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,59,238,0.25) 0%, transparent 70%)' }}>
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6 text-white tracking-tight">
          Swap
        </h1>
        <SwapForm />
      </div>
    </main>
  );
}
