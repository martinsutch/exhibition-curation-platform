import { useEffect, useState } from "react";
import NewCollectionBar from "./NewCollectionBar";
import CollectionBar from "./collectionBar";
import { getCollections } from "../src/utils/api";

const AccountCollections = () => {
  const [collections, setCollections] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsWaiting(true);
      try {
        const fetchedCollections = await getCollections();
        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setIsWaiting(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="block column">
      <span>Collections</span>
      {isWaiting ? (
        <span>Loading your collections...</span>
      ) : collections.length === 0 ? (
        <span>You have no collections yet</span>
      ) : (
        collections.map((collection) => {
          return <CollectionBar key={collection.id} collection={collection} />;
        })
      )}

      <NewCollectionBar setCollections={setCollections} />
    </div>
  );
};

export default AccountCollections;
