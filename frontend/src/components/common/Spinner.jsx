import React from 'react';

const Spinner = ({ size = 'medium', color = 'var(--primary)' }) => {
  const dimensions = {
    small: '18px',
    medium: '36px',
    large: '54px',
  };

  const dim = dimensions[size] || dimensions.medium;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
      <div
        style={{
          width: dim,
          height: dim,
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
