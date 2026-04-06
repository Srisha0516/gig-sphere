const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
} else {
  console.log('SUPABASE_URL missing, using mock client');
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    })
  };
}

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const gigRoutes = require('./routes/gig.routes');
const contractRoutes = require('./routes/contract.routes');

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/contracts', contractRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GigSphere API is running' });
});

// Socket.io Real-time Chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_contract', (contractId) => {
    socket.join(contractId);
    console.log(`User joined contract chat: ${contractId}`);
  });

  socket.on('send_message', async (data) => {
    const { contractId, senderId, content } = data;
    
    // Persist to DB via Supabase
    const { error } = await supabase
      .from('messages')
      .insert([{ contract_id: contractId, sender_id: senderId, content }]);
    
    if (!error) {
      io.to(contractId).emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
