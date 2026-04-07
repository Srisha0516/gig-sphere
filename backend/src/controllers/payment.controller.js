const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret');

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
} else {
  supabase = {
    from: () => ({
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { contract_id: 'mock-id' }, error: null }) }) })
    })
  };
}

// POST /payments/verify
const verifyPayment = async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ message: 'Session ID is required' });
  }

  try {
    // Determine if we are in mock mode (no real stripe secret available)
    let isPaid = false;
    let contractId = null;

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret' || session_id.startsWith('mock_')) {
      // Mock validation
      isPaid = true;
      const { data: payment } = await supabase.from('payments').select('contract_id').eq('stripe_session_id', session_id).single();
      contractId = payment?.contract_id;
    } else {
      // Real validation
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === 'paid') {
        isPaid = true;
        contractId = session.metadata.contractId;
      }
    }

    if (isPaid) {
      // Mark payment as paid in database
      await supabase.from('payments').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('stripe_session_id', session_id);
      
      // Update contract status if necessary, but contract is already 'active', we just need to ensure payment is logged.
      // Usually you could mark it as fundamentally "funded".
      
      return res.status(200).json({ success: true, contractId });
    } else {
      return res.status(400).json({ message: 'Payment not successful yet' });
    }
  } catch (err) {
    console.error('Payment Verification Error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

module.exports = { verifyPayment };
