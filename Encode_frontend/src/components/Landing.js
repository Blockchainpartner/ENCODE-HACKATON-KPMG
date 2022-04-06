import React, { useState } from "react";
import WalletsModal from "./modals/WalletsModal";
import ConnectWallet from "./ConnectStarknetWallet"
import ConnectStarknetWallet from "./ConnectStarknetWallet";

const WalletInput = () => {
  const [address, setAddress] = useState("");
  return (
    <div className="box my-8 flex items-center justify-between w-full xl:w-2/3">
      {/* <ConnectStarknetWallet /> */}
      <WalletsModal />
      <ConnectStarknetWallet />
    </div>
  );
};

const Landing = () => {
  return (
    <div className="w-full m-auto grid grid-cols-2 mt-12 xl-mt-8 2xl:mt-0">
      {/* LEFT SIDE */}
      <div className="flex justify-start items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-5xl xl:text-6xl 2xl:text-7xl">
            {"Stake and bridge your tokens to L2"}
          </h1>
          <span className="w-2/3">
            <p className="text-subtxt text-lg xl:text-xl font-normal mt-5">
              {
                "Generate rewards while bridging to L2 with Vaulti!"
              }
            </p>
          </span>
          <WalletInput />
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center">
        <img src="/home-bg.png" alt="Vaulti - Illustration" />
      </div>
    </div>
  );
};

export default Landing;
