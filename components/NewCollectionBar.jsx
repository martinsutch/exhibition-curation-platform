import { useState } from "react";
import { postCollection } from "../src/utils/api";

const NewCollectionBar = ({ setCollections, collections }) => {
  const [expanded, setExpanded] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateCollection = async () => {
    setIsWaiting(true);
    setErrorMessage("");
    const trimmedTitle = newCollectionTitle.trim();
    if (!trimmedTitle) {
      setErrorMessage("Collection title cannot be blank.");
      setIsWaiting(false);
      return;
    }
    if (
      collections.some(
        (collection) =>
          collection.title.toLowerCase() === trimmedTitle.toLowerCase()
      )
    ) {
      setErrorMessage("A collection with this title already exists.");
      setIsWaiting(false);
      return;
    }
    try {
      const response = await postCollection(trimmedTitle);
      if (response) {
        setExpanded(false);
        setNewCollectionTitle("");
        setCollections((prevCollections) => [...prevCollections, response[0]]);
      }
    } catch (error) {
      setErrorMessage("Failed to create collection. Please try again.");
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <>
      <div className="collectionRow">
        {expanded ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateCollection();
            }}
            className="row gap pushApart"
          >
            <div className="inputRow">
              <label className="otherLabel" htmlFor="collectionName">
                Name your new collection:
              </label>
              <input
                className="otherInput"
                id="collectionName"
                type="text"
                value={newCollectionTitle}
                onChange={(e) => setNewCollectionTitle(e.target.value)}
                disabled={isWaiting}
              />
            </div>
            <div className="row gap wrap">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setNewCollectionTitle("");
                  setErrorMessage("");
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
      <span>{errorMessage}</span>
    </>
  );
};

export default NewCollectionBar;
