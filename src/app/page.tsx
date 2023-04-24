"use client";

import React, { useState, useMemo } from "react";

const random: (min: number, max: number) => number = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const Home: React.FC = () => {
  const [count, setCount] = useState(0);
  const minCountValueToShowMessage = useMemo(() => random(0, 5), []);

  return (
    <div className="flex justify-center">
      <div className="text-center">
        <br />
        <p>Hello world</p>
        <p>Counter: {count}</p>
        <br />
        <button
          className="py-2 px-3 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-md shadow focus:outline-none"
          onClick={() => setCount(count + 1)}
        >
          Count
        </button>
        <br />
        <br />
        {count >= minCountValueToShowMessage ? (
          <p>El contador cuenta, sí señor</p>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
