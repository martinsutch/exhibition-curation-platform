import { useState } from "react";
import { postCollection } from "../src/utils/api";

const NewCollectionBar = ({ setCollections }) => {
  const [expanded, setExpanded] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handleCreateCollection = async () => {
    setIsWaiting(true);
    const response = await postCollection(newCollectionTitle);
    if (response) {
      setExpanded(false);
      setNewCollectionTitle("");
      setCollections((prevCollections) => [...prevCollections, response[0]]);
      setIsWaiting(false);
    }
  };

  return (
    <div className="collectionRow">
      {expanded ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateCollection();
          }}
          className="row gap pushApart"
        >
          <div className="left">
            <label htmlFor="collectionName">Name your new collection:</label>
            <input
              id="collectionName"
              type="text"
              value={newCollectionTitle}
              onChange={(e) => setNewCollectionTitle(e.target.value)}
              disabled={isWaiting}
            />
          </div>
          <div className="row gap">
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                setNewCollectionTitle("");
              }}
              disabled={isWaiting}
            >
              Cancel
            </button>
            <button type="submit" disabled={isWaiting || !newCollectionTitle}>
              Create
            </button>
          </div>
        </form>
      ) : (
        <>
          <span>Start a new collection</span>
          <button
            onClick={() => {
              setExpanded(true);
            }}
          >
            +
          </button>
        </>
      )}
    </div>
  );
};

export default NewCollectionBar;
