import { GameCard } from "./types";
import React from "react";

type CardProps = {
  card: GameCard;
  isFlipped: boolean;
  isDisabled: boolean;
  onFlip(GameCard: GameCard): void;
};

export function Card({ card, isFlipped, isDisabled, onFlip }: CardProps) {
  const handleClick = React.useCallback(() => {
    if (!isFlipped && !isDisabled && !card.isMatched) {
      onFlip(card);
    }
  }, [onFlip, card, isFlipped, isDisabled]);

  const isCardFlipped = card.isMatched || isFlipped;

  return (
    <button
      className={`flex justify-center border-2 border-purple-950 p-10 m-2 w-1/5
        ${isCardFlipped ? "bg-green-200" : "bg-red-200"}`}
      disabled={isCardFlipped || isDisabled}
      onClick={handleClick}
    >
      {isCardFlipped ? card.value : "?"}
    </button>
  );
}
