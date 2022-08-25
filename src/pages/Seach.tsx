import { useParams } from "react-router-dom";

const SearchPage = () => {
  const searchInput = useParams().searchInput;

  return <div className="SearchPage"></div>;
};

export default SearchPage;
