import React from 'react';

interface OptimizedButtonProps {
  className?: string;
}

const OptimizedButton: React.FC<OptimizedButtonProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2>OptimizedButton Component</h2>
    </div>
  );
};

export default OptimizedButton;
