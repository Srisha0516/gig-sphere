const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret');

const createCheckoutSession = async (contractId, amount, clientEmail) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `GigSphere Contract #${contractId}`,
            },
            unit_amount: Math.round(amount * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`,
      customer_email: clientEmail,
      metadata: {
        contractId,
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe Error:', error);
    throw error;
  }
};

module.exports = { createCheckoutSession };
