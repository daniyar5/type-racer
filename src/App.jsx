import { useState, useEffect } from 'react';
import './App.css';

const initial = "Effective project management requires you to have the right tools and techniques at hand, so you can stay organized and focused on what needs to be done."
const splitted = initial.split(' ').map(word => [...word, ' '])

function App() {
  const [input, setInput] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [words, setWords] = useState(0)
  const [isTyping, setTyping] = useState(false)
  const [seconds, setSeconds] = useState(80)
  const [wpm, setWPM] = useState(0)

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
    const totalTime = (80 - seconds) / 60
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
          console.log('were here')
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
  }

  const handleClick = () => {
    setWords(0)
    setWordIndex(0)
    setCharIndex(0)
    setSeconds(80)
    setInput('')
    setTyping(false)
    setWPM(0)
  };

  return (
    <div className='app'>
      <div className="time">
        <h1 style={{color: !isTyping && words > 0 ? 'lightblue': 'yellow' }}>{seconds} seconds</h1>
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
      <input
        type="text"
        placeholder="Type the above text here when the race begins"
        value={input}
        onChange={handleChange}
        disabled={!isTyping && seconds === 0}
      />
      <div className="info">
        <p className='words-number'>Words typed: {words}</p>
        <h1>
          {!isTyping && words > 0 ? (
            <> Finished: <span style={{ color: 'yellow' }}>{wpm}</span> wpm </>
          ) : (
            ""
          )}
        </h1>
      </div>
      <button onClick={handleClick} className='restart-btn'>Restart</button>
    </div>
  );
}

export default App
