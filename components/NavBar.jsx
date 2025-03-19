const NavBar = ({ handlePrevPage, page, handleNextPage, data, lastPage }) => {
  return (
    <div className="nav row">
      <button onClick={handlePrevPage} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={handleNextPage} disabled={!data || page + 1 >= lastPage}>
        Next
      </button>
    </div>
  );
};

export default NavBar;
