import Stripe from "stripe";
import handler from "../util/handler";
import calculateCost from "../util/cost";

export const main = handler(async (event) => {
  const { storage, source, method } = JSON.parse(event.body);

  console.log(method);

  const amount = calculateCost(storage);
  const description = "Scrath Charge";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return {
    status: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
});
