import { useState } from "react";

const SearchBox = ({
  searchValue,
  handleSearchChange,
  handleSearch,
  tally,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  order,
  setOrder,
  displayLength,
  noData,
}) => {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [sortExpanded, setSortExpanded] = useState(false);
  const [draftFilters, setDraftFilters] = useState({ ...filters });
  const [draftSortBy, setDraftSortBy] = useState(sortBy);
  const [draftOrder, setDraftOrder] = useState(order);

  const sortOptions = ["title", "period", "repository"];

  const handleFilterChange = (key, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilter = () => {
    setFilters(draftFilters);
    setFilterExpanded(false);
  };

  const applySort = () => {
    setSortBy(draftSortBy);
    setOrder(draftOrder);
    setSortExpanded(false);
  };

  const filterKeys = Object.keys(filters).filter((key) => filters[key]);
  const filterMessage =
    filterKeys.length > 0
      ? `Filtered by ${filterKeys.join(" and ")}.`
      : "Showing all results.";
  const displayMessage = `Displaying ${displayLength} results. ${filterMessage} Sorted by ${sortBy}.`;

  const renderDropdown = (label, key) => {
    const tallyOptions = new Map(tally[key] || []);
    if (filters[key] && !tallyOptions.has(filters[key])) {
      tallyOptions.set(filters[key], 0);
    }

    const options = Array.from(tallyOptions)
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => (
        <option key={value} value={value}>
          {value} {count > 0 ? `(${count})` : ""}
        </option>
      ));

    return (
      <div>
        <label htmlFor={key}>{label} </label>
        <select
          id={key}
          value={draftFilters[key] || ""}
          onChange={(e) => handleFilterChange(key, e.target.value)}
        >
          <option value="">All</option>
          {options}
        </select>
      </div>
    );
  };

  return (
    <div className="block highlight column">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
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
      <div className="collectionRow">
        <div></div>
        {filterExpanded || sortExpanded ? null : (
          <>
            <span>{displayMessage}</span>
            <div className="gap">
              <button
                onClick={() => {
                  setFilterExpanded(true);
                }}
                disabled={noData}
              >
                Filter
              </button>
              <button
                onClick={() => {
                  setSortExpanded(true);
                }}
                disabled={noData}
              >
                Sort
              </button>
            </div>
          </>
        )}
        {filterExpanded ? (
          <div>
            <button onClick={applyFilter}>Apply filter</button>{" "}
          </div>
        ) : null}
        {sortExpanded ? (
          <div>
            <button onClick={applySort}>Apply sort</button>{" "}
          </div>
        ) : null}
      </div>
      {filterExpanded ? (
        <div>
          {renderDropdown("Type", "type")}
          {renderDropdown("Location", "location")}
          {renderDropdown("Creator", "creator")}
          {renderDropdown("Period", "period")}
          {renderDropdown("Repository", "repository")}
        </div>
      ) : null}
      {sortExpanded ? (
        <div>
          <label htmlFor="sort">Sort by </label>
          <select
            id="sort"
            value={draftSortBy}
            onChange={(e) => setDraftSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="period">Period</option>
            <option value="repository">Repository</option>
          </select>
          <select
            value={draftOrder}
            onChange={(e) => setDraftOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBox;
