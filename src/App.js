import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dieNumbers, setDieNumbers] = React.useState(allNewDice());
  const [tenzies, setTenziers] = React.useState(false);

  React.useEffect(() => {
    //check if all die are held and if so, set tenzies to true
    const actualDie = dieNumbers[0];
    const isWinner = dieNumbers.filter(
      (item) => item.isHeld && item.value === actualDie.value
    );
    if (isWinner.length === 10) {
      setTenziers((prevState) => !prevState);
    }
    
  }, [dieNumbers]);
  
  function playAgain() {
    if (tenzies || badGame()) {
      setDieNumbers(allNewDice());
      setTenziers(false);
      
    }
  }

  function rollNumbers() {
    setDieNumbers((die) => {
      const newDice = allNewDice();
      return die.map((dice) => {
        return dice.isHeld ? dice : newDice.shift();
      });
    });
  }

  function handleDice(idCurrentDice) {
    setDieNumbers((prevState) => {
      let newArreglo = [];
      for (let i = 0; i < prevState.length; i++) {
        const currentItem = prevState[i];
        if (currentItem.id === idCurrentDice) {
          newArreglo.push({ ...currentItem, isHeld: !currentItem.isHeld });
        } else {
          newArreglo.push(currentItem);
        }
      }
      return newArreglo;
    });
  }

  function allNewDice() {
    let arreglo = [];
    const arregloSize = 10;
    const min = Math.ceil(1);
    const max = Math.floor(6);
    for (let i = 0; i < arregloSize; i++) {
      arreglo[i] = {
        id: nanoid(),
        value: Math.floor(Math.random() * (max - min + 1) + min),
        isHeld: false,
      };
    }
    return arreglo;
  }

  const die = dieNumbers.map((item) => {
    return (
      <Die
        key={item.id}
        id={item.id}
        value={item.value}
        isHeld={item.isHeld}
        handleDice={handleDice}
      />
    );
  });

  function badGame(){
    const selectedDice=dieNumbers.filter((item) => item.isHeld).length
    if(!tenzies && selectedDice === 10 )
      return true
    else
      return false
    
  }

  function button_text(){
    
    if(tenzies || badGame()) 
    {
      return "Play Again"
    } else {
      return "Roll"
    }
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="container">{die}</div>
      { badGame() && <p> You lose &#128542;</p> } 
      
      <button
        className="roll_button"
        onClick={() => {
          rollNumbers();
          playAgain();
        }}
      >
        {button_text()}
      </button>
    </main>
  );
}
