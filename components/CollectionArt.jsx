import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useItem } from "../src/hooks/useItem";
import { deleteArt } from "../src/utils/api";

const CollectionArt = ({ art }) => {
  const [item, setItem] = useState(null);
  const { data, isLoading, error } = useItem(art.artpath);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  const handleDeleteArt = async () => {
    try {
      await deleteArt({ id: art.id });
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting collection:", error);
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
          <button onClick={handleDeleteArt}>Remove from collection</button>
        </div>
      ) : null}
    </>
  );
};

export default CollectionArt;
