function PokeTile({name, num, img}) {
  return(
    <>
      <div>
        <h1>{name}</h1>
        {/* <p>{props.id}</p> */}
        <p>#{num}</p>
        <img src={img} style={{width: '100px', height: '100px'}} alt={name}/>
      </div>
    </>
  )
}

export default PokeTile