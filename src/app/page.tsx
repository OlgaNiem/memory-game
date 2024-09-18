"use client";
import React from "react";
import { GameCard } from "@/types";
import { Card } from "@/card";
import { sql } from "@vercel/postgres";

function shuffleArray<T>(array: Array<T>): Array<T> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createGameCards(uniqueCards: number): GameCard[] {
  const gameCards = [] as GameCard[];
  for (let value = 0; value <= uniqueCards; value++) {
    gameCards.push({
      value,
      isMatched: false,
      id: `${value}-1`,
    });
    gameCards.push({
      value,
      isMatched: false,
      id: `${value}-2`,
    });
  }
  return shuffleArray(gameCards);
}

type Level = {
  cardCount: number;
  maxScore: number;
};

const levels: Level[] = [
  { cardCount: 3, maxScore: 8 },
  { cardCount: 4, maxScore: 10 },
  { cardCount: 5, maxScore: 12 },
  { cardCount: 6, maxScore: 14 },
  { cardCount: 7, maxScore: 16 },
];

const Page = () => {



  const [level, setLevel] = React.useState(0);
  const [gameCards, setGameCards] = React.useState(() =>
    createGameCards(levels[0].cardCount)
  );
  const [flippedCards, setFlippedCards] = React.useState([] as GameCard[]);
  const [score, setScore] = React.useState(0);

  const isDone = gameCards.every((gameCard) => gameCard.isMatched);

  React.useEffect(() => {
    const levelConfig = levels[level];
    if (!levelConfig) {
      setGameCards([]);
    } else {
      setGameCards(createGameCards(levelConfig.cardCount));
    }
    setScore(0);
  }, [level]);

  const handleCardFlip = React.useCallback(
    (gameCard: GameCard) => {
      if (!flippedCards.length) {
        setFlippedCards([gameCard]);
        return;
      }
      if (flippedCards.length !== 1) {
        return;
      }
      setScore((prev) => prev + 1);
      if (flippedCards[0].value === gameCard.value) {
        setGameCards((prevGameCards) =>
          prevGameCards.map((prevGameCard) =>
            [gameCard.id, flippedCards[0].id].includes(prevGameCard.id)
              ? { ...prevGameCard, isMatched: true }
              : prevGameCard
          )
        );
        setFlippedCards([]);
      } else {
        setFlippedCards((prev) => prev.concat(gameCard));
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    },
    [flippedCards]
  );

  // sanding data to  db
  async function saveGameData() {
    try {
      const response = await fetch("/api/gamedb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level, score }),
      });
      if (!response.ok) {
        throw new Error("Failed to save game data");
      }
      console.log("Game data saved successfully");
    } catch (error) {
      console.error("Error saving game data:", error);
    }
  }

  const handleRestart = async () => {
    // save data before restarting to
    await saveGameData();
    setGameCards(createGameCards(levels[level].cardCount));
    setScore(0);
  };

  const handleNextLevel = React.useCallback(async () => {
    await saveGameData();
    setLevel((prevLevel) => prevLevel + 1);
  }, []);

  if (!levels[level]) {
    return <h1>You Win!</h1>;
  }

  return (

    <div className="flex flex-col items-center my-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      <div className="flex flex-wrap justify-center mb-6">
        {gameCards.map((gameCard) => (
          <Card
            key={gameCard.id}
            card={gameCard}
            isFlipped={flippedCards.some(
              (flippedCard) => flippedCard.id === gameCard.id
            )}
            isDisabled={flippedCards.length === 2}
            onFlip={handleCardFlip}
          />
        ))}
      </div>
      <div>
        <p className='text-lg mb-2'>Level: {level + 1}</p>
        <p className='text-lg mb-2'>Score: {score}</p>
        {!isDone ? (
          <div>Remaining Moves: {levels[level].maxScore - score}</div>
        ) : score <= levels[level].maxScore ? (
          <>
            <p>Nice work!</p>
            <button
              className="p-2 bg-green-600 text-white text-lg rounded hover:bg-green-700 transition"
              onClick={handleNextLevel}
            >
              Next Level
            </button>
          </>
        ) : (
          <>
            <p className="mb-2">You were over by {score - levels[level].maxScore}</p>
            <button
              className="p-2 bg-red-600 text-white text-lg rounded hover:bg-red-700 transition"
              onClick={handleRestart}
            >
              Try Again?
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
