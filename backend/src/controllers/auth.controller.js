const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // MOCK MODE FOR DEMO
    if (email === 'test@test.com' && password === 'password123') {
      const mockUser = {
        id: 'mock-123',
        email: 'test@test.com',
        role: 'client',
        full_name: 'Test Admin'
      };
      const token = jwt.sign(mockUser, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
      return res.json({ token, user: mockUser });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
      { expiresIn: '7d' }
    );

    res.json({ token, refreshToken, user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  const { email, password, role, full_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hashedPassword, role, full_name }])
      .select();

    if (error) {
      return res.status(400).json({ message: 'User registration failed', error });
    }

    res.status(201).json({ message: 'User registered successfully', user: data[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };
