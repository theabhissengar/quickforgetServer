// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const { initializeApp } = require('firebase-admin/app');
// const { getAuth } = require('firebase-admin/auth');

// // Import routes
// const secretRoutes = require('./routes/secrets');
// const stripeRoutes = require('./routes/stripe');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());

// // Initialize Firebase Admin
// const firebaseConfig = {
//   credential: require('./config/firebase-admin'),
//   projectId: process.env.FIREBASE_PROJECT_ID,
// };

// initializeApp(firebaseConfig);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // Authentication middleware
// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const token = authHeader.split('Bearer ')[1];
//     const decodedToken = await getAuth().verifyIdToken(token);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // Routes
// app.use('/api/secrets', authenticateUser, secretRoutes);
// app.use('/api', authenticateUser, stripeRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// }); 






// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');

// // Import routes
// const secretRoutes = require('./routes/secrets');
// const stripeRoutes = require('./routes/stripe');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // Routes (no authentication required)
// app.use('/api/secrets', secretRoutes);
// app.use('/api', stripeRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickforget', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Secret Model
const Secret = mongoose.model('Secret', {
  id: String,
  content: String,
  password: String,
  expiresAt: Date,
  maxViews: Number,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Create Secret Endpoint
app.post('/api/secrets', async (req, res) => {
  try {
    const { content, password, expiresIn, maxViews } = req.body;

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const secret = new Secret({
      id: uuidv4(),
      content,
      password: hashedPassword,
      expiresAt,
      maxViews,
    });

    await secret.save();

    res.status(201).json({
      id: secret.id,
      expiresAt: secret.expiresAt,
      content: secret.content
    });
  } catch (error) {
    console.error('Error creating secret:', error);
    res.status(500).json({ error: 'Failed to create secret' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});