import React, { useEffect, useState } from "react";
import { Card, Row, Spinner, Col } from "react-bootstrap";
import { capitalizeFirstEach } from "../fns/capitalizeFirst";
import fetchData from "../fns/fetchData";
import Pokemon from "../models/pokemon";
import randomColor from "randomcolor";
import typeColor from "../assets/typeColor";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PokeCard: React.FC<{ url: string }> = (props) => {
  // const pokemonFormData = useGetData(`/pokemon-form/${id.toString()}`);
  const [pokemonResData, setPokemonResData] = useState<any>(null);
  const [renderedData, setRenderedData] = useState<Pokemon | null>(null);
  const [cardLoading, setCardLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setCardLoading(true);
      await fetchData(props.url, setPokemonResData);
      setCardLoading(false);
    })();
  }, [props.url]);

  useEffect(() => {
    setCardLoading(true);
    if (pokemonResData) {
      setRenderedData(
        new Pokemon(
          capitalizeFirstEach(pokemonResData.name, "-"),
          pokemonResData.height,
          pokemonResData.weight,
          pokemonResData.abilities.map((ability: any) => ({
            abilityName: capitalizeFirstEach(ability.ability.name, "-"),
            color: randomColor({ luminosity: "dark" }),
          })),
          {
            frontDefault: pokemonResData.sprites.front_default,
            frontShiny: pokemonResData.sprites.front_shiny,
            animated:
              pokemonResData.sprites.versions["generation-v"]["black-white"][
                "animated"
              ].front_default,
          },
          pokemonResData.types.map((type: any) => ({
            name: type.type.name,
            color: typeColor(type.type.name),
          })),
          pokemonResData.id
        )
      );
    }
    setCardLoading(false);
  }, [pokemonResData]);

  const handleClickCard = () => {
    navigate(`/pokemon/${pokemonResData.name}`);
  };

  return (
    <>
      {renderedData && !cardLoading && (
        <Card
          style={{
            height: "100%",
            cursor: "pointer",
            boxShadow: "5px 7px 8px rgba(0, 0, 0, 0.2)",
          }}
          className="PokeCard border-0"
          as={motion.div}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
          onClick={handleClickCard}
        >
          <Card.Img
            className="mt-3 d-block mx-auto p-2 rounded-circle bg-light"
            src={
              renderedData.pokeImages.animated
                ? renderedData.pokeImages.animated
                : renderedData.pokeImages.frontDefault
                ? renderedData.pokeImages.frontDefault
                : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
            }
            alt="pokemon-img"
            style={{
              height: "128px",
              width: "128px",
              objectFit: "contain",
              userSelect: "none",
              cursor: "zoom-in",
            }}
            draggable={false}
            as={motion.img}
            whileHover={{ zoom: 1.5 }}
          />
          <Card.Body>
            <Card.Title>{renderedData.name}</Card.Title>
            <Row lg={2}>
              <Col>
                <Card.Text>
                  <b>Weight:</b> {renderedData.weight / 10}kg
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  <b>Height:</b> {renderedData.height / 10}m
                </Card.Text>
              </Col>
            </Row>

            <Row lg={2}>
              {renderedData.types?.map((type, idx) => (
                <Col className="my-1" key={idx}>
                  <Card
                    style={{ backgroundColor: type.color, color: "#ffffff" }}
                    className="text-center"
                    key={idx}
                  >
                    #{type.name}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {cardLoading && !renderedData && (
        <Spinner
          className="d-block mx-auto"
          animation="border"
          variant="info"
        />
      )}
    </>
  );
};

export default PokeCard;
