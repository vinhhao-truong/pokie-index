import React, { useState, useEffect } from "react";

import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { Container, Row, Col, Stack } from "react-bootstrap";

import { useDispatch } from "react-redux";
import PokeCard from "../components/PokeCard";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import fetchData from "../fns/fetchData";
import { startLoading, stopLoading } from "../store/globalComps-slice";

const PokemonPage: React.FC<{}> = (props) => {
  // const pokemonListResData = useGetData();
  // const [pokemonList, setPokemonList] = useState<Pokemon[] | null>(null);
  // const dispatch = useDispatch();
  type pokemonInterface = { name: string; url: string };

  const [renderedPage, setRenderedPage] = useState(1);
  const [renderedLimit, setRenderedLimit] = useState(20);
  const [renderedList, setRenderedList] = useState<pokemonInterface[] | null>(
    null
  );
  const [fullList, setFullList] = useState<pokemonInterface[] | null>(null);
  const [searchResult, setSearchResult] = useState<pokemonInterface[] | null>(
    null
  );

  const location = useLocation();
  const navigate = useNavigate();
  const matchPokemon = useMatch("/pokemon");

  const searchParams = new window.URLSearchParams(location.search);
  const currentPage = searchParams.get("page");
  const currentLimit = searchParams.get("limit");
  const currentSearch = searchParams.get("search");

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await fetchData("/pokemon?limit=100000", setFullList, "results");
    })();
  }, []);

  useEffect(() => {
    if (fullList) {
      if (currentSearch) {
        const getSearchList = setTimeout(async () => {
          const searchCondition = (query: pokemonInterface) => {
            const name = query.name.trim();
            const searchInputExtracted = currentSearch
              .split(" ")
              .join("-")
              .trim();
            return name.includes(searchInputExtracted);
          };
          const fullListResults: pokemonInterface[] = [...fullList];
          const filteredList: pokemonInterface[] =
            fullListResults.filter(searchCondition);

          setRenderedList([...filteredList]);
        }, 700);
        return () => clearTimeout(getSearchList);
      }

      if (!currentSearch) {
        setRenderedList(fullList.slice(0, 20));
      }
    }
  }, [location, fullList]);

  useEffect(() => {
    if (searchResult) {
      console.log(searchResult);
    }
  }, [searchResult]);

  useEffect(() => {
    if (currentLimit) {
      // console.log(currentLimit);
      setRenderedLimit(parseInt(currentLimit));
    }
    if (currentPage) {
      // console.log(currentPage);
      setRenderedPage(parseInt(currentPage));
    }
  }, [currentLimit, currentPage]);

  useEffect(() => {
    //Offset to previous page
    const offset = (renderedPage - 1) * renderedLimit;
    (async () => {
      dispatch(startLoading());
      await fetchData(
        `/pokemon?offset=${offset}&limit=${renderedLimit}`,
        setRenderedList,
        "results"
      );
      dispatch(stopLoading());
    })();
  }, [renderedPage, renderedLimit]);

  const onPaginationShowSizeChange: PaginationProps["onShowSizeChange"] = (
    page: number,
    pageSize: number
  ) => {
    navigate(`/pokemon?page=${page}&limit=${pageSize}`);
  };

  const onCurrentPaginationChange: PaginationProps["onChange"] = (
    page: number,
    pageSize: number
  ) => {
    navigate(`/pokemon?page=${page}&limit=${pageSize}`);
  };
  return (
    <div className="PokemonPage">
      <Container fluid="md" className="CardsGrid">
        {renderedList && renderedList.length > 0 && (
          <Row className="g-4" xs={2} sm={2} md={4} lg={4} xl={8}>
            {/* Cards amounts */}
            {renderedList.map((item: any, i: number) => (
              <Col className="" key={i}>
                <PokeCard url={item.url} />
              </Col>
            ))}
          </Row>
        )}
        {(!renderedList || renderedList.length === 0) && (
          <Stack>
            <img
              src="https://memegenerator.net/img/instances/69422330/no-no-no-pokemon-here.jpg"
              alt="No Pokemon :("
              width={500}
              height={500}
              className="d-block mx-auto"
            />
          </Stack>
        )}
      </Container>

      {/* numbers of pages = total/10 */}
      {!currentSearch && (
        <Pagination
          className="d-flex justify-content-center mt-4"
          showSizeChanger
          responsive
          onShowSizeChange={onPaginationShowSizeChange}
          onChange={onCurrentPaginationChange}
          style={{ width: "100%" }}
          current={renderedPage}
          pageSize={renderedLimit}
          pageSizeOptions={[20, 40, 60, 80]}
          total={fullList ? fullList.length : 12000}
          showQuickJumper
        />
      )}
      {}
    </div>
  );
};

export default PokemonPage;
