import {useState, useEffect} from 'react'
import PokeTile from '../Components/PokeTile'

import axios from 'axios'

function List() {
  const types = ["Grass", "Poison", "Fire", "Flying", "Water", "Bug", "Normal", "Electric", "Ground", "Fighting", "Psychic", "Rock", "Ice", "Ghost", "Dragon"]

  const [pokemonArray, setPokemonArray] = useState([])
  const [filteredPokemon, setFilteredPokemon] = useState([])
  const [inputValue, setInputValue] = useState("")
  
  const [checkedStateType, setCheckedStateType] = useState(
    new Array(types.length).fill(false)
  )

  const [checkedStateWeakness, setCheckedStateWeakness] = useState(
    new Array(types.length).fill(false)
  )
  
  const [filteredByType, setFilteredByType] = useState([])
  const [filteredByWeaknesses, setFilteredByWeaknesses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json'
      )
      
      setPokemonArray(result.data.pokemon)
      // filtered pokemon includes all 151 by default
      setFilteredPokemon(result.data.pokemon)
    }

    fetchData()
  }, [])


  useEffect(() => {
    let filteredPokemon = []

    if (checkedStateType.includes(true) && checkedStateWeakness.includes(true)) {
      filteredPokemon = filteredByType.filter(value => filteredByWeaknesses.includes(value))
    } else if (checkedStateType.includes(true)) {
      filteredPokemon = filteredByType
    } else if (checkedStateWeakness.includes(true)) {
      filteredPokemon = filteredByWeaknesses
    } else {
      filteredPokemon = pokemonArray
    }

    setFilteredPokemon(filteredPokemon)
  }, [checkedStateType, checkedStateWeakness])
  
  // Seeing that the only difference between the type and weakness handleChange functions is pokemon.type/pokemon.weaknesses, Ideally I would consolidate them into one function
  // Which I would have done, had I had the time
  function handleChangeType(position, checkedState, setCheckedState) {
    const updatedCheckedState = checkedState.map((item, index) => index === position ? !item : item)

    setCheckedState(updatedCheckedState)
    
    let selectedTypes = types.filter((type, index) => {
      if(updatedCheckedState[index]) {
        return type
      }
    })

    let filtered = pokemonArray.filter(pokemon => {
      if (!updatedCheckedState.includes(true)) {
        return pokemon
      } else if(pokemon.type.some(type => selectedTypes.includes(type)) && selectedTypes.length < 2) {
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

    setFilteredByType(filtered)
  }

  function handleChangeWeakness(position, checkedState, setCheckedState) {
    const updatedCheckedState = checkedState.map((item, index) => index === position ? !item : item)

    setCheckedState(updatedCheckedState)
    
    let selectedTypes = types.filter((type, index) => {
      if(updatedCheckedState[index]) {
        return type
      }
    })

    let filtered = pokemonArray.filter(pokemon => {
      if (!updatedCheckedState.includes(true)) {
        return pokemon
      } else if(pokemon.weaknesses.some(type => selectedTypes.includes(type)) && selectedTypes.length < 2) {
        return pokemon
      } else if (selectedTypes.length >= 2) {

        // I am not happy with this solution, and in a professional environment I would work to refactor this
        let matches = []
        selectedTypes.forEach(type => {
          if (pokemon.weaknesses.includes(type)) {
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

    setFilteredByWeaknesses(filtered)
  }

  let pokemonToDisplay = filteredPokemon.filter(pokemon => {
    if (inputValue == null || pokemon.name.toLowerCase().includes(inputValue.toLowerCase())) {
      return pokemon
    }
  }).map((pokemon, key) => <PokeTile name={pokemon.name} id={pokemon.id} num={pokemon.num} img={pokemon.img} type={pokemon.type} weaknesses={pokemon.weaknesses} key={key}/>)

  return(
    <>
      <input type="text" onChange={e => setInputValue(e.target.value)} />

      <ul>
        <h3>Type</h3>
        {types.map((type, index) => {
          return (
            <li key={index}>
              <input 
                type="checkbox"
                id={`type-checkbox-${index}`}
                name={type} 
                value={type} 
                checked={checkedStateType[index]} 
                onChange={() => handleChangeType(index, checkedStateType, setCheckedStateType)}
              />
              <label htmlFor={`type-checkbox-${index}`}>{type}</label>
            </li>
          )
        })}
      </ul>

      <ul>
        <h3>Weaknesses</h3>
        {types.map((type, index) => {
          return (
            <li key={index}>
              <input 
                type="checkbox"
                id={`weakness-checkbox-${index}`}
                name={type} 
                value={type} 
                checked={checkedStateWeakness[index]} 
                onChange={() => handleChangeWeakness(index, checkedStateWeakness, setCheckedStateWeakness)}
              />
              <label htmlFor={`weakness-checkbox-${index}`}>{type}</label>
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