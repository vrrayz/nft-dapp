import { Contract } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { EventDetails } from "../types";

interface Props {
  contract: Contract
}

export const EventAttendee = ({ contract }: Props) => {
  const [eventDetails, setEventDetails] = useState<EventDetails>();
  const contractDetails = useCallback(async () => {
    const name = await contract.name();
    const description = await contract.description();
    const symbol = await contract.symbol();

    setEventDetails({ name, description, symbol });
  }, [contract]);

  const mintNft = async () => {
    const nftMetadataHash = "QmNqs5rj9RNFTf16fFMwz8ihEodBwTzwtAeX87rKop3DQo"

    const tokenUri = `https://gateway.pinata.cloud/ipfs/${nftMetadataHash}`
    const tx = await contract.mintNFT(tokenUri)
    await tx.wait()
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${tx.hash}`)
  }

  useEffect(() => {
    contractDetails();
  }, [contractDetails]);

  return (
    <div>
      <p>
        Event Contract: <b>{contract.target as string}</b>
      </p>
      <p>
        Event Name: <b>{eventDetails?.name}</b>
      </p>
      <p>
        Event Symbol: <b>{eventDetails?.symbol}</b>
      </p>
      <p>
        Event Description: <b>{eventDetails?.description}</b>
      </p>
      <button onClick={() => mintNft()}>Mint Event Nft</button>
    </div>
  );
};
