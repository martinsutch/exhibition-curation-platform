import { useEffect, useState } from "react";
import AccountBox from "./AccountBox";
import AccountCollections from "./AccountCollections";

const AccountPage = () => {
  const [columns, setColumns] = useState(1);

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

  return (
    <div className="page">
      <div className="resultColumns">
        <div className={`resultColumn ${columns !== 1 ? "maxW" : null}`}>
          <AccountBox />
          {columns === 1 ? <AccountCollections /> : null}
        </div>
        {columns !== 1 ? (
          <div className="resultColumn">
            <AccountCollections />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AccountPage;
