import { useState, useEffect } from "react";
import Result from "./Result";

const splitData = (data, columns) => {
  const dataArray = Array.from({ length: columns }, () => []);
  data.forEach((item, index) => {
    dataArray[index % columns].push(item);
  });
  return dataArray;
};

const Results = ({ isLoading, error, lastPage, page, data }) => {
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

  const splitResults = data ? splitData(data, columns) : [[]];

  return (
    <div className="resultContainer">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {lastPage && page + 1 === lastPage && <p>No more results</p>}

      <div className="resultColumns">
        {splitResults.map((column, colIndex) => (
          <div key={colIndex} className="resultColumn">
            {column.map((item) => (
              <Result key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
