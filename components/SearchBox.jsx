const SearchBox = ({ searchValue, handleSearchChange, handleSearch }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="block highlight column"
    >
      <input
        className="search"
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search collections..."
        onSubmit={handleSearch}
      />
      <div className="card">
        <button type="submit">Search</button>
      </div>
    </form>
  );
};

export default SearchBox;
