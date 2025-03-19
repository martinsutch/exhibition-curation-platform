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

  const [searchValue, setSearchValue] = useState(searchValueFromURL);
  const [lastPage, setLastPage] = useState(Infinity);

  const searchTerm = searchValueFromURL;
  const page = pageFromURL;

  const { data, isLoading, error } = useCollections(searchTerm, page);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchParams({ q: searchValue, page: 1 });
    setLastPage(Infinity);
  };

  const handleNextPage = () => {
    setSearchParams({ q: searchTerm, page: page + 1 });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ q: searchTerm, page: page - 1 });
    }
  };

  useEffect(() => {
    if (data && data.length === 0) {
      setLastPage(page);
      setSearchParams({ q: searchTerm, page: page - 1 });
    }
  }, [data]);

  return (
    <div className="page">
      <SearchBox
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />
      <Results
        isLoading={isLoading}
        error={error}
        lastPage={lastPage}
        page={page}
        data={data}
      />
      <NavBar
        handlePrevPage={handlePrevPage}
        page={page}
        handleNextPage={handleNextPage}
        data={data}
        lastPage={lastPage}
      />
    </div>
  );
};

export default HomePage;
