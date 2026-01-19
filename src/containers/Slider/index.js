import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  /* Copie + tri des données (évite la mutation du context) */
  const byDateDesc = [...(data?.focus ?? [])].sort((a, b) =>
    new Date(a.date) < new Date(b.date) ? -1 : 1
  );

  /* Passage automatique au slide suivant */
  const nextCard = () => {
    setTimeout(() => {
      setIndex((prevIndex) =>
        (prevIndex + 1) % byDateDesc.length
      );
    }, 5000);
  };

  /* Relance le timer à chaque changement de slide */
  useEffect(() => {
    if (!byDateDesc.length) return;
    nextCard();
  }, [index, byDateDesc.length]);

  return (
    <div className="SlideCardList">
      {/* Slides */}
      {byDateDesc.map((item, idx) => (
        <div
          key={item.id}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={item.cover} alt={item.title} />

          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div>{getMonth(new Date(item.date))}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((item, radioIdx) => (
            <input
              key={item.id}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;