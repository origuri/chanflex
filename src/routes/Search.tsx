import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  console.log(location);
  /* 
  {
    "pathname": "/search",
    "search": "?keyword=fffff\\", => location.search
    "hash": "",
    "state": null,
    "key": "9rtrdonj"
}
  */
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log("keyword-> ", keyword);

  return <div>Search</div>;
}

export default Search;
