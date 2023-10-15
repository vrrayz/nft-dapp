import React from "react";
import { EventDetails } from "../types";

interface EventCreatorProps {
  setEventDetails: (details: EventDetails) => void;
  nftDetails: EventDetails;
  createNft: () => Promise<void>;
}
export const EventCreator = ({
  setEventDetails,
  nftDetails,
  createNft,
}: EventCreatorProps) => {
    const shouldDisable = (eventDetails: EventDetails) =>
    !(eventDetails.name && eventDetails.name.length >= 4 && eventDetails.symbol && eventDetails.description);
  return (
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
      <button onClick={() => createNft()} disabled={shouldDisable(nftDetails)}>
        Create Event
      </button>
    </section>
  );
};
