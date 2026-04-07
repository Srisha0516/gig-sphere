// Mock API Service — localStorage-backed, no backend needed
// Simulates REST API responses for auth, gigs, contracts, users

const STORAGE_KEYS = {
  USERS: 'gigsphere_users',
  GIGS: 'gigsphere_gigs',
  CONTRACTS: 'gigsphere_contracts',
  MESSAGES: 'gigsphere_messages',
};

// ---------- helpers ----------
function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}
function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function uuid() {
  return 'u-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------- seed data ----------
function seedIfEmpty() {
  if (getStore(STORAGE_KEYS.GIGS).length === 0) {
    setStore(STORAGE_KEYS.GIGS, [
      {
        id: 'g1',
        title: 'React + Node Full-Stack App',
        description: 'Build a production-ready MERN stack application with authentication, real-time features, and deployment.',
        skills_required: ['React', 'Node.js', 'PostgreSQL'],
        budget: 2500,
        proposals: 14,
        status: 'open',
        client_id: 'seed-client',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'g2',
        title: 'AI Chatbot Integration',
        description: 'Integrate an AI-powered chatbot using OpenAI GPT-4 API with custom training data and conversation memory.',
        skills_required: ['Python', 'OpenAI', 'FastAPI'],
        budget: 1800,
        proposals: 9,
        status: 'in_progress',
        client_id: 'seed-client',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'g3',
        title: 'Mobile App UI/UX Design',
        description: 'Design a complete mobile app UI/UX for an e-commerce platform with dark mode and accessibility support.',
        skills_required: ['Figma', 'iOS', 'Android'],
        budget: 900,
        proposals: 22,
        status: 'open',
        client_id: 'seed-client',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'g4',
        title: 'Data Pipeline & Dashboard',
        description: 'Build an ETL pipeline and analytics dashboard using Python, Apache Airflow, and React for data visualization.',
        skills_required: ['Python', 'SQL', 'React'],
        budget: 3200,
        proposals: 7,
        status: 'open',
        client_id: 'seed-client',
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'g5',
        title: 'Blockchain Smart Contract Audit',
        description: 'Security audit for Solidity smart contracts on Ethereum. Includes vulnerability assessment and gas optimization.',
        skills_required: ['Solidity', 'Ethereum', 'Security'],
        budget: 4500,
        proposals: 3,
        status: 'open',
        client_id: 'seed-client',
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ]);
  }
}
seedIfEmpty();

// ========== AUTH ==========
export async function registerUser({ full_name, email, password, role }) {
  await delay(400);
  const users = getStore(STORAGE_KEYS.USERS);

  if (users.find((u) => u.email === email)) {
    throw { response: { status: 400, data: { message: 'Email already registered' } } };
  }

  const newUser = {
    id: uuid(),
    full_name,
    email,
    role,
    avatar_url: null,
    bio: '',
    skills: role === 'freelancer' ? ['JavaScript', 'React'] : [],
    avg_rating: 0,
    created_at: new Date().toISOString(),
  };

  users.push({ ...newUser, password });
  setStore(STORAGE_KEYS.USERS, users);

  return { message: 'User registered successfully', user: newUser };
}

export async function loginUser({ email, password }) {
  await delay(400);
  const users = getStore(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
  }

  const token = 'mock-jwt-' + user.id + '-' + Date.now();
  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
}

// ========== GIGS ==========
export async function getGigs() {
  await delay(200);
  return getStore(STORAGE_KEYS.GIGS);
}

export async function createGig(gigData) {
  await delay(300);
  const gigs = getStore(STORAGE_KEYS.GIGS);
  const newGig = {
    id: uuid(),
    ...gigData,
    proposals: 0,
    status: 'open',
    created_at: new Date().toISOString(),
  };
  gigs.unshift(newGig);
  setStore(STORAGE_KEYS.GIGS, gigs);
  return newGig;
}

// ========== USERS ==========
export async function getUserProfile(id) {
  await delay(200);
  const users = getStore(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return {
      user: {
        id,
        full_name: 'Demo User',
        email: 'demo@gigsphere.io',
        role: 'freelancer',
        bio: 'Experienced full-stack developer with 5+ years building scalable web applications.',
        skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
        avg_rating: 4.8,
        created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      reviews: [
        { rating: 5, comment: 'Exceptional work! Delivered ahead of schedule with impeccable code quality.', created_at: new Date(Date.now() - 10 * 86400000).toISOString(), users: { full_name: 'Arjun Mehta' } },
        { rating: 4, comment: 'Great communication and solid technical skills. Would hire again.', created_at: new Date(Date.now() - 30 * 86400000).toISOString(), users: { full_name: 'Sarah Chen' } },
      ],
    };
  }
  const { password: _, ...safeUser } = user;
  return { user: safeUser, reviews: [] };
}

// ========== PAYMENTS ==========
export async function verifyPayment(session_id) {
  await delay(500);
  return { status: 200, verified: true };
}

// ========== CONTRACTS ==========
export async function getContracts() {
  await delay(200);
  return getStore(STORAGE_KEYS.CONTRACTS);
}
