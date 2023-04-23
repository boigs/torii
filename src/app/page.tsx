"use client";

import React, { useState } from "react";

const Home: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Boigs</h1>
      <p>Hello world</p>
      <p>Boig counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
};

export default Home;
