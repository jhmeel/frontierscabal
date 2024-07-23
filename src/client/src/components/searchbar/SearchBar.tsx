import React, { useEffect, useState, useRef } from "react";
import { IconBxSearchAlt } from "../../assets/icons";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../../utils/axiosInstance";

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpened, setIsOpen] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = location?.search;
    const query = new URLSearchParams(search).get("query");
    if (query) {
      setSearchValue(query);
    } else {
      setSearchValue("");
    }
  }, [location]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && searchValue !== "") {
        handleSearch();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchValue]);

  const getSuggestions = async () => {
    try {
      const { data } = await axiosInstance().get(`api/v1/suggestion-search`);
      return data.suggestions;
    } catch (err) {}
  };

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const suggestions = await getSuggestions();
    if (suggestions) {
      setSuggestions(
        suggestions.filter((suggestion:string) =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
      );
      setIsOpen(true);
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) {
      return;
    }
    const query = encodeURIComponent(trimmedValue);
    navigate({
      pathname: "/search",
      search: `?query=${query}`,
    });
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (
      suggestionRef.current &&
      !suggestionRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <SearchBarRenderer>
        <IconBxSearchAlt className="search-icon" onClick={handleSearch} />
        <input
          placeholder="Search..."
          title="Search"
          type="search"
          value={searchValue}
          className="search-input"
          onChange={handleOnChange}
        />
      </SearchBarRenderer>
      <SuggestionRenderer ref={suggestionRef}>
  {suggestions.length > 0 && isOpened && (
    <ul className="suggestions-list">
      {suggestions.slice(0, 10).map((suggestion, index) => (
        <li
          key={index}
          className="suggestion-item"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
</SuggestionRenderer>

    </>
  );
};

export default SearchBar;
const SuggestionRenderer = styled.div`
  position: absolute;
  display: flex;
  width:100%;
  .suggestions-list {
    margin: 5px;
    position: absolute;
    list-style: none;
    border-radius: 5px;
    border: 1px solid #ededed;
    background: #fff;
  }
  .suggestion-item {
    padding: 10px 20px;
    font-size: 12px;
    color:#000;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
  .suggestion-item:hover {
    background-color: lightgrey;
    color: #fff;
  }

  .suggestion-item:first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .suggestion-item:last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const SearchBarRenderer = styled.div`
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  width: 340px;

  @media (max-width: 767px) {
    & {
      max-width: 200px;
    }
    .search-input::placeholder {
      font-size: 10px;
    }
    .search-input {
      font-size: 13px;
    }
  }
  .search-input {
    width: 100%;
    height: 42px;
    padding-left: 50px;
    padding-right: 16px;
    font-family: "system-ui", "SF Pro Text", -apple-system, "Roboto", "Segoe UI",
      Helvetica, Verdana, sans-serif, "Oxygen", "Ubuntu", "Cantarell",
      "Fira Sans", "Droid Sans", "Helvetica Neue";
    font-size: 14px;
    border: 2px solid transparent;
    border-radius: 24px;
    outline: none;
    background-color: #ffffff;
    color: #363636;
    transition: 0.3s ease;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.1), 0px 2px 4px 0px rgba(0, 0, 0, 0.14);

  }
  .search-input::-webkit-search-cancel-button {
    cursor: pointer;
  }
  .search-input::placeholder {
    color: rgba(0, 0, 0, 0.74);
    font-size: 13px;
  }

  .search-input:focus,
  .search-input:hover {
    border: 2px solid #176984;
  }

  .search-icon {
    position: absolute;
    left: 0.7rem;
    top: 12px;
    fill: gray;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;
