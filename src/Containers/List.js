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
  
  // This function has a bit too many arguments, this is another thing I would look to refactor
  function handleChange(position, checkedState, setCheckedState, property, setFiltered) {
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
      } else if(pokemon[property].some(type => selectedTypes.includes(type)) && selectedTypes.length < 2) {
        return pokemon
      } else if (selectedTypes.length >= 2) {
        // I am not happy with this solution, and in a professional environment I would work to refactor this
        let matches = []

        selectedTypes.forEach(type => {
          if (pokemon[property].includes(type)) {
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

    setFiltered(filtered)
  }

  let pokemonToDisplay = filteredPokemon.filter(pokemon => {
    if (inputValue == null || pokemon.name.toLowerCase().includes(inputValue.toLowerCase())) {
      return pokemon
    }
  }).map((pokemon, key) => 
    <PokeTile 
      name={pokemon.name} 
      id={pokemon.id} 
      num={pokemon.num} 
      img={pokemon.img} 
      type={pokemon.type} 
      weaknesses={pokemon.weaknesses} 
      key={key}
    />
  )

  return(
    <>
      <div style={{margin: '1em'}}>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <label>search for a 'mon!</label>
          <input type="text" onChange={e => setInputValue(e.target.value)}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
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
                    onChange={() => handleChange(index, checkedStateType, setCheckedStateType, "type", setFilteredByType)}
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
                    onChange={() => handleChange(index, checkedStateWeakness, setCheckedStateWeakness, "weaknesses", setFilteredByWeaknesses)}
                  />
                  <label htmlFor={`weakness-checkbox-${index}`}>{type}</label>
                </li>
              )
            })}
          </ul>
        </div>

        <ul style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          {pokemonToDisplay}
        </ul>
      </div>
      
    </>
  )
}

export default List