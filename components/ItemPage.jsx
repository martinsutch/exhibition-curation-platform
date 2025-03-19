import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemImage from "./ItemImage";
import ItemDetails from "./ItemDetails";
import { useItem } from "../src/hooks/useCollections";
import BackBar from "./backBar";
import ItemCollections from "./ItemCollections";

const ItemPage = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState(1);
  const [item, setItem] = useState(null);
  const { data, isLoading, error } = useItem(id);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 600) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  return (
    <div className="page">
      <BackBar />
      <div className="resultColumns">
        {columns !== 1 ? (
          <div className="resultColumn">
            <ItemImage item={item} />
          </div>
        ) : null}
        <div className={`resultColumn ${columns !== 1 ? "maxW" : null}`}>
          {columns === 1 ? <ItemImage item={item} /> : null}
          <ItemDetails item={item} />
          <ItemCollections item={item} />
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
