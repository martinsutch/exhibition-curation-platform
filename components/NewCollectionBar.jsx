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
        <>
          <div className="left">
            <span>Name your new collection:</span>
            <input
              type="text"
              value={newCollectionTitle}
              onChange={(e) => {
                setNewCollectionTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <button
              onClick={() => {
                setExpanded(false);
                setNewCollectionTitle("");
              }}
              disabled={isWaiting}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCollection}
              disabled={isWaiting || !newCollectionTitle}
            >
              Create
            </button>
          </div>
        </>
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
