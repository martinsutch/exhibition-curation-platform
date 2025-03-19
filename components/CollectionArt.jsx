import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useItem } from "../src/hooks/useCollections";

const CollectionArt = ({ art }) => {
  const [item, setItem] = useState(null);
  const { data, isLoading, error } = useItem(art.artpath);

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  return (
    <>
      {item ? (
        <Link to={`../../id/${item.source}${item.id}`}>
          <img className="resultBlock" src={item.smallImage} alt={item.title} />
        </Link>
      ) : null}
    </>
  );
};

export default CollectionArt;
