import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://0.0.0.0:8000/word';
const WORD_LENGTH = 5;

function App() {
  const [guessWord, setGuessWord] = useState("");
  const [tries, setTries] = useState(Array(6).fill(null));
  const [currentTry, setCurrentTry] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      const response = await fetch(API);
      const data = await response.json();
      const randomWord = data["word"]
      setGuessWord(randomWord)
    }

    fetchWord()
  }, [])

  // keypress handle
  useEffect(() => {
    const handleKeyPress = (e) => {
      setWarning(false);
      const key = e.key;
      if(key == "Backspace"){
        setCurrentTry(prev => prev.slice(0, prev.length - 1))
        return;
      }
      else if(key == "Enter"){
        const currentIndex = tries.findIndex(val => val === null);
        if (currentIndex == tries.length - 1) {
          setShowModal(true)
          return;
        }

        if (!currentTry) return;
        if(currentTry.length < 5) {
          setWarning("Word is too short!");
          return;
        }

        const isCorrect = currentTry === guessWord;
        if (isCorrect){
          setGameWon(true)
          setShowModal(true)
        }

        setTries(prev => {
          const newTries = [...prev];
          newTries[currentIndex] = currentTry;
          setCurrentTry("");
          return newTries;
        })
        return;
      }

      if(currentTry.length >= 5) return;

      if(/^[a-zA-Z]$/.test(key)) setCurrentTry(prev => prev + key.toUpperCase());
      return;
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)

  }, [currentTry])

  return (
    <>
      <Header />
      {showModal && <Modal 
        theme={gameWon? "modal win" : "modal lose"} 
        header={gameWon? "Congratulations, You Won!" : "You Lost!"} 
        guessWord={guessWord}
        />}
      <div className='board'>
        {
          tries.map((guess, i) => {
            const isCurrentGuess = i === tries.findIndex(val => val === null);
            return <Line guess={isCurrentGuess? currentTry : guess ?? ""} key={i} guessWord={guessWord} isFinal={!isCurrentGuess && guess != null}/>
          })
        }
        {warning || "\u00A0"}
        </div>
    </>
  )
}

function Line({ guess, guessWord, isFinal }) {
  const tiles = []
  for (let i = 0; i < WORD_LENGTH; i++){
    const char = guess[i]
    let cls = "tile"
    if(isFinal){
      if(guessWord[i] == char){
        cls += " green"
      }
      else if(guessWord.includes(char)){
        cls += " yellow"
      }
    }
    tiles.push(<div key={i} className={cls}>{char}</div>)
  }

  return (
    <div className='line'>{tiles}</div>
  )
}

function Header(){
  return(
    <div className='header'>
      <div>
        <img src="./src/assets/bordle_text.jpeg" alt="" />
      </div>
      <div>
        <button onClick={() => window.location.reload()} className='retry_btn'>Retry</button>
      </div>
    </div>
  )
}

function Modal({ theme, header, guessWord }){
  return (
    <div className='modal_background'>
      <div className={theme}>
        <div className='header_outer'>
          <div className='header_inner'>
            <h4>{header}</h4>
            <br />
            <p>Guess word was: <span className='modal_span'>{guessWord}</span></p>
            </div>    
        </div>
        <button className='modal_button' onClick={() => window.location.reload()}>Try again</button>
      </div>
    </div>
  )
}

export default App
