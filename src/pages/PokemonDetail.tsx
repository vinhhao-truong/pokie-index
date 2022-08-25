import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import fetchData from "../fns/fetchData";
import Pokemon from "../models/pokemon";
import {
  selectGlobalComps,
  startLoading,
  stopLoading,
} from "../store/globalComps-slice";
import { capitalizeFirst, capitalizeFirstEach } from "../fns/capitalizeFirst";
import typeColor from "../assets/typeColor";
import getEvolutionChain from "../fns/getEvolutionChain";

import { Container, Row, Col, Stack } from "react-bootstrap";
import { Card, Image, Collapse } from "antd";
import { motion } from "framer-motion";

import randomColor from "randomcolor";
import arrayEquals from "../fns/arraysEquals";

import { MdCatchingPokemon } from "react-icons/md";

const { Panel } = Collapse;

const PokemonDetail: React.FC<{}> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPokemonName = useParams().pokemonName;

  const dispatch = useDispatch();
  const isLoading = useSelector(selectGlobalComps).loading;

  const [pokemonData, setPokemonData] = useState<any>(null);
  const [renderedPokemonData, setRenderedPokemonData] =
    useState<Pokemon | null>(null);
  const [evoChainUrl, setEvoChainUrl] = useState<any>(null);
  const [evoChain, setEvoChain] = useState<any>(null);
  const [evoImgUrlList, setEvoImgUrlList] = useState<string[]>([]);
  const [numberInChain, setNumberInChain] = useState<number>(0);

  //Initialize pokemon data
  useEffect(() => {
    (async () => {
      dispatch(startLoading());
      await fetchData(`/pokemon/${currentPokemonName}`, setPokemonData);
      dispatch(stopLoading());
    })();
  }, [location]);

  //Set pokemon data into state
  useEffect(() => {
    if (pokemonData) {
      dispatch(startLoading());
      setRenderedPokemonData({
        name: capitalizeFirstEach(pokemonData.name, "-"),
        height: pokemonData.height,
        weight: pokemonData.weight,
        pokeImages: {
          frontDefault: pokemonData.sprites.front_default,
          frontShiny: pokemonData.sprites.front_shiny,
          officialArtwork:
            pokemonData.sprites.other["official-artwork"].front_default,
        },
        types: pokemonData.types.map((type: any) => ({
          name: type.type.name,
          color: typeColor(type.type.name),
        })),
        id: pokemonData.id,
        abilities: pokemonData.abilities.map((ability: any) => ({
          abilityName: capitalizeFirstEach(ability.ability.name, "-"),
          url: ability.ability.url,
        })),
        moves: pokemonData.moves.map((move: any) => ({
          name: capitalizeFirstEach(move.move.name, "-"),
          url: move.move.url,
        })),
        species: capitalizeFirstEach(pokemonData.species.name, "-"),
      });
      dispatch(stopLoading());
    }
  }, [pokemonData, location]);

  //Fetch abilities
  useEffect(() => {
    (async () => {
      dispatch(startLoading());
      if (renderedPokemonData?.abilities) {
        let tempHoldAbilities = [...renderedPokemonData.abilities];

        for (let i = 0; i < renderedPokemonData.abilities.length; i++) {
          const currentAbility = renderedPokemonData.abilities[i];
          if (typeof currentAbility.url === "string") {
            await fetchData(currentAbility.url, (ability: any) => {
              tempHoldAbilities[i].effect = ability.effect_entries.find(
                (effect: any) => effect.language.name === "en"
              ).effect;
            });
          }
        }

        if (!arrayEquals(renderedPokemonData.abilities, tempHoldAbilities)) {
          setRenderedPokemonData({
            ...renderedPokemonData,
            abilities: [...tempHoldAbilities],
          });
        }
      }

      if (renderedPokemonData?.moves) {
        let tempHoldMoves = [...renderedPokemonData.moves];

        for (let i = 0; i < renderedPokemonData.moves.length; i++) {
          const currentMoves = renderedPokemonData.moves[i];
          if (typeof currentMoves.url === "string") {
            await fetchData(currentMoves.url, (move: any) => {
              tempHoldMoves[i].effect = move.effect_entries.find(
                (effect: any) => effect.language.name === "en"
              ).effect;
            });
          }
        }

        if (!arrayEquals(renderedPokemonData.moves, tempHoldMoves)) {
          setRenderedPokemonData({
            ...renderedPokemonData,
            moves: [...tempHoldMoves],
          });
        }
      }
      dispatch(stopLoading());
    })();
  }, [renderedPokemonData, location]);

  //Get pokemon species url
  useEffect(() => {
    (async () => {
      if (pokemonData) {
        dispatch(startLoading());
        await fetchData(
          `/pokemon-species/${pokemonData.species.name}`,
          setEvoChainUrl,
          "evolution_chain"
        );
        await fetchData(
          `/pokemon-species/${pokemonData.species.name}`,
          (color: any) => {
            setRenderedPokemonData((prev: any) => ({
              ...prev,
              color: color.name,
            }));
          },
          "color"
        );
        dispatch(stopLoading());
      }
    })();
  }, [pokemonData, location]);

  //Get evolution chain data
  useEffect(() => {
    if (evoChainUrl) {
      (async () => {
        dispatch(startLoading());
        await fetchData(evoChainUrl.url, setEvoChain, "chain");
        dispatch(stopLoading());
      })();
    }
  }, [evoChainUrl, location]);

  //Get evo chain images
  useEffect(() => {
    //Make sure it only renders once loaded
    if (evoChain && evoImgUrlList.length === 0 && currentPokemonName) {
      dispatch(startLoading());

      //get the number in the eveolution chain
      setNumberInChain(getEvolutionChain(evoChain).indexOf(currentPokemonName));

      getEvolutionChain(evoChain).forEach(async (pokemonName: string) => {
        await fetchData(
          `/pokemon-form/${pokemonName}`,
          (item: any) => {
            setEvoImgUrlList((prev) => [...prev, item.front_default]);
          },
          "sprites"
        );
      });
      dispatch(stopLoading());
    }
  }, [evoChain, evoImgUrlList, location]);

  return (
    <div className="PokemonDetailPage">
      {pokemonData && renderedPokemonData && !isLoading && (
        <>
          <Container>
            <Row xs={1} md={3}>
              <Col md={4}>
                <Card
                  title={renderedPokemonData.name}
                  headStyle={{
                    textAlign: "center",
                    backgroundColor: `${
                      renderedPokemonData.color
                        ? randomColor({
                            hue: renderedPokemonData.color,
                            luminosity: "light",
                          })
                        : "#000000"
                    }`,
                  }}
                  className="mb-2"
                  style={{
                    position: "sticky",
                    top: "7%",
                  }}
                >
                  <Image
                    style={{ objectFit: "contain", maxWidth: "100%" }}
                    src={
                      renderedPokemonData.pokeImages.officialArtwork
                        ? renderedPokemonData.pokeImages.officialArtwork
                        : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                    }
                    placeholder="official_artwork"
                  />
                  <Row>
                    {pokemonData.sprites.front_default && (
                      <Col>
                        <Image
                          src={pokemonData.sprites.front_default}
                          placeholder="front_default"
                        />
                      </Col>
                    )}
                    {pokemonData.sprites.back_default && (
                      <Col>
                        <Image
                          src={pokemonData.sprites.back_default}
                          placeholder="back_default"
                        />
                      </Col>
                    )}
                    {pokemonData.sprites.front_shiny && (
                      <Col>
                        <Image
                          src={pokemonData.sprites.front_shiny}
                          placeholder="front_shiny"
                        />
                      </Col>
                    )}
                    {pokemonData.sprites.back_shiny && (
                      <Col>
                        <Image
                          src={pokemonData.sprites.back_shiny}
                          placeholder="back_shiny"
                        />
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
              <Col md={8}>
                <Collapse
                  accordion
                  expandIcon={({ isActive }) => (
                    <MdCatchingPokemon rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel header="Basic Information" key="1">
                    <p>
                      <b>Species:</b> {renderedPokemonData.species}
                    </p>
                    <p>
                      <b>Weight:</b> {renderedPokemonData.weight / 10}kg
                    </p>
                    <p>
                      <b>Height:</b> {renderedPokemonData.height / 10}m
                    </p>
                  </Panel>
                  <Panel header="Types" key="2">
                    <Row lg="6">
                      {renderedPokemonData.types?.map((type, idx) => (
                        <Col style={{ height: "fit-content" }} key={idx}>
                          <Card
                            style={{
                              backgroundColor: type.color,
                              color: "#ffffff",
                              height: "fit-content",
                              fontSize: "20px",
                            }}
                            className="text-center"
                            key={idx}
                          >
                            {capitalizeFirst(type.name)}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Panel>
                  <Panel header="Abilities" key="3">
                    <Collapse bordered={false}>
                      {renderedPokemonData.abilities?.map((ability, idx) => (
                        <Panel
                          key={"ability" + idx}
                          header={`${idx + 1}) ${ability.abilityName}`}
                        >
                          <i>{ability.effect}</i>
                        </Panel>
                      ))}
                    </Collapse>
                  </Panel>
                  <Panel header="Moves" key="4">
                    <Collapse bordered={false}>
                      {renderedPokemonData.moves?.map((move, idx) => (
                        <Panel
                          key={"move" + idx}
                          header={`${idx + 1}) ${move.name}`}
                        >
                          <span>{move.effect}</span>
                        </Panel>
                      ))}
                    </Collapse>
                  </Panel>
                  <Panel header="Evolution" key="5">
                    <div className="d-flex justify-content-evenly">
                      {evoImgUrlList.map((img, idx) => {
                        const styleImg = {
                          borderBottom:
                            idx === numberInChain
                              ? `${renderedPokemonData.color} 3px solid`
                              : "none",
                          cursor: "pointer",
                        };
                        // console.log(numberInChain);
                        return (
                          <motion.div
                            whileHover={{ cursor: "pointer", scale: 1.2 }}
                            key={idx}
                            onClick={() => {
                              if (
                                getEvolutionChain(evoChain)[idx] !==
                                currentPokemonName
                              ) {
                                setNumberInChain(idx); //change ui after loaded
                                navigate(
                                  `/pokemon/${getEvolutionChain(evoChain)[idx]}`
                                );
                              }
                            }}
                          >
                            <img
                              style={styleImg}
                              src={img}
                              alt={"pokemon-" + idx}
                            />
                            <p className="text-center">
                              {capitalizeFirstEach(
                                getEvolutionChain(evoChain)[idx],
                                "-"
                              )}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default PokemonDetail;
