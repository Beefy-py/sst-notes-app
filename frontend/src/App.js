import React, { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import Home from "./container/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./container/Login";
import SignUp from "./container/SignUp";
import NotFound from "./container/NotFound";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib";
import NewNote from "./container/NewNote";
import Notes from "./container/Notes";
import Note from "./container/Note";
import Settings from "./container/Settings";
import BuyNotes from "./container/BuyNotes";

const App = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    onLoad();
    getUser();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      setUserAuthenticated(true);
    } catch (err) {
      if (err !== "No current user") {
        onError(err);
      }
    }
    setIsAuthenticating(false);
  }

  const getUser = async () => {
    const user = await Auth.currentUserInfo();
    if (user) setUserInfo(user.attributes);
  };

  return (
    <div className="my-20 mx-auto w-2/4">
      {" "}
      <AppContext.Provider
        value={{ userInfo, userAuthenticated, setUserAuthenticated }}
      >
        <Navbar />

        {!isAuthenticating ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />{" "}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/new" element={<NewNote />} />
            <Route path="/notes/:id" element={<Note />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/buy-notes" element={<BuyNotes />} />
            <Route path="*" element={<NotFound />} />;
          </Routes>
        ) : (
          "authenticating. . ."
        )}
      </AppContext.Provider>
    </div>
  );
};

export default App;
