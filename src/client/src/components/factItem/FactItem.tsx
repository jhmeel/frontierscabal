import { useState } from 'react'
import fcabal from '../../assets/logos/fcabal.png'
import { IconHeartFill, IconQuote } from '../../assets/icons'
import styled,{ThemeProvider} from 'styled-components'

const FactItem = ({category, fact}) => {
  const [isFilled, setIsFilled] = useState(false)

  const toggleFill = ()=>{
    setIsFilled(!isFilled)
  }

  return (
<>
    <FactItemRenderer>
    <img className='f-card-logo' src={fcabal} alt='fcabal'/>
    <h3 className="f-card-name">DID YOU KNOW?</h3>
    <div className="quote">
    <IconQuote/>
    </div>
    <div className={"f-body-text-max"}>{fact}</div>
     <IconHeartFill className='f-iconHeart' onClick={toggleFill} fill={isFilled? 'crimson': 'gray'}/>
    </FactItemRenderer>
</>
  )
}

export default FactItem

const FactItemRenderer = styled.div`
    display: flex;
    position: relative;
    max-width: 300px;
    min-width: 300px;
    min-height: 400px;
    max-height: 400px;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 12px;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    transition: all 0.2s ease-out;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
    background-color: white;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  .f-card:hover {
    transform: scale(1.01);
  }
  
  .f-card:hover:before {
    transform: scale(2.15);
  }
  
  .quote {
    position: absolute;
    opacity: 0.2;
    transform: 0.3s ease-out;
  }
  
  .f-card-name {
    text-transform: uppercase;
    font-weight: 700;
    color: #ccc;
    padding: 35px;
    font-family: cursive;
  }
  .f-card:hover h3 {
    transition: all 0.3s ease-out;
    color: #fff;
  }
  
  .f-body-text-max {
  
    padding: 6px 12px;
    color: #176984;
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 15px;
  }
  
  .f-card-logo {
    height: auto;
    width: 70px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .f-iconHeart {
    cursor: pointer;
    transition: all 0.3s ease-out;
  }
  .f-iconHeart:hover {
    transform: scale(1.4);
  }
  
`