import React, { useEffect, useState } from "react";

import { JsonRpcSigner, ethers } from "ethers";

export const Dapp = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
  const connectWallet = async () => {
    try {
      let provider;
      if (window.ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed so are
        // only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider("");
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        setSigner(await provider.getSigner());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    signer?.address && setIsUserConnected(true);
  }, [signer]);

  return (
    <div>
      {!isUserConnected ? (
        <button onClick={() => connectWallet()}>Connect wallet</button>
      ) : (
        <section>
          <div>
            <label htmlFor="event-name">Event Name</label>
            <br />
            <input type="text" placeholder="Enter Event Name" />
          </div>
          <div>
            <label htmlFor="event-description">Description</label>
            <br />
            <textarea id="event-description" cols={30} rows={30}></textarea>
          </div>
          <button>Mint</button>
        </section>
      )}
    </div>
  );
};
