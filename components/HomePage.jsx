import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCollections } from "../src/hooks/useCollections";
import SearchBox from "./SearchBox";
import Results from "./Results";
import NavBar from "./NavBar";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValueFromURL = searchParams.get("q") || "";
  const pageFromURL = parseInt(searchParams.get("page")) || 1;
  const sortByFromURL = parseInt(searchParams.get("sortBy")) || "repository";
  const orderFromURL = parseInt(searchParams.get("order")) || "asc";
  const [searchValue, setSearchValue] = useState(searchValueFromURL);
  const searchTerm = searchValueFromURL;
  const page = pageFromURL;
  const { data, isLoading, error } = useCollections(searchTerm, page);
  const [lastPage, setLastPage] = useState(Infinity);
  const [sortBy, setSortBy] = useState(sortByFromURL);
  const [order, setOrder] = useState(orderFromURL);
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    creator: "",
    period: "",
    repository: "",
  });

  const [tally, setTally] = useState({
    types: new Map(),
    locations: new Map(),
    creators: new Map(),
    periods: new Map(),
    repositories: new Map(),
  });

  const tallyFilters = (items) => {
    const newTally = {
      type: new Map(),
      location: new Map(),
      creator: new Map(),
      period: new Map(),
      repository: new Map(),
    };

    items.forEach(({ type, location, creator, period, repository }) => {
      newTally.type.set(type, (newTally.type.get(type) || 0) + 1);
      newTally.location.set(
        location,
        (newTally.location.get(location) || 0) + 1
      );
      newTally.creator.set(creator, (newTally.creator.get(creator) || 0) + 1);
      newTally.period.set(period, (newTally.period.get(period) || 0) + 1);
      newTally.repository.set(
        repository,
        (newTally.repository.get(repository) || 0) + 1
      );
    });

    setTally(newTally);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchParams({ q: searchValue, page: 1, sortBy: sortBy, order: order });
    setLastPage(Infinity);
  };

  const handleNextPage = () => {
    setSearchParams({
      q: searchTerm,
      page: page + 1,
      sortBy: sortBy,
      order: order,
    });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({
        q: searchTerm,
        page: page - 1,
        sortBy: sortBy,
        order: order,
      });
    }
  };

  const filteredData = data
    ? data.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          return value === "" || item[key] === value;
        });
      })
    : [];

  const sortedData = filteredData.sort((a, b) => {
    if (!sortBy || !a.hasOwnProperty(sortBy) || !b.hasOwnProperty(sortBy)) {
      return 0;
    }

    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "desc"
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
    }

    return order === "desc" ? valueB - valueA : valueA - valueB;
  });

  useEffect(() => {
    if (data && data.length === 0) {
      setLastPage(page);
      setSearchParams({
        q: searchTerm,
        page: page - 1,
        sortBy: sortBy,
        order: order,
      });
    }
  }, [data, sortBy, order]);

  useEffect(() => {
    if (data) tallyFilters(data);
  }, [data]);

  return (
    <div className="page">
      <SearchBox
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
        tally={tally}
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        displayLength={filteredData.length}
        noData={!data}
      />
      <Results
        isLoading={isLoading}
        error={error}
        lastPage={lastPage}
        page={page}
        data={sortedData}
      />
      <NavBar
        handlePrevPage={handlePrevPage}
        page={page}
        handleNextPage={handleNextPage}
        noData={!data}
        lastPage={lastPage}
      />
    </div>
  );
};

export default HomePage;
