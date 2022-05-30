import React from "react";

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl my-8 text-gray-600">
        {" "}
        <span className="font-bold block text-red-700">404</span>{" "}
        <span className="font-semibold"> This Page Does Not Exist!</span>
      </h1>
    </div>
  );
};

export default NotFound;
