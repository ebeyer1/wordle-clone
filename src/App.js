import {useCallback, useEffect, useState} from "react";

import './App.css';
import WORDS, { ALPHABET } from "./words";

const MAX_WORD_LENGTH = 5;

const incorrectStyle = {
  backgroundColor: 'black',
  color: 'black'
};

const correctStyle = {
  backgroundColor: 'lightgreen',
  color: 'black'
};

const closeStyle = {
  backgroundColor: 'yellow',
  color: 'black'
};

const contains = (word, letter) => {
  return word.indexOf(letter) > -1;
}

const getStyle = (letter, word, idx) => {
  const index = word.indexOf(letter);
  if (index === idx) return correctStyle;
  if (index > -1) return closeStyle;
  return null;
}

const getWord = () => WORDS[Math.floor(Math.random()*WORDS.length)];

function App() {
  const [targetWord, setTargetWord] = useState('');
  const [attemptCount, setAttemptCount] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [word, setWord] = useState('');
  const [won, setWon] = useState(false);
  const [attemptedAlphabet, setAttemptedAlphabet] = useState([]);

  const setupNewWord = () => {
    const theTargetWord = getWord();
    setTargetWord(theTargetWord);
    const alphabetList = [];
    for (let i = 0; i < ALPHABET.length; i++) {
      alphabetList.push({});
    }
    setAttemptedAlphabet(alphabetList);
  };

  useEffect(() => {
    setupNewWord();
  }, []);

  const enterText = (evt) => {
    const typedText = evt.target.value;
    console.log('thing', typedText);
    if (typedText.length <= MAX_WORD_LENGTH) {
      setWord(typedText);
    }
  };

  const checkForEnterKey = (evt) => {
    console.log('key code', evt.keyCode);
    if (evt.keyCode === 13 && word.length === MAX_WORD_LENGTH) {
      submitWord();
    }
  };

  const submitWord = useCallback(() => {
    console.log('calling submit', word, word.charCodeAt(0), word.charCodeAt(1), word.charCodeAt(2));
    submissions.push({
      first: {
        letter: word[0],
        style: getStyle(word[0], targetWord, 0)
      },
      second: {
        letter: word[1],
        style: getStyle(word[1], targetWord, 1)
      },
      third: {
        letter: word[2],
        style: getStyle(word[2], targetWord, 2)
      },
      fourth: {
        letter: word[3],
        style: getStyle(word[3], targetWord, 3)
      },
      fifth: {
        letter: word[4],
        style: getStyle(word[4], targetWord, 4)
      }
    });
    const alphabetTries = [...attemptedAlphabet];
    for(let i = 0; i < word.length; i++) {
      const usesLetter = contains(targetWord, word[i]);
      const triesIndex = word.charCodeAt(i) - 97;
      if (usesLetter) {
        alphabetTries[triesIndex] = correctStyle;
      } else {
        alphabetTries[triesIndex] = incorrectStyle;
      }
    }

    if (word === targetWord) {
      setWon(true);
    }

    setWord('');
    setSubmissions(submissions);
    setAttemptCount(attemptCount + 1);
    setAttemptedAlphabet(alphabetTries);
  }, [attemptCount, word, targetWord]);

  const nextWord = () => {
    setSubmissions([]);
    setAttemptCount(1);
    setupNewWord();
    setWord('');
    setWon(false);

    document.getElementById('word-input').focus();
  };

  return (
    <div className="App">
      <header className="App-header">
        Wordle Clone
      </header>
      <div>
        <ul>
        {submissions.map((submission, idx) => (
            <li key={idx} className={'submission'}>
              <span style={submission.first.style}>{submission.first.letter}</span>
              <span style={submission.second.style}>{submission.second.letter}</span>
              <span style={submission.third.style}>{submission.third.letter}</span>
              <span style={submission.fourth.style}>{submission.fourth.letter}</span>
              <span style={submission.fifth.style}>{submission.fifth.letter}</span>
            </li>
        ))}
        </ul>
        <br />
        <br />
        <br />
        <input id={'word-input'} type="text" onChange={enterText} onKeyUp={checkForEnterKey} placeholder={'type word'} value={word} />
        <button onClick={submitWord}>Submit</button>
        <br />
        <br />
        {won ? (
            <button onClick={nextWord}>Next Word</button>
        ) : null}
        <br />
        <br />
        <div className={'alphabet-box'}>
          {attemptedAlphabet.map((attempt, idx) => (
              <span className='alphabet-letters' key={idx} style={attempt}>{ALPHABET[idx]}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
