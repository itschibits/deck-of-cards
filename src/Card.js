import React from "react";

/** Shows an image of a card
 * 
 * Props:
 * -cardImage: {image, value, suit}
 * 
 * {Deck} -> Card
 */

function Card({ image, value, suit }) {
  return (
    <div className="Card">
      <img src={image} alt={`${value} of ${suit}`}></img>
    </div>
  )
}

export default Card;