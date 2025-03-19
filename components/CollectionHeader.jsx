import { useNavigate } from "react-router-dom";
import { deleteCollection } from "../src/utils/api";

const CollectionHeader = ({ collection }) => {
  const navigate = useNavigate();

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection({ id: collection.id });
      navigate("/account");
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <div className="block highlight column">
      <span>{collection.title}</span>
      <button onClick={handleDeleteCollection}>Delete collection</button>
    </div>
  );
};

export default CollectionHeader;
