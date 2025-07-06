import React from 'react';

const BouncingText: React.FC = () => {
  const text = "dopameme.fun";
  
  return (
    <div className="flex items-center justify-center">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`
            inline-block font-black text-4xl md:text-5xl lg:text-6xl
            animate-bounce-wave
            bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 
            bg-clip-text text-transparent
            hover:from-yellow-400 hover:via-pink-400 hover:to-purple-400
            transition-all duration-300
          `}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.5s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        >
          {char === '.' ? '.' : char}
        </span>
      ))}
    </div>
  );
};

export default BouncingText;