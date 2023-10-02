import { NextApiRequest, NextApiResponse } from 'next';
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {amount, currency, email, name} = req.body;
    // console.log('NEXT_PUBLIC_STRIPE_SECRET_KEY', process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
    // console.log(amount, currency, email, name)
    let customerID = ''
    const customer = await stripe.customers.search({
      query: `email:'${email}'`,
    });
    if (customer.data.length === 0) {
    const customerData = await stripe.customers.create({
        email,
        name, 
      });
      customerID = customerData.id;
    } else {
      customerID = customer.data[0].id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerID,
      description: "List clean payment",
    });
    res.status(200).json({
      success: true,
      message: "Transaction successfully done!",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    // console.error(error);
    res.json({success: false, message: "Transaction failed!"});
  }
}
