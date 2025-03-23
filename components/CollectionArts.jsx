import { useState, useEffect } from "react";
import CollectionArt from "./CollectionArt";

const splitData = (data, columns) => {
  const dataArray = Array.from({ length: columns }, () => []);
  data.forEach((item, index) => {
    dataArray[index % columns].push(item);
  });
  return dataArray;
};

const CollectionArts = ({ isLoading, error, art }) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 900) {
        setColumns(3);
      } else if (window.innerWidth >= 600) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const splitResults = art ? splitData(art, columns) : [[]];

  return (
    <div className="resultContainer">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {!isLoading && art.length === 0 && <p>This collection is empty.</p>}

      <div className="resultColumns">
        {splitResults.map((column, colIndex) => (
          <div key={colIndex} className="resultColumn">
            {column.map((art) => (
              <CollectionArt key={art.id} art={art} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionArts;
