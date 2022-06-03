import React, { useState } from "react";
import { API, Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "../lib/errorLib";
import { config } from "../config";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BillingForm from "./BillingForm";

export default function BuyNotes() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mope");

  const stripePromise = loadStripe(config.STRIPE_KEY);
  async function billUser(details) {
    return API.post("notes", "/billing", {
      body: details,
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
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
      <div className="mt-2 mb-6 border-2 border-gray-400 rounded-lg p-5">
        <p className="text-gray-700 inline-block">Payment method:</p>
        <ul className="ml-4  inline-flex text-sm text-center text-gray-500 dark:text-gray-400">
          <li className="mr-2">
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`inline-block py-2 font-semibold px-4 ${
                paymentMethod === "stripe"
                  ? "text-white bg-blue-600 rounded-lg"
                  : "rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
              aria-current="page"
            >
              Card
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setPaymentMethod("mope")}
              className={`inline-block py-2 font-semibold px-4 ${
                paymentMethod === "mope"
                  ? "text-white bg-blue-600 rounded-lg"
                  : "rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              Mope
            </button>
          </li>
        </ul>
      </div>
      <Elements
        stripe={stripePromise}
        fonts={[
          {
            cssSrc:
              "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
          },
        ]}
      >
        <BillingForm
          loading={loading}
          method={paymentMethod}
          onSubmit={handleFormSubmit}
        />
      </Elements>
    </div>
  );
}
