const { createClient } = require('@supabase/supabase-js');
const { createCheckoutSession } = require('../services/stripe.service');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// POST /contracts
const createContract = async (req, res) => {
  const { gig_id, proposal_id, freelancer_id, amount } = req.body;
  const client_id = req.user.id;

  try {
    // 1. Create contract
    const { data: contract, error } = await supabase
      .from('contracts')
      .insert([{ gig_id, client_id, freelancer_id, amount, status: 'active' }])
      .select()
      .single();

    if (error) return res.status(400).json(error);

    // 2. Update gig status
    await supabase.from('gigs').update({ status: 'in_progress' }).eq('id', gig_id);
    
    // 3. Close other proposals
    await supabase.from('proposals').update({ status: 'closed' }).eq('gig_id', gig_id).neq('id', proposal_id);
    await supabase.from('proposals').update({ status: 'accepted' }).eq('id', proposal_id);

    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /payments/checkout/:contractId
const checkout = async (req, res) => {
  const { contractId } = req.params;
  
  try {
    const { data: contract } = await supabase.from('contracts').select('*, users!client_id(email)').eq('id', contractId).single();
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    const session = await createCheckoutSession(contractId, contract.amount, contract.users.email);
    
    // Save session to payments table
    await supabase.from('payments').insert([{ contract_id: contractId, stripe_session_id: session.id, amount: contract.amount, status: 'pending' }]);

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Stripe session failed' });
  }
};

module.exports = { createContract, checkout };
