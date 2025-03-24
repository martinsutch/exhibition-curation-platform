import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCollections } from "../src/hooks/useCollections";
import SearchBox from "./SearchBox";
import Results from "./Results";
import NavBar from "./NavBar";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "repository";
  const order = searchParams.get("order") || "asc";
  const filters = Object.fromEntries(
    [...searchParams.entries()]
      .filter(([key]) => !["q", "page", "sortBy", "order"].includes(key))
      .map(([key, value]) => [key, value || ""])
  );
  const { data, isLoading, error } = useCollections(searchValue, page);
  const [lastPage, setLastPage] = useState(Infinity);

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

  const filteredData = data
    ? data.filter((item) =>
        Object.entries(filters).every(
          ([key, value]) => value === "" || String(item[key]) === String(value)
        )
      )
    : [];

  const sortedData = filteredData.sort((a, b) => {
    if (!sortBy || !a[sortBy] || !b[sortBy]) return 0;
    return order === "desc"
      ? String(b[sortBy]).localeCompare(String(a[sortBy]))
      : String(a[sortBy]).localeCompare(String(b[sortBy]));
  });

  useEffect(() => {
    if (data && data.length === 0 && page > 1) {
      setLastPage(page - 1);
      setSearchParams({
        q: searchValue,
        page: page - 1,
        sortBy,
        order,
        ...filters,
      });
    }
  }, [data, sortBy, order, filters]);

  useEffect(() => {
    if (data) tallyFilters(data);
  }, [data]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("q", searchValue);
    newParams.set("page", page);
    newParams.set("sortBy", sortBy);
    newParams.set("order", order);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });

    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams);
    }
  }, [searchValue, page, sortBy, order, filters]);

  return (
    <div className="page">
      <SearchBox
        tally={tally}
        displayLength={filteredData.length}
        noData={!data}
        setLastPage={setLastPage}
        isLoading={isLoading}
      />
      <Results
        isLoading={isLoading}
        error={error}
        lastPage={lastPage}
        page={page}
        data={sortedData}
      />
      <NavBar noData={!data} lastPage={lastPage} />
    </div>
  );
};

export default HomePage;
