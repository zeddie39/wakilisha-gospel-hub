import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailConfirmed: React.FC = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      navigate("/auth");
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  // Simple confetti effect using emoji (for a quick solution)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-6xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-3xl font-bold text-gospel-gold mb-2">You have confirmed your email!</h1>
      <p className="text-lg text-gospel-navy mb-4">Redirecting to login in {count} second{count !== 1 && 's'}...</p>
      <button
        className="px-6 py-2 bg-gospel-gold text-white rounded-lg font-semibold hover:bg-gospel-light-gold transition"
        onClick={() => navigate("/auth")}
      >
        Click here to login now
      </button>
    </div>
  );
};

export default EmailConfirmed;
