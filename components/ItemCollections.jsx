import { useEffect, useState } from "react";
import NewCollectionBar from "./NewCollectionBar";
import CollectionBar from "./collectionBar";
import { getCollections } from "../src/utils/api";

const ItemCollections = ({ item }) => {
  const [collections, setCollections] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      setIsWaiting(true);
      try {
        const fetchedCollections = await getCollections();
        setCollections(fetchedCollections);
      } catch (error) {
        setErrorMessage("Error fetching collections. Please reload the page.");
      } finally {
        setIsWaiting(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="block column">
      <h2>Collections</h2>
      <span>{errorMessage}</span>
      {isWaiting ? (
        <span>Loading your collections...</span>
      ) : collections.length === 0 ? (
        <span>You have no collections yet</span>
      ) : (
        collections.map((collection) => {
          return (
            <CollectionBar
              key={collection.id}
              collection={collection}
              item={item}
            />
          );
        })
      )}

      <NewCollectionBar
        setCollections={setCollections}
        collections={collections}
      />
    </div>
  );
};

export default ItemCollections;
