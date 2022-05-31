import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoaderButton from "../common/LoaderButton";
import { useFormFields } from "../lib/hooksLib";

export default function BillingForm({ loading, onSubmit }) {
  const stripe = useStripe();
  const elements = useElements();
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  loading = isProcessing || loading;

  function validateForm() {
    return (
      stripe &&
      elements &&
      fields.name !== "" &&
      fields.storage !== "" &&
      isCardComplete
    );
  }

  async function handleSubmitClick(event) {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  }

  return (
    <form className="BillingForm" onSubmit={handleSubmitClick}>
      <div className="mb-4">
        <label
          for="storage"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Storage
        </label>
        <input
          type="number"
          id="storage"
          min="0"
          value={fields.storage}
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          for="cardholder"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Cardholder&apos;s name
        </label>
        <input
          type="text"
          id="name"
          value={fields.name}
          onChange={handleFieldChange}
          placeholder="Name on the card"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Credit Card Info
      </label>
      <CardElement
        className="card-field mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(e) => setIsCardComplete(e.complete)}
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#495057",
              fontFamily: "'Open Sans', sans-serif",
            },
          },
        }}
      />
      <LoaderButton
        text="Purchase"
        isLoading={loading}
        disabled={!validateForm()}
      />
    </form>
  );
}
