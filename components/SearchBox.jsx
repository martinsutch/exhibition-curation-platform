import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchBox = ({
  tally,
  displayLength,
  noData,
  setLastPage,
  isLoading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [sortExpanded, setSortExpanded] = useState(false);

  const searchValue = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy") || "repository";
  const order = searchParams.get("order") || "asc";
  const filters = Object.fromEntries(
    [...searchParams.entries()].filter(
      ([key]) => !["q", "page", "sortBy", "order"].includes(key)
    )
  );

  const [draftSearchValue, setDraftSearchValue] = useState(searchValue);
  const [draftFilters, setDraftFilters] = useState({ ...filters });
  const [draftSortBy, setDraftSortBy] = useState(sortBy);
  const [draftOrder, setDraftOrder] = useState(order);

  const handleFilterChange = (key, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilter = () => {
    setSearchParams({
      ...Object.fromEntries(
        Object.entries(draftFilters).filter(([_, value]) => value !== "")
      ),
      q: searchValue,
      page: "1",
      sortBy,
      order,
    });
    setFilterExpanded(false);
  };

  const applySort = () => {
    setSearchParams({
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      ),
      q: searchValue,
      page: "1",
      sortBy: draftSortBy,
      order: draftOrder,
    });
    setSortExpanded(false);
  };

  const handleSearch = () => {
    setSearchParams({
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      ),
      q: draftSearchValue,
      page: "1",
      sortBy,
      order,
    });
    setLastPage(Infinity);
  };

  const filterKeys = Object.keys(filters).filter((key) => filters[key]);
  const filterMessage =
    filterKeys.length > 0
      ? `Filtered by ${filterKeys.join(" and ")}.`
      : "No filters applied.";
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
      <div className="inputRow">
        <label className="otherLabel" htmlFor={key}>
          {label}{" "}
        </label>
        <select
          id={key}
          value={draftFilters[key] || ""}
          onChange={(e) => handleFilterChange(key, e.target.value)}
          className="otherInput"
        >
          <option value="">All</option>
          {options}
        </select>
      </div>
    );
  };

  return (
    <div className="block highlight column">
      {noData && !isLoading ? (
        <p className="otherLabel">
          Welcome to <strong>Exhibit</strong>, your gateway to discovering
          beautiful artworks from a range of global repositories. Use the search
          box below to explore stunning pieces with any word that comes to mind
          - whether it's an artist, a theme, or a style. Start by searching
          below, then refine your results using filters and sorting options to
          find the perfect pieces for your <strong>Exhibit</strong>.
        </p>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          className="search"
          type="text"
          value={draftSearchValue}
          onChange={(e) => setDraftSearchValue(e.target.value)}
          placeholder="Search"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        />
        <div className="card">
          <button type="submit">{isLoading ? "Searching..." : "Search"}</button>
        </div>
      </form>
      <div className="collectionRow">
        <div></div>
        {filterExpanded || sortExpanded ? null : (
          <>
            {noData ? <></> : <span>{displayMessage}</span>}
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
        <div className="filterColumn">
          {renderDropdown("Type", "type")}
          {renderDropdown("Location", "location")}
          {renderDropdown("Creator", "creator")}
          {renderDropdown("Period", "period")}
          {renderDropdown("Repository", "repository")}
        </div>
      ) : null}
      {sortExpanded ? (
        <div className="filterColumn">
          <div className="inputRow">
            <label className="otherLabel" htmlFor="sort">
              Sort by{" "}
            </label>
            <select
              id="sort"
              value={draftSortBy}
              onChange={(e) => setDraftSortBy(e.target.value)}
              className="otherInput"
            >
              <option value="title">Title</option>
              <option value="period">Period</option>
              <option value="repository">Repository</option>
            </select>
            <select
              value={draftOrder}
              onChange={(e) => setDraftOrder(e.target.value)}
              className="otherInput"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBox;
