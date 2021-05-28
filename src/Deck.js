import Card from "./Card";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck/";

/** A deck of cards 
 * 
 * Deck actions: Gets a new deck of cards (via deckId), draws a new card, shuffles the deck
 * 
 * App --> Deck --> Card
*/
function Deck() {
  const [cards, setCards] = useState([]);
  const [deckId, setDeckId] = useState("");
  const [toDraw, setToDraw] = useState(false); // isDrawing
  const [toShuffle, setToShuffle] = useState(false); //hasShuffled, isShuffle

  /** Draws a deck of cards at initial render
   * Gets a deck ID
   */
  // We can also store the entire deck result to get #remaining, first card etc
  useEffect(function fetchDeckWhenMounted() {
    async function fetchDeck() {
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
      try {
        const cardResult = await axios.get(`${BASE_URL}${deckId}/draw`);
        const { code, image, value, suit } = cardResult.data.cards[0];
        setCards(cards => [...cards, { code, image, value, suit }]);
      } catch (err) {
        console.error(err);
      }
      setToDraw(false);
    }
    if (toDraw === true) drawCard();
  }, [toDraw, deckId]);

  /** Shuffles the deck
 * Only activates when shuffle button is clicked
 */
  useEffect(function shuffleDeckAndSetToShuffle() {
    async function shuffleDeck() {
      try {
        await axios.get(`${BASE_URL}${deckId}/shuffle`);
        setCards([]);
      } catch (err) {
        console.error(err);
      }
      setToShuffle(false);
    }
    if (toShuffle === true) shuffleDeck();
  }, [toShuffle, deckId]);


  /** Sets toDraw state to true when draw button is clicked */
  function handleDraw(evt) { // just draw
    console.log("Button clicked");
    setToDraw(true);
  }


  /** Sets toShuffle state to true when draw button is clicked */
  function handleShuffle(evt) { // shuffle-- startShuffle
    if (toShuffle) return;
    console.log("shuffled!!!")
    setToShuffle(true)
  }

  /** renders the deck of cards */
  function renderCards() {
    return cards.map(card => (
      <Card key={card.code}
        image={card.image}
        value={card.value}
        suit={card.suit} />
    ))
  }
  /** renders error message when deck is depleted*/
  function renderError() {
    return <h2>Error: no cards remaining!</h2>
  }

  return (
    <div>
      <button onClick={handleShuffle}>Shuffle!</button>
      {(cards.length === 52) ?
        { renderError }
        : <div>
          <button onClick={handleDraw}>GIMME A CARD!</button>
          {renderCards()}
        </div>
      }
    </div>
  )
}

export default Deck;