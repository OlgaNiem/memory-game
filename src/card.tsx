import { GameCard } from "./types";
import React from "react";
import styles from './Card.module.css'

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
    className={`${styles.card} ${isCardFlipped ? styles.flipped : styles.notFlipped}`}
    disabled={isCardFlipped || isDisabled}
    onClick={handleClick}
    >
      {isCardFlipped ? card.value : "?"}
    </button>
  );
}
