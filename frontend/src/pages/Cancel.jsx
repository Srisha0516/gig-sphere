import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="max-w-md w-full bg-[#111111] p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Payment Cancelled</h2>
        <p className="text-gray-400 text-sm">You have cancelled the checkout process. No charges were made.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
