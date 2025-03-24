import { useSearchParams } from "react-router-dom";

const NavBar = ({ noData, lastPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ ...Object.fromEntries(searchParams), page: page - 1 });
    }
  };

  const handleNextPage = () => {
    if (!noData && page + 1 < lastPage) {
      setSearchParams({ ...Object.fromEntries(searchParams), page: page + 1 });
    }
  };

  return (
    <div className="nav row">
      <button onClick={handlePrevPage} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button
        onClick={handleNextPage}
        disabled={noData || page + 1 >= lastPage}
      >
        Next
      </button>
    </div>
  );
};

export default NavBar;
