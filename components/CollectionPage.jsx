import { useParams } from "react-router-dom";
import CollectionHeader from "./CollectionHeader";
import { getArt } from "../src/utils/api";
import { useEffect, useState } from "react";
import CollectionArts from "./CollectionArts";

const CollectionPage = () => {
  const { collection } = useParams();
  const [art, setArt] = useState([]);
  const [title, setTitle] = useState("Your collection");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArt(collection);
        if (data) {
          setArt(data.art);
          setTitle(data.collectionTitle);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [collection]);

  return (
    <div className="page">
      <CollectionHeader collection={{ id: collection, title }} />
      <CollectionArts art={art} isLoading={isLoading} error={error} />
    </div>
  );
};

export default CollectionPage;
