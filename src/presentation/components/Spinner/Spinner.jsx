import './Spinner.css';

export const Spinner = ({ size = 40, color = 'var(--accent-green)', inline = false }) => {
  if (inline) {
    return (
      <div 
        className="spinner" 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          borderTopColor: color 
        }}
      ></div>
    );
  }

  return (
    <div className="spinner-container">
      <div 
        className="spinner" 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          borderTopColor: color 
        }}
      ></div>
    </div>
  );
};
