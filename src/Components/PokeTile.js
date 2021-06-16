function PokeTile({name, num, img, type}) {
  return(
    <>
      <div>
        <h1>{name}</h1>
        {type.map(type => <p>{type}</p>)}
        <p>#{num}</p>
        <img src={img} style={{width: '100px', height: '100px'}} alt={name}/>
      </div>
    </>
  )
}

export default PokeTile