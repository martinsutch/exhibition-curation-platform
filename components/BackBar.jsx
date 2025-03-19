import { useNavigate } from "react-router-dom";

const BackBar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history?.length && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="nav row">
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default BackBar;
