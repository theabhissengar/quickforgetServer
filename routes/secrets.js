// const express = require('express');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
// const Secret = require('../models/Secret');
// const bcrypt = require('bcryptjs');

// // Create a new secret
// router.post('/', async (req, res) => {
//   try {
//     const { content, password, expiresIn, maxViews } = req.body;
//     const userId = req.user.uid;

//     // Calculate expiration date
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));

//     // Hash password if provided
//     let hashedPassword = null;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     const secret = new Secret({
//       id: uuidv4(),
//       content,
//       password: hashedPassword,
//       expiresAt,
//       maxViews,
//       userId,
//     });

//     await secret.save();

//     res.status(201).json({
//       id: secret.id,
//       expiresAt: secret.expiresAt,
//       content: secret.content
//     });
//   } catch (error) {
//     console.error('Error creating secret:', error);
//     res.status(500).json({ error: 'Failed to create secret' });
//   }
// });

// // Get a secret by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { password } = req.query;

//     const secret = await Secret.findOne({ id });
//     if (!secret) {
//       return res.status(404).json({ error: 'Secret not found' });
//     }

//     // Check if secret has expired
//     if (secret.expiresAt < new Date()) {
//       return res.status(410).json({ error: 'Secret has expired' });
//     }

//     // Check if max views reached
//     if (secret.views >= secret.maxViews) {
//       return res.status(410).json({ error: 'Secret has reached maximum views' });
//     }

//     // Verify password if required
//     if (secret.password) {
//       if (!password) {
//         return res.status(401).json({ error: 'Password required' });
//       }

//       const isValidPassword = await bcrypt.compare(password, secret.password);
//       if (!isValidPassword) {
//         return res.status(401).json({ error: 'Invalid password' });
//       }
//     }

//     // Increment view count
//     secret.views += 1;
//     await secret.save();

//     res.json({
//       content: secret.content,
//       expiresAt: secret.expiresAt,
//       views: secret.views,
//       maxViews: secret.maxViews,
//     });
//   } catch (error) {
//     console.error('Error retrieving secret:', error);
//     res.status(500).json({ error: 'Failed to retrieve secret' });
//   }
// });

// // Get user's secrets
// router.get('/user/secrets', async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const secrets = await Secret.find({ userId })
//       .select('id content expiresAt views maxViews createdAt')
//       .sort({ createdAt: -1 });

//     res.json(secrets);
//   } catch (error) {
//     console.error('Error retrieving user secrets:', error);
//     res.status(500).json({ error: 'Failed to retrieve user secrets' });
//   }
// });

// module.exports = router; 






const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Secret = require('../models/Secret');
const bcrypt = require('bcryptjs');

// Create a new secret
router.post('/', async (req, res) => {
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

// Get a secret by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.query;

    const secret = await Secret.findOne({ id });
    if (!secret) {
      return res.status(404).json({ error: 'Secret not found' });
    }

    // Check if secret has expired
    if (secret.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Secret has expired' });
    }

    // Check if max views reached
    if (secret.views >= secret.maxViews) {
      return res.status(410).json({ error: 'Secret has reached maximum views' });
    }

    // Verify password if required
    if (secret.password) {
      if (!password) {
        return res.status(401).json({ error: 'Password required' });
      }

      const isValidPassword = await bcrypt.compare(password, secret.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Increment view count
    secret.views += 1;
    await secret.save();

    res.json({
      content: secret.content,
      expiresAt: secret.expiresAt,
      views: secret.views,
      maxViews: secret.maxViews,
    });
  } catch (error) {
    console.error('Error retrieving secret:', error);
    res.status(500).json({ error: 'Failed to retrieve secret' });
  }
});

// Remove user secrets route since we don't have users anymore
module.exports = router;