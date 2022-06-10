import Tech from "../components/Tech";
import Landing from "../components/Landing";
import Bridge from "../components/Bridge"
import { useWeb3React } from "@web3-react/core";

import { useStarknet } from '@starknet-react/core';

export default function Home() {
  const context = useWeb3React();
  const { active } = context;
  const { account } = useStarknet()

  return (
    <div className="flex flex-col justify-center">
      {/* {active && account ? (<div>
         */}
      {active ? (<div>
        <Bridge />
      </div>
      ) : (
        <div className="flex flex-col justify-center">
          <Landing />
          <Tech />
        </div>
      )}
    </div>
  );
}