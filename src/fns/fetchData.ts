import axios from 'axios';


const fetchData = async (url:string, setData: Function, expectedDataChildren?: string) => {
  try {
    const isUrlFull =  url.includes("https://pokeapi.co/api/v2");

    const res = await axios.get(`${isUrlFull ? url : `https://pokeapi.co/api/v2${url}`}`);
    if(!expectedDataChildren) {
      setData(res.data)
    } else {
      setData(res.data[expectedDataChildren]);
    }
  } catch(err) {
    console.log(err)
  }
}

export default fetchData;