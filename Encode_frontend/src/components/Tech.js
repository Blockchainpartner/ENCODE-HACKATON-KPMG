import React from "react";

const Tech = () => {
  return (
    <div className="flex flex-col items-start justify-center flex-grow mt-12 mb-12 xl:mt-0">
      <p>{"Built around"}</p>
      <div className="flex items-center justify-start gap-10 ">
        <img className="h-10" src="/tech/StarkNet_logo.png" alt="Built around" />
        <img src="/tech/argentx.svg" alt="Built around" />
        <img src="/tech/argent.svg" alt="Built around" />
      </div>
    </div>
  );
};

export default Tech;
