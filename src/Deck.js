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
  // We can also store the entire deck result to get #remaining, first card etc
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
  useEffect(function drawCardAndSetCards() {
    async function drawCard() {
      try{
        const cardResult = await axios.get(`${BASE_URL}${deckId}/draw`);
        setCards(cards => 
            [...cards, {code:cardResult.data.cards[0].code,
                        image:cardResult.data.cards[0].image,
                        value:cardResult.data.cards[0].value,
                        suit:cardResult.data.cards[0].suit
                      }]);
      } catch(err) {
        console.log(err);
      }
      setIsClicked(false);
    } 
    if(isClicked === true && deckId) drawCard();
  }, [isClicked, deckId]);

  /** Sets isClicked state to true when draw button is clicked */
  function handleDraw(evt) {
    console.log("Button clicked");
    setIsClicked(true);
  }
  console.log("all cards--->", cards)

  function renderCards(){
    return cards.map(card =>(
      <Card key={card.code} 
            image={card.image}
            value={card.value} 
            suit={card.suit}/>
    ))
  }

  return (
    <div>
      {(cards.length === 52) ?
      <h2>Error: no cards remaining!</h2> 
      :<div>
        <button onClick={handleDraw}>GIMME A CARD!</button>
        {renderCards()}
      </div>
      }
    </div>
  )
}

export default Deck;