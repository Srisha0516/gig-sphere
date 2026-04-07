const { createClient } = require('@supabase/supabase-js');

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
} else {
  supabase = {
    from: () => ({
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    })
  };
}

// POST /reviews
const createReview = async (req, res) => {
  const { contract_id, reviewee_id, rating, comment } = req.body;
  const reviewer_id = req.user.id; // from auth middleware

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ contract_id, reviewer_id, reviewee_id, rating, comment }])
      .select();

    if (error) return res.status(400).json(error);
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating review' });
  }
};

module.exports = { createReview };
