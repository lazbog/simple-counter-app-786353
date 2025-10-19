import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Counter from '@/components/Counter';

// Define the type for our global state
interface GlobalState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// Create a context for sharing counter state across the app
export const CounterContext = React.createContext<GlobalState | null>(null);

function App({ Component, pageProps }: AppProps) {
  // Initialize counter state with hydration check to avoid SSR mismatch
  const [isHydrated, setIsHydrated] = useState(false);
  const [count, setCount] = useState(0);

  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true);
    // Load saved count from localStorage if available
    const savedCount = localStorage.getItem('counter-value');
    if (savedCount) {
      setCount(Number(savedCount));
    }
  }, []);

  // Persist count to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('counter-value', count.toString());
    }
  }, [count, isHydrated]);

  // Counter action handlers
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  // Provide the counter state to all components
  const contextValue: GlobalState = {
    count,
    increment,
    decrement,
    reset,
  };

  // Prevent hydration mismatch by not rendering until client-side hydration
  if (!isHydrated) {
    return null;
  }

  return (
    <CounterContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Simple Counter App
            </h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Component {...pageProps} />
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Built with Next.js 15 and TypeScript
            </p>
          </div>
        </footer>
      </div>
    </CounterContext.Provider>
  );
}

// Export the App component as default
export default App;