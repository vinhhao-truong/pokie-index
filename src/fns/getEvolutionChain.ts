const getEvolutionChain = (evoChainData: any, returnedEvoChain: string[] = []): string[] => {
  const currentName = evoChainData ? evoChainData.species.name : null;

  if(!evoChainData) {
    return [...returnedEvoChain];
  }

  return returnedEvoChain.concat(getEvolutionChain(evoChainData.evolves_to[0], [currentName]));
};

export default getEvolutionChain;
