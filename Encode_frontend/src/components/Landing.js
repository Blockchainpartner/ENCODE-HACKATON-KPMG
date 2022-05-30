import React from "react";
import WalletsModal from "./modals/WalletsModal";
import ConnectStarknetWallet from "./ConnectStarknetWallet";

const WalletInput = () => {
  return (
    <div className="box mt-8 flex items-center justify-between w-auto xl:w-5/6">
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
          <span className="w-auto">
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
