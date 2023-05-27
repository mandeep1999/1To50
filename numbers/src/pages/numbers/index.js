import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.css';
import { generateNumbers, shuffle } from '../../utility/NumbersUtility';
import errorSound from '../../assets/error_sound.mp3';
import successSound from '../../assets/success_sound.mp3';

const VISIBILITY_STATE = {
  VISIBLE: 'VISIBLE',
  HIDDEN: 'HIDDEN',
  NONE: 'NONE',
};

const VISIBILITY_STATE_TO_CLASSNAME = {
  [VISIBILITY_STATE.VISIBLE]: 'blue',
  [VISIBILITY_STATE.HIDDEN]: 'green',
  [VISIBILITY_STATE.NONE]: 'removeCell',
};

const runSoundEffect = (audioElement, src, { volume = 0.3 } = {}) => {
  audioElement.volume = volume;
  audioElement.src = src;
  audioElement.play();
};

const checkIsGameFinished = (gridVisibility) =>
  gridVisibility.every((item) => item === VISIBILITY_STATE.NONE);

const NumberGame = ({ onRestart }) => {
  const [isTimerEnabled, enableTimer] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const { initialGrid, finalGrid } = useMemo(
    () => ({
      initialGrid: shuffle(generateNumbers(1, 25)),
      finalGrid: shuffle(generateNumbers(26, 50)),
    }),
    []
  );
  const [gridVisibility, setGridVisibility] = useState(() =>
    Array(25).fill(VISIBILITY_STATE.VISIBLE)
  );

  const lastElementRef = useRef(0);
  const audioRef = useRef(null);

  const updateItemVisibility = (idxToUpdate) => {
    const updatedGridVisibility = gridVisibility.map((item, idx) => {
      if (idx === idxToUpdate && item === VISIBILITY_STATE.VISIBLE) {
        return VISIBILITY_STATE.HIDDEN;
      }
      if (idx === idxToUpdate && item === VISIBILITY_STATE.HIDDEN) {
        return VISIBILITY_STATE.NONE;
      }
      return item;
    });
    setGridVisibility(updatedGridVisibility);
    const isGameFinished = checkIsGameFinished(updatedGridVisibility);
    if (isGameFinished) {
      enableTimer(false);
    }
  };

  const onNumberClick = (element, idxToUpdate) => () => {
    if (!isTimerEnabled) {
      enableTimer(true);
    }
    const lastElement = lastElementRef.current;
    const audioElement = audioRef.current;
    if (lastElement + 1 !== element) {
      runSoundEffect(audioElement, errorSound);
      return;
    }

    lastElementRef.current = element;
    runSoundEffect(audioElement, successSound);
    updateItemVisibility(idxToUpdate);
  };

  useEffect(() => {
    let timerId;
    if (isTimerEnabled) {
      timerId = setInterval(function () {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isTimerEnabled]);

  const isGameFinished = checkIsGameFinished(gridVisibility);

  return (
    <div className='numbersPage'>
      <div className='boxWrapper'>
        {isGameFinished === true ? (
          <div style={{ padding: '30px' }}>
            <p>
              Your Score: <b style={{ color: 'red' }}> {timer}s </b>
            </p>
            <button onClick={onRestart} className='restartButton'>
              Restart
            </button>
          </div>
        ) : (
          <div>
            <div className='boxTopRow'>
              Time : <b style={{ marginLeft: '5px' }}> {timer}s</b>
            </div>
            <div className='container'>
              <div className='numbersBox box'>
                {initialGrid.map((item, idx) => {
                  const itemVisibilityState = gridVisibility[idx];
                  const itemToShow =
                    itemVisibilityState === VISIBILITY_STATE.VISIBLE
                      ? item
                      : finalGrid[idx];
                  const className =
                    VISIBILITY_STATE_TO_CLASSNAME[itemVisibilityState];
                  return (
                    <div
                      className={`numbersCell ${className}`}
                      key={item}
                      onClick={onNumberClick(itemToShow, idx)}
                    >
                      {itemToShow}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default NumberGame;
