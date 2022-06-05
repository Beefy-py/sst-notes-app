import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useNavigate } from "react-router-dom";
import LoaderButton from "./../common/LoaderButton";
import { onError } from "./../lib/errorLib";
import { useFormFields } from "./../lib/hooksLib";
import Google from "./../icons/google";
import Facebook from "./../icons/facebook";

const Login = () => {
  const { setUserAuthenticated } = useAppContext();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      setUserAuthenticated(true);
      nav("/");
    } catch (err) {
      setLoading(false);
      onError(err);
    }
  };

  const handleGoogleSignIn = async () => {
    await Auth.federatedSignIn({
      provider: "Google",
    });
  };

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
          Your password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required=""
          onChange={handleFieldChange}
        />
      </div>

      <div className="flex item-center">
        <LoaderButton text="LogIn" isLoading={loading} />
        <button onClick={handleGoogleSignIn} className="ml-2" type="button">
          <Google />
        </button>
        <button
          onClick={() => console.log("Facebook Signin")}
          className="ml-3"
          type="button"
        >
          <Facebook />
        </button>
      </div>
    </form>
  );
};

export default Login;
