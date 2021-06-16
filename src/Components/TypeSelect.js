function TypeSelect({types}) {
  return(
    <>
      <select>
        {types.map(type => <option key={type}>{type}</option>)}
      </select>
    </>
  )
}

export default TypeSelect