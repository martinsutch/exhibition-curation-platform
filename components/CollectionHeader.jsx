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

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection({ id: collection.id });
      navigate("/account");
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleBeginEdit = () => {
    setNewCollectionTitle(collection.title);
    setExpanded(true);
  };

  const handlePatchCollection = async () => {
    setIsWaiting(true);
    const response = await patchCollection({
      id: collection.id,
      title: newCollectionTitle,
    });
    if (response) {
      setExpanded(false);
      setIsWaiting(false);
      setTitle(newCollectionTitle);
    }
  };

  return (
    <div className="block highlight column">
      <span>{collection.title}</span>
      {expanded ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePatchCollection();
          }}
          className="row gap pushApart"
        >
          <div className="left">
            <label htmlFor="collectionName">Rename your collection:</label>
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
        <button onClick={handleBeginEdit}>Edit title</button>
      )}
      <button onClick={handleDeleteCollection}>Delete collection</button>
    </div>
  );
};

export default CollectionHeader;
