import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addArt } from "../src/utils/api";

const CollectionBar = ({ collection, item }) => {
  const navigate = useNavigate();
  const [isPostable, setIsPostable] = useState(item !== undefined);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleView = () => {
    navigate(`../../collection/${collection.id}`);
  };

  const handleAdd = async () => {
    setIsWaiting(true);
    try {
      const response = await addArt({
        collectionId: collection.id,
        artPath: `${item.source}${item.id}`,
      });
      if (response) {
        setIsPostable(false);
        setIsWaiting(false);
      }
    } catch (err) {
      console.log(err);
      setIsWaiting(false);
    }
  };

  return (
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
  );
};

export default CollectionBar;
