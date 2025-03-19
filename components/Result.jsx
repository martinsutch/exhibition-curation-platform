import { Link } from "react-router-dom";

const Result = ({ item }) => {
  return (
    <Link to={`../../id/${item.source}${item.id}`}>
      <img className="resultBlock" src={item.smallImage} alt={item.title} />
    </Link>
  );
};

export default Result;
