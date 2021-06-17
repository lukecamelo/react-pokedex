function PokeTile({name, num, img, type, weaknesses}) {
  return(
    <>
      <div>
        <h1>{name}</h1>
        <p><strong>type</strong></p>
        {type.map((type, key) => <p key={key}>{type}</p>)}
        <p><strong>weaknesses</strong></p>
        {weaknesses.map((weakness, key) => <p key={key}>{weakness}</p>)}
        <p>#{num}</p>
        <img src={img} style={{width: '100px', height: '100px'}} alt={name}/>
      </div>
    </>
  )
}

export default PokeTile