import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { Auth } from "aws-amplify";

const Navbar = () => {
  const { userAuthenticated, setUserAuthenticated, userInfo } = useAppContext();
  const nav = useNavigate();
  const linkStyles =
    "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";

  const handleLogout = () => {
    Auth.signOut();
    setUserAuthenticated(false);
    nav("/login");
  };

  console.log(userInfo);

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <div className="flex md:order-2 items-center">
          <div className="text-sm mr-4 font-semibold">
            {!userAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b-2 border-gray-300 pb-10 hover:bg-gray-50 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  SignUp
                </Link>
                <Link
                  to="/login"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="block py-2 font-semibold pr-4 pl-3 text-red-700 border-b  hover:text-red-800 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Logout
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => nav("/buy-notes")}
            className="text-gray-800 hover:bg-purple-700 hover:text-white border-2 shadow-md transition  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0"
          >
            Buy Notes
          </button>
          <button
            data-collapse-toggle="mobile-menu-4"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-4"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
          id="mobile-menu-4"
        >
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? linkStyles +
                      " text-blue-700 underline underline-offset-2 decoration-2"
                    : linkStyles
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  isActive
                    ? linkStyles +
                      " text-blue-700 underline underline-offset-2 decoration-2"
                    : linkStyles
                }
              >
                Notes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? linkStyles +
                      " text-blue-700 underline underline-offset-2 decoration-2"
                    : linkStyles
                }
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
