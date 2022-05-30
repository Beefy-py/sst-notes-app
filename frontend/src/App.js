import React from "react";
import Navbar from "./layout/Navbar";
import Home from "./container/Home";
import { Routes, Route } from "react-router-dom";
import NotFound from "./container/NotFound";

const App = () => {
  return (
    <div className="my-20 mx-auto w-2/4">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />;
      </Routes>
    </div>
  );
};

export default App;
