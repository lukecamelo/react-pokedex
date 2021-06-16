import {useState, useEffect} from 'react'
import PokeTile from '../Components/PokeTile'

import axios from 'axios'

function List() {
  const types = ["Grass", "Poison", "Fire", "Flying", "Water", "Bug", "Normal", "Electric", "Ground", "Fighting", "Psychic", "Rock", "Ice", "Ghost", "Dragon"]

  const [pokemonArray, setPokemonArray] = useState([])
  const [filteredPokemon, setFilteredPokemon] = useState([])
  const [inputValue, setInputValue] = useState("")
  
  const [checkedState, setCheckedState] = useState(
    new Array(types.length).fill(false)
  )
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json'
      )
      
      setPokemonArray(result.data.pokemon)
      setFilteredPokemon(result.data.pokemon)
    }

    fetchData()
  }, [])

  function handleChange(position) {
    const updatedCheckedState = checkedState.map((item, index) => index === position ? !item : item)

    setCheckedState(updatedCheckedState)
    
    let selectedTypes = types.filter((type, index) => {
      if(updatedCheckedState[index]) {
        return type
      }
    })

    let filteredPokemon = pokemonArray.filter(pokemon => {
      if (!updatedCheckedState.includes(true)) {
        return pokemon
      }
      else if(pokemon.type.some(type => selectedTypes.includes(type)) && selectedTypes.length < 2) {
        return pokemon
      } else if (selectedTypes.length >= 2) {

        // I am not happy with this solution, and in a professional environment I would work to refactor this
        let matches = []
        selectedTypes.forEach(type => {
          if (pokemon.type.includes(type)) {
            matches.push(true)
          } else {
            matches.push(false)
          }
        })

        if(!matches.includes(false)) {
          return pokemon
        }
      }
    })

    setFilteredPokemon(filteredPokemon)
  }

  let pokemonToDisplay = filteredPokemon.filter(pokemon => {
    if (inputValue == null || pokemon.name.toLowerCase().includes(inputValue.toLowerCase())) {
      return pokemon
    }
  }).map((pokemon, key) => <PokeTile name={pokemon.name} id={pokemon.id} num={pokemon.num} img={pokemon.img} type={pokemon.type} key={key}/>)

  return(
    <>
      <input type="text" onChange={e => setInputValue(e.target.value)} />

      <ul>
        {types.map((type, index) => {
          return (
            <li key={index}>
              <input 
                type="checkbox"
                id={`type-checkbox-${index}`}
                name={type} 
                value={type} 
                checked={checkedState[index]} 
                onChange={() => handleChange(index)}
              />
              <label htmlFor={`type-checkbox-${index}`}>{type}</label>
            </li>
          )
        })}
      </ul>
      <ul>
        {pokemonToDisplay}
      </ul>
    </>
  )
}

export default List