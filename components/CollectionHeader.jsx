import { useNavigate } from "react-router-dom";
import { deleteCollection, patchCollection } from "../src/utils/api";
import { useState } from "react";

const CollectionHeader = ({ collection, setTitle }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState(
    collection.title
  );
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection({ id: collection.id });
      navigate("/account");
    } catch (error) {
      setErrorMessage("Failed to delete collection. Please try again.");
    }
  };

  const handlePatchCollection = async () => {
    setIsWaiting(true);
    setErrorMessage("");
    const trimmedTitle = newCollectionTitle.trim();
    if (!trimmedTitle) {
      setErrorMessage("Collection title cannot be blank.");
      setIsWaiting(false);
      return;
    }
    if (trimmedTitle.toLowerCase() === collection.title.toLowerCase()) {
      setErrorMessage("Collection title must be different.");
      setIsWaiting(false);
      return;
    }
    try {
      const response = await patchCollection({
        id: collection.id,
        title: trimmedTitle,
      });
      if (response) {
        setExpanded(false);
        setTitle(trimmedTitle);
      }
    } catch (error) {
      setErrorMessage("Failed to update title. Please try again.");
    } finally {
      setIsWaiting(false);
    }
  };

  const handleBeginEdit = () => {
    setNewCollectionTitle(collection.title);
    setExpanded(true);
  };

  return (
    <div className="block highlight column">
      <h2>{collection.title}</h2>
      <div className="row gap middle otherLabel">
        {expanded ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePatchCollection();
            }}
            className="row gap pushApart "
          >
            <div className="inputRow">
              <label className="otherLabel" htmlFor="collectionName">
                Rename your collection:
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
            <div className="row gap">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setErrorMessage("");
                }}
                disabled={isWaiting}
              >
                Cancel
              </button>
              <button type="submit" disabled={isWaiting || !newCollectionTitle}>
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <button onClick={handleBeginEdit}>Edit title</button>
            <button onClick={handleDeleteCollection}>Delete collection</button>
          </>
        )}
      </div>
      <span>{errorMessage}</span>
    </div>
  );
};

export default CollectionHeader;
