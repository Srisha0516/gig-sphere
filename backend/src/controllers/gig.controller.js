const { createClient } = require('@supabase/supabase-js');
const { rankProposals } = require('../services/ai.service');

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
} else {
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    })
  };
}

// POST /gigs
const createGig = async (req, res) => {
  const { title, description, skills_required, budget, deadline } = req.body;
  const client_id = req.user.id; // From authMiddleware

  try {
    const { data, error } = await supabase
      .from('gigs')
      .insert([{ title, description, skills_required, budget, deadline, client_id, status: 'open' }])
      .select();

    if (error) return res.status(400).json(error);
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /gigs
const getGigs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gigs')
      .select('*, users!client_id(full_name, avg_rating)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json(error);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /gigs/:id/proposals
const submitProposal = async (req, res) => {
  const { id: gig_id } = req.params;
  const { cover_letter, bid_amount, delivery_days } = req.body;
  const freelancer_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('proposals')
      .insert([{ gig_id, freelancer_id, cover_letter, bid_amount, delivery_days, status: 'pending' }])
      .select();

    if (error) return res.status(400).json(error);
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /gigs/:id/proposals (ranked by AI)
const getRankedProposals = async (req, res) => {
  const { id: gig_id } = req.params;

  try {
    // 1. Fetch gig details
    const { data: gig } = await supabase.from('gigs').select('title').eq('id', gig_id).single();
    
    // 2. Fetch proposals with freelancer skills
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*, users!freelancer_id(skills, full_name)')
      .eq('gig_id', gig_id);

    if (error) return res.status(400).json(error);

    // 3. AI Ranking
    const proposalsToRank = proposals.map(p => ({
      skills: p.users.skills,
      cover_letter: p.cover_letter
    }));
    
    const rankings = await rankProposals(gig.title, proposalsToRank);
    
    // 4. Merge rankings back
    const rankedData = proposals.map((p, i) => {
      const rank = rankings.find(r => r.id === i);
      return { ...p, ai_score: rank ? rank.score : 50, ai_reason: rank ? rank.reason : '' };
    });

    res.json(rankedData.sort((a, b) => b.ai_score - a.ai_score));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createGig, getGigs, submitProposal, getRankedProposals };
