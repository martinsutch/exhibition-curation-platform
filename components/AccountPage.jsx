import { useEffect, useState } from "react";
import AccountBox from "./AccountBox";
import AccountCollections from "./AccountCollections";
import RequiresSignIn from "./RequiresSignIn";

const AccountPage = () => {
  const [columns, setColumns] = useState(1);
  const [userId, setUserId] = useState();

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

  const renderCollectionSection = () => {
    return (
      <RequiresSignIn userId={userId}>
        <AccountCollections userId={userId} />
      </RequiresSignIn>
    );
  };

  return (
    <div className="page">
      <div className="resultColumns">
        <div className={`resultColumn ${columns !== 1 ? "maxW" : null}`}>
          <AccountBox setUserId={setUserId} userId={userId} />
          {columns === 1 ? <>{renderCollectionSection()}</> : null}
        </div>
        {columns !== 1 ? (
          <div className="resultColumn">{renderCollectionSection()}</div>
        ) : null}
      </div>
    </div>
  );
};

export default AccountPage;
