import React, { useState, useEffect } from "react";
import { SearchContainer } from "./SearchStyle";
import { gql, useLazyQuery } from "@apollo/client";

export function MustahikSearch({ setMustahikData }) {
  const SEARCH_QUERY = gql`
    query mustahiks($nameContains: String) {
      mustahiks(nameContains: $nameContains) {
        id
        name
        dataSource {
          category
          dataSourceDetail {
            ... on DataSourceWargaType {
              village
              rt
              rw
            }
            ... on DataSourceInstitusiType {
              name
              village
              rt
              rw
            }
            ... on DataSourcePekerjaType {
              profession
              location
            }
          }
        }
      }
    }
  `;
  const [getData, { data, loading, error }] = useLazyQuery(SEARCH_QUERY);
  const onKeyPressed = (event) => {
    console.log(event.key);
    if (event.key === "Enter") {
      console.log(event.target.value);
      getData({ variables: { nameContains: event.target.value } });
    }
  };

  useEffect(() => {
    if (data) {
      setMustahikData(data);
      console.log(data);
    }
  });

  return (
    <SearchContainer>
      <input
        type="text"
        placeholder="Cari berdasarkan nama mustahik"
        name="search"
        onKeyPress={onKeyPressed}
      />
    </SearchContainer>
  );
}
