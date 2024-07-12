import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../emailService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateReferral = [
  body('firstname').notEmpty().withMessage('Name is required'),
  body('lastname').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phonenumber'),
  body('referralname').notEmpty().withMessage('Referral name is required'),
  body('referralemail').notEmpty().withMessage('Referral email is required'),
];

// Create a new referral
router.post('/', validateReferral, async (req, res) => {
  console.log('Received referral data:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, phonenumber, referralname, referralemail } = req.body;

  try {
    const newReferral = await prisma.referral.create({
      data: {
        firstname,
        lastname,
        email,
        phonenumber,
        referralname,
        referralemail,
      },
    });

      // Send referral email
      await sendEmail(
        referralemail,
        "You've been referred!",
        `Hello ${referralname},\n\nYou've been referred by ${firstname} ${lastname}. We'd love to connect with you about our services.\n\nBest regards,\nAccredian`
      );

    res.status(201).json(newReferral);
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get all referrals
router.get('/', async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.json(referrals);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;