class Ability {
  abilityName: string;
  effect?: string;
  color?: string;
  url?: string;

  constructor(abilityName:string, effect?: string, color?: string, url?: string){
    this.abilityName = abilityName;
    this.effect = effect;
    this.color = color;
    this.url = url;
  }
}

export default Ability;