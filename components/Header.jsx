import exhiBit from "/exhiBit.svg";
import accountFilled from "/accountFilled.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="cover"></div>
      <div className="header">
        <Link to={"../.."} className="row">
          <img src={exhiBit} className="logo" alt="ExhiBit logo" />
          <h1 className="title">ExhiBit</h1>
        </Link>
        <Link to={"../../account"} className="row">
          <img src={accountFilled} className="account" alt="Account" />
        </Link>
      </div>
    </>
  );
};

export default Header;
