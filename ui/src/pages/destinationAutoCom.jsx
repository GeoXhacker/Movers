import React, { useState } from "react";
import { map } from "lodash";
import { ListInput, ListItem } from "framework7-react";
import "./auto.css";
const DestinationAutocomplete = (props) => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrMsg] = useState("");
  const [query, setQuery] = useState("");
  const [queryResults, setQResults] = useState([]);
  const [apiToken, setToken] = useState(props.apiToken);
  const [reset, setReset] = useState(false);

  const updateQuery = (event) => {
    setQuery(event.target.value);
    const header = { "Content-Type": "application/json" };
    let path =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      query +
      ".json?access_token=" +
      apiToken;

    if (props.country) {
      // country put in the props of the element
      path =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        query +
        ".json?access_token=" +
        apiToken +
        "&country=" +
        props.country;
    }

    if (query.length > 3) {
      return fetch(path, {
        headers: header,
      })
        .then((res) => {
          if (!res.ok) throw Error(res.statusText);
          return res.json();
        })
        .then((json) => {
          setError(false);
          setQResults(json.features);
        })
        .catch((err) => {
          setError(true);
          setErrMsg(
            "There was a problem retrieving places, make sure are connected to internet"
          );
          setQResults([]);
        });
    } else {
      setError(false);
      setQResults([]);
    }
  };

  const resetSearch = () => {
    if (reset) {
      setQuery("");
      setQResults([]);
    } else {
      setQResults([]);
    }
  };

  const onSuggestionSelect = (event) => {
    if (reset === false) {
      setQuery(event.target.getAttribute("data-suggestion"));
    }

    props.onSuggestionSelect(
      event.target.getAttribute("data-suggestion"),
      event.target.getAttribute("data-lat"),
      event.target.getAttribute("data-lng"),
      event.target.getAttribute("data-text")
    );
  };

  return (
    <ul>
      <ListInput
        style={{ margin: 0 }}
        // placeholder={props.placeholder || "Search"}
        id={props.inputId}
        onClick={props.inputOnClick}
        onBlur={props.inputOnBlur}
        onFocus={props.inputOnFocus}
        onChange={updateQuery}
        value={query}
        type="text"
        // label="Shifting from"
        placeholder={props.placeholder}
        label={props.label}
        clearButton
        floatingLabel
        outline
        onInputEmpty={props.onInputEmpty}
        onInput={(e) => {
          console.log(e.target.value, "input");
        }}
      />
      <span>
        <div
          style={
            queryResults.length > 0 || error
              ? { display: "block" }
              : { display: "none" }
          }
          onClick={resetSearch}
        >
          {map(queryResults, (place, i) => {
            return (
              <div
                className="react-mapbox-ac-suggestion"
                onClick={onSuggestionSelect}
                key={i}
                data-suggestion={place.place_name}
                data-lng={place.center[0]}
                data-lat={place.center[1]}
                data-text={place.text}
              >
                {place.place_name}
              </div>
            );
          })}

          {error && <div>{errorMsg}</div>}
        </div>
      </span>
    </ul>
  );
};

export default DestinationAutocomplete;
