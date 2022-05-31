import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../common/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const nav = useNavigate();
  const [newUser, setNewUser] = useState(null);
  const { setUserAuthenticated } = useAppContext();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setLoading(false);
      setNewUser(newUser);
    } catch (e) {
      if (e.message === "An account with the given email already exists.") {
        await Auth.resendSignUp({
          username: fields.email,
        });
        setLoading(false);
        setNewUser("newUser");
      }
      onError(e);
      setLoading(false);
    }
  }
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      setUserAuthenticated(true);
      nav("/");
    } catch (e) {
      onError(e);
      setLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit} className="w-3/4 mx-auto my-8">
        <div className="mb-6">
          <label
            for="confirmationCode"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Your code
          </label>
          <input
            type="text"
            id="confirmationCode"
            name="confirmationCode"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0000"
            required=""
            onChange={handleFieldChange}
          />
        </div>

        <LoaderButton text="Submit" isLoading={loading} />
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit} className="w-3/4 mx-auto my-8">
        <div className="mb-6">
          <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@flowbite.com"
            required=""
            onChange={handleFieldChange}
          />
        </div>
        <div className="mb-6">
          <label
            for="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required=""
            onChange={handleFieldChange}
          />
        </div>{" "}
        <div className="mb-6">
          <label
            for="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required=""
            onChange={handleFieldChange}
          />
        </div>
        <LoaderButton text="SignUp" isLoading={loading} />
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
