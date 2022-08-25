import axios from "axios";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//Styles
import { Stack } from "react-bootstrap";
import "./App.scss";

//Layout
import Navigation from "./layout/Navigation";

//Models
import Pokemon from "./models/pokemon";

//pages
import PokemonPage from "./pages/Pokemon";
import AbilityPage from "./pages/Ability";
import PokemonDetail from "./pages/PokemonDetail";
import LoadingMask from "./components/LoadingMask";

//Redux
import { selectGlobalComps, setSearchContent } from "./store/globalComps-slice";
import { useDispatch, useSelector } from "react-redux";
import SearchPage from "./pages/Seach";
import { useLocation } from "react-router-dom";

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[] | null>(null);

  const globalComps = useSelector(selectGlobalComps);
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/pokemon") {
      dispatch(setSearchContent(""));
    }
  }, [location]);

  return (
    <Stack
      style={{ minHeight: "calc(100vh - 28px)" }}
      gap={3}
      className="App bg-light"
    >
      <Navigation className="px-lg-5 px-xs-1" />
      <main className="px-lg-5 px-xs-1">
        <Routes>
          <Route path="/pokemon" element={<PokemonPage />} />
          <Route path="/pokemon/:pokemonName" element={<PokemonDetail />} />
          <Route path="/search/:searchInput" element={<SearchPage />} />
          <Route path="/ability" element={<AbilityPage />} />
          <Route
            path="/"
            element={<Navigate to="/pokemon?page=1&limit=20" />}
          />
        </Routes>
      </main>
      <footer className="m-3 bg-light">
        @Created by Arnold Truong with love!
      </footer>
      {globalComps.loading && <LoadingMask />}
    </Stack>
  );
}

export default App;
