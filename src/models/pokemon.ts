import { v4 as uuidv4 } from "uuid";

//models
import Ability from "./ability";
import Move from "./move";
import PokeImages from "./pokeImages";
import Type from "./type";

class Pokemon {
  id?: number;
  name: string;
  height: number;
  weight: number;
  abilities?: Ability[];
  moves?: Move[];
  pokeImages: PokeImages;
  types: Type[];
  color?: string;
  species?: string;

  constructor(
    name: string,
    height: number,
    weight: number,
    abilities: Ability[],
    pokeImages: PokeImages,
    types: Type[],
    id?: number,
    color?: string,
    moves?: Move[],
    species?: string
  ) {
    this.id = id;
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.abilities = [...abilities];
    this.pokeImages = pokeImages;
    this.types = [...types];
    this.color = color;
    this.moves = moves;
    this.species = species;
  }
}

export default Pokemon;
