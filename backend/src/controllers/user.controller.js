const { createClient } = require('@supabase/supabase-js');

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
} else {
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }), order: () => Promise.resolve({ data: [], error: null }) }) })
    })
  };
}

// GET /users/:id
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, full_name, role, bio, skills, avatar_url, avg_rating, created_at')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Get reviews for this user
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating, comment, created_at, users!reviewer_id(full_name)')
      .eq('reviewee_id', id)
      .order('created_at', { ascending: false });

    res.json({
      user,
      reviews: reviews || []
    });
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile };
