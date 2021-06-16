import {useState, useEffect} from 'react'
import PokeTile from '../Components/PokeTile'
import TypeSelect from '../Components/TypeSelect'

import axios from 'axios'

function List() {

  const [pokemonArray, setPokemonArray] = useState([])
  const [typeArray, setTypeArray] = useState([])
  const [inputValue, setInputValue] = useState("")

  // I did it this way instead of just hardcoding the type array just for fun, I know it is inefficient to loop over every single 'mon
  function consolidateTypes() {
    let typeArray = []

    pokemonArray.forEach(pokemon => {
      pokemon.type.forEach(type => {
        if (!typeArray.includes(type)) {
          typeArray.push(type)
        }
      })
    })

    setTypeArray(typeArray)
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json'
      )
      
      setPokemonArray(result.data.pokemon)
    }

    fetchData()
    consolidateTypes()
  }, [])

  let pokemonToDisplay = pokemonArray.filter(pokemon => {
    if (inputValue == null || pokemon.name.toLowerCase().includes(inputValue.toLowerCase())) {
      return pokemon
    } 
  }).map((pokemon, key) => <PokeTile name={pokemon.name} id={pokemon.id} num={pokemon.num} img={pokemon.img} type={pokemon.type} key={key}/>)

  return(
    <>
      <input type="text" onChange={e => setInputValue(e.target.value)} />
      <TypeSelect types={typeArray}/>
      <ul>
        {pokemonToDisplay}
      </ul>
    </>
  )
}

export default List