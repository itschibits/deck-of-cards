import Card from "./Card";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck/";

/** A deck of cards 
 * 
 * Deck actions: Gets a new deck of cards (via deckId), draws a new card
 * 
 * App --> Deck --> Card
*/
function Deck() {
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  /** Draws a deck of cards at initial render
   * Gets a deck ID
   */
  useEffect(function fetchDeckWhenMounted() {
    async function fetchDeck () {
      const deckResult = await axios.get(`${BASE_URL}new/`);
      setDeckId(deckResult.data.deck_id);
    }
    fetchDeck();
  }, []);

  /** Draws a card from a deck
   * Only activates when button is clicked
   */
  useEffect(function drawCardOnCardDraw() {
    async function drawCard() {
      try{
        const cardResult = await axios.get(`${BASE_URL}${deckId}/draw`);
        setCards(cards => 
            [...cards, {drawnCards:cardResult.data.cards}]);
      } catch {
      }
        setIsClicked(false);
    } 
    if(isClicked === true && deckId) drawCard();
  }, [isClicked]);

  /** Sets isClicked state to true when draw button is clicked */
  function handleDraw(evt) {
    console.log("Button clicked");
    setIsClicked(true);
  }
  console.log("all cards--->", cards)

  return (
    <div>
      {(cards.length === 52) ?
      <h2>Error: no cards remaining!</h2> 
      :<div>
        <button onClick={handleDraw}>GIMME A CARD!</button>
        {cards.map(card =>(
          <Card key={card.drawnCards[0].code} 
                image={card.drawnCards[0].image}
                value={card.drawnCards[0].value} 
                suit={card.drawnCards[0].suit}/>
        ))}
      </div>
      }
    </div>
  )
}

export default Deck;