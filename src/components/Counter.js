import React, { useState, useCallback, useEffect } from 'react';
import CounterDisplay from './CounterDisplay';
import IncrementButton from './IncrementButton';
import ResetButton from './ResetButton';

interface CounterProps {
  initialValue?: number;
  max?: number;
  min?: number;
  step?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  max = Infinity,
  min = -Infinity,
  step = 1,
  onCountChange
}) => {
  const [count, setCount] = useState<number>(initialValue);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Handle count changes and notify parent component
  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

  // Increment counter with bounds checking
  const handleIncrement = useCallback(() => {
    setCount(prevCount => {
      const newCount = prevCount + step;
      return newCount <= max ? newCount : max;
    });
    
    // Trigger animation for visual feedback
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  }, [step, max]);

  // Decrement counter with bounds checking
  const handleDecrement = useCallback(() => {
    setCount(prevCount => {
      const newCount = prevCount - step;
      return newCount >= min ? newCount : min;
    });
    
    // Trigger animation for visual feedback
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  }, [step, min]);

  // Reset counter to initial value
  const handleReset = useCallback(() => {
    setCount(initialValue);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  }, [initialValue]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case '+':
          handleIncrement();
          break;
        case 'ArrowDown':
        case '-':
          handleDecrement();
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleReset();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleIncrement, handleDecrement, handleReset]);

  // Check if buttons should be disabled
  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;
  const isResetDisabled = count === initialValue;

  return (
    <div 
      className={`counter-container ${isAnimating ? 'animate' : ''}`}
      role="group"
      aria-label="Counter controls"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={count}
    >
      <CounterDisplay 
        value={count} 
        min={min} 
        max={max}
        isAnimating={isAnimating}
      />
      
      <div className="counter-controls" role="group" aria-label="Counter buttons">
        <IncrementButton
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          label="Decrement"
          ariaLabel={`Decrease count by ${step}`}
        >
          −
        </IncrementButton>
        
        <IncrementButton
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          label="Increment"
          ariaLabel={`Increase count by ${step}`}
        >
          +
        </IncrementButton>
        
        <ResetButton
          onClick={handleReset}
          disabled={isResetDisabled}
          label="Reset"
          ariaLabel={`Reset counter to ${initialValue}`}
        />
      </div>
    </div>
  );
};

export default Counter;