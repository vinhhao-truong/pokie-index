import randomColor from 'randomcolor';

const getRandomDarkColor = (color:string): string => {
  return randomColor({
    luminosity: 'dark',
    hue: color
  })
}

const colorCollection:any = {
  normal: getRandomDarkColor("monochrome"),
  fighting: getRandomDarkColor("monochrome"),
  poison: getRandomDarkColor("purple"),
  ground: getRandomDarkColor("#6c584c"),
  rock: getRandomDarkColor("monochrome"),
  bug: getRandomDarkColor("#a98467"),
  ghost: getRandomDarkColor("monochrome"),
  steel: getRandomDarkColor("monochrome"),
  fire: getRandomDarkColor("orange"),
  water: getRandomDarkColor("blue"),
  grass: getRandomDarkColor("green"),
  electric: getRandomDarkColor("yellow"),
  psychic: getRandomDarkColor("monochrome"),
  ice: getRandomDarkColor("blue"),
  dragon: getRandomDarkColor("orange"),
  dark: getRandomDarkColor("#000000"),
  fairy: getRandomDarkColor("pink"),
  unknown: getRandomDarkColor("monochrome"),
  shadow: getRandomDarkColor("monochrome"),
  flying: getRandomDarkColor("pink"),
}

const typeColor = (type?: string): string => {
  if(type) {
    return colorCollection[type];
  }
  return getRandomDarkColor("monochrome");
}

export default typeColor;