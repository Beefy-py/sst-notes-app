import React, { useState } from "react";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "../lib/errorLib";
import { config } from "../config";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BillingForm from "./BillingForm";

export default function BuyNotes() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe(config.STRIPE_KEY);
  async function billUser(details) {
    return API.post("notes", "/billing", {
      body: details,
    });
  }
  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      onError(error);
      return;
    }

    setLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert("Your card has been charged successfully!");
      nav("/");
    } catch (e) {
      onError(e);
      setLoading(false);
    }
  }

  return (
    <div className="w-4/5 mx-auto">
      <Elements
        stripe={stripePromise}
        fonts={[
          {
            cssSrc:
              "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
          },
        ]}
      >
        <BillingForm loading={loading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
