import { useEffect, useState, useCallback } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tri par date décroissante (plus récent au plus ancien)
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

  // Navigation vers la slide suivante
  const nextCard = useCallback(() => {
    if (!byDateDesc || byDateDesc.length === 0) {
      return;
    }
    setIndex((prevIndex) =>
      prevIndex + 1 < byDateDesc.length ? prevIndex + 1 : 0
    );
  }, [byDateDesc]);

  // Fonction supprimée car non utilisée

  // Navigation directe vers une slide (clic sur les points)
  const goToSlide = useCallback((slideIndex) => {
    setIndex(slideIndex);
  }, []);

  // Toggle pause/play
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Gestion de la touche espace uniquement
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Empêche le scroll de la page
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePause]);

  // Auto-défilement avec timer
  useEffect(() => {
    if (!isPaused && byDateDesc && byDateDesc.length > 1) {
      const timer = setTimeout(() => {
        nextCard();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [index, isPaused, nextCard, byDateDesc]);

  if (!byDateDesc || byDateDesc.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="SlideCardList">
      {/* Les slides */}
      {byDateDesc.map((event) => {
        const slideId = event.id || event.title || Math.random().toString();
        const slideIndex = byDateDesc.indexOf(event);
        return (
          <div
            key={`slide-${slideId}`}
            className={`SlideCard SlideCard--${
              index === slideIndex ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Points de navigation */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event) => {
            const slideId = event.id || event.title || Math.random().toString();
            const slideIndex = byDateDesc.indexOf(event);
            return (
              <input
                key={`radio-${slideId}`}
                type="radio"
                name="radio-button"
                checked={index === slideIndex}
                onChange={() => goToSlide(slideIndex)}
                aria-label={`Aller à la slide ${slideIndex + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slider;
