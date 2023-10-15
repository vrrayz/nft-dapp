import React, { useEffect, useState } from "react";

import { ContractFactory, JsonRpcSigner, ethers } from "ethers";
import { abi } from "../data/abi";
import { bytecode } from "../data/bytecode";
import { SEPOLIA_NETWORK } from "../data/network";

interface EventDetails {
  name?: string;
  symbol?: string;
  description?: string;
}

export const Dapp = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
  const [nftDetails, setNftDetails] = useState<EventDetails>({});
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
        provider = new ethers.BrowserProvider(window.ethereum, SEPOLIA_NETWORK);

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        setSigner(await provider.getSigner());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNft = async () => {
    const contractFactory = new ContractFactory(abi,bytecode,signer)
    const contract = await contractFactory.deploy(nftDetails.name, nftDetails.symbol, nftDetails.description)
    // The contract address comes out from contract.target
    console.log('The contract address === ',await contract.getAddress())
    console.log("The nft details ", nftDetails);
  };

  useEffect(() => {
    signer?.address && setIsUserConnected(true);
    console.log("The user address is ", signer?.address);
  }, [signer]);

  const shouldDisable = (eventDetails: EventDetails) =>
    !(eventDetails.name && eventDetails.name.length >= 4 && eventDetails.symbol && eventDetails.description);

  const setEventDetails = (eventDetails: EventDetails) => {
    setNftDetails(eventDetails);
    if (eventDetails.name && eventDetails.name.length >= 4) {
      eventDetails.symbol = eventDetails.name.substring(0, 4);
    }
  };

  return (
    <div>
      {!isUserConnected ? (
        <button onClick={() => connectWallet()}>Connect wallet</button>
      ) : (
        <section>
          <div>
            <label htmlFor="event-name">Event Name</label>
            <br />
            <input
              type="text"
              placeholder="Enter Event Name"
              onChange={(e) =>
                setEventDetails({ ...nftDetails, name: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="event-description">Description</label>
            <br />
            <textarea
              id="event-description"
              cols={30}
              rows={30}
              onChange={(e) =>
                setEventDetails({ ...nftDetails, description: e.target.value })
              }
            ></textarea>
          </div>
          <button
            onClick={() => createNft()}
            disabled={shouldDisable(nftDetails)}
          >
            Mint
          </button>
        </section>
      )}
    </div>
  );
};
