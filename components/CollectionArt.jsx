import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useItem } from "../src/hooks/useItem";
import { deleteArt } from "../src/utils/api";

const CollectionArt = ({ art }) => {
  const [item, setItem] = useState(null);
  const { data, isLoading, error } = useItem(art.artpath);
  const [deleted, setDeleted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  const handleDeleteArt = async () => {
    setIsWaiting(true);
    setErrorMessage("");
    try {
      await deleteArt({ id: art.id });
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting artwork:", error);
      setErrorMessage("Failed to delete artwork. Please try again.");
    } finally {
      setIsWaiting(false);
    }
  };

  if (deleted) return null;

  return (
    <>
      {item ? (
        <div className="resultBlock">
          <Link to={`../../id/${item.source}${item.id}`}>
            <img
              className="resultBlock"
              src={item.smallImage}
              alt={item.title}
            />
          </Link>
          <div className="collectionRow gap">
            <span>{item.title}</span>
            <button onClick={handleDeleteArt} disabled={isWaiting}>
              Remove from collection
            </button>
          </div>
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </>
  );
};

export default CollectionArt;
