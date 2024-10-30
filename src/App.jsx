import { useState, useEffect } from 'react';
import './App.css';
const initial = "Aligning items in a flex container."
const splitted = initial.split(' ').map(word => [...word, ' '])
console.log(splitted.flat())

function App() {
  const [input, setInput] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [words, setWords] = useState(0)
  const [isTyping, setTyping] = useState(false)
  const [seconds, setSeconds] = useState(60)
  const [wpm, setWPM] = useState(0)
  const [progress, setProgress] = useState(0)

  const totalCharacters = splitted.flat().length

  useEffect(() => {
    let timer
    if (isTyping && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000)
    } else if (seconds === 0) {
      clearInterval(timer)
      calculateWPM()
      setTyping(false)
    }
    return () => clearInterval(timer)
  }, [isTyping, seconds])

  const calculateWPM = () => {
    const totalTime = (60 - seconds) / 60
    setWPM(Math.floor(words / totalTime))
  }

  const handleChange = (e) => {
    const currentInput = e.target.value
    setInput(currentInput)

    if (!isTyping) {
      setTyping(true)
    }

    const currentWord = splitted[wordIndex]

    if (currentInput[currentInput.length - 1] === ' ') {
      if (charIndex === currentWord.length - 1) {
        if (wordIndex + 1 === splitted.length) {
          setTyping(false)
          calculateWPM()
          setInput('')
          return
        }
        setWordIndex(prevIndex => prevIndex + 1)
        setCharIndex(0)
        setInput('')
        setWords(prev => prev + 1)
      }
    } else if (currentInput[charIndex] === currentWord[charIndex]) {
      setCharIndex(prev => prev + 1)
    }
    
    const currentCharacters = splitted.slice(0, wordIndex).flat().length + charIndex + 1
    setProgress((currentCharacters / totalCharacters) * 100)

  }

  const handleClick = () => {
    setWords(0)
    setWordIndex(0)
    setCharIndex(0)
    setSeconds(60)
    setInput('')
    setTyping(false)
    setWPM(0)
    setProgress(0)
  };

  return (
    <div className="app-wrapper">
      <div className='app'>
        <div className="heading">
          <h1>
            {!isTyping && words > 0 ? (
              <> Finished: <span style={{ color: 'aqua' }}>{wpm}</span> wpm </>
            ) : (
              <> {seconds} seconds left</>
            )}
          </h1>
          <div className="words-number">
            <p>Words typed: {words}</p>
          </div>
        </div>


        <div className="progress">
          <div className="object" style={{ left: `${progress}%`}} >
            <img src="/images/progress-car.png" alt="" />
          </div>
        </div>

        <div className="text">
          {splitted.map((word, wordIdx) => (
            <span key={wordIdx}>
              {word.map((char, charIdx) => (
                <span
                  key={charIdx}
                  style={{
                    color:
                      wordIdx < wordIndex ||
                      (wordIdx === wordIndex && charIdx < charIndex)
                        ? 'white'
                        : 'rgb(157, 156, 156)'
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>

        <div className="flexbox">
          <input
            type="text"
            placeholder="Type the above text here when the race begins"
            value={input}
            onChange={handleChange}
            disabled={!isTyping && seconds === 0}
          />

          <button onClick={handleClick} className='restart-btn'>Restart</button>
        </div>
      </div>
    </div>
  );
}

export default App
