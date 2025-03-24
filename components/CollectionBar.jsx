import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addArt } from "../src/utils/api";

const CollectionBar = ({ collection, item }) => {
  const navigate = useNavigate();
  const [isPostable, setIsPostable] = useState(item !== undefined);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleView = () => {
    navigate(`../../collection/${collection.id}`);
  };

  const handleAdd = async () => {
    setIsWaiting(true);
    setErrorMessage("");

    try {
      const response = await addArt({
        collectionId: collection.id,
        artPath: `${item.source}${item.id}`,
      });

      if (response) {
        setIsPostable(false);
      }
    } catch (error) {
      setErrorMessage("Failed to add to collection. Please try again.");
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <>
      <div className="collectionRow">
        <span>{collection.title}</span>
        <span>
          {isPostable ? (
            <button onClick={handleAdd} disabled={isWaiting}>
              Add
            </button>
          ) : (
            <button onClick={handleView}>View</button>
          )}
        </span>
      </div>
      <span>{errorMessage}</span>
    </>
  );
};

export default CollectionBar;
