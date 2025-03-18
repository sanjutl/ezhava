import Stripe from "stripe"
import dotenv from "dotenv"
dotenv.config()
const stripe = new Stripe(process.env.SECRET_KEY);

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
    try {
        const { userId, profileId } = req.params;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // 10 pounds (amount in pence)
            currency: 'gbp',
            payment_method_types: ['card'],
            metadata: {
                userId,
                profileId
            }
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json(   { error: error.message });
    }
};

export { createPaymentIntent };
