
const capitalizeFirst = (str: string, splittedChar?:string): string => {
  let result = str[0].toUpperCase() + str.slice(1);
  if(splittedChar) {
    result = result.split(splittedChar).join(" ");
  }
  
  return result;
};

const capitalizeFirstEach = (str: string, splittedChar:string): string => {
  const splittedArr = str.split(splittedChar); ;
  const resultArr = splittedArr.map(word => capitalizeFirst(word));
  return resultArr.join(" ");
}

export {capitalizeFirst, capitalizeFirstEach};
