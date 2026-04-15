import React, { useState, useEffect } from 'react';
import filmsData from './films_complet.json';
import './App.css';
import background from './assets/images/background.jpg';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [films, setFilms] = useState(filmsData);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    setFilteredFilms(films.slice(0, 50));
  }, [films]);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const results = films.filter(film => {
      if (!film) return false;
      const title = film.FILMS?.toLowerCase() || '';
      return title.includes(term);
    });
    setFilteredFilms(results);
  };

  const handleCheckboxChange = (reference) => {
    const updatedFilms = films.map(film => {
      if (film.reference === reference) {
        return {
          ...film,
          "VU Sylvain": film["VU Sylvain"] === 1 ? 0 : 1
        };
      }
      return film;
    });
    setFilms(updatedFilms);
  };

  // 🎬 Affiche avec fallback
  const getAffiche = (film) => {
    if (!film["Image"]) {
      return "/affiches/default-poster.jpg";
    }
    return `/affiches/${film.reference}.jpg`;
  };

  // 🎥 lien NAS vidéo
  const getVideoLink = (film) => {
    if (film["J'ai"] !== 1) return null;
    return `http://TON_NAS/videos/${encodeURIComponent(film.FILMS)}.mp4`;
  };

  // 🎭 lien NAS genre
  const getGenreLink = (genre) => {
    if (!genre) return null;
    return `http://TON_NAS/genres/${encodeURIComponent(genre)}`;
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="content">

        <h1>AMC</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Rechercher</button>
        </div>

        <div className="film-list">
          {filteredFilms.map(film => {
            const hasFilm = film["J'ai"] === 1;

            return (
              <div
                key={film.reference}
                className={`film-card ${!hasFilm ? 'not-owned' : ''}`}
                onClick={() => setSelectedFilm(film)}
                style={{
                  backgroundImage: `url(${getAffiche(film)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="overlay">

                  <h3>{film.FILMS}</h3>

                  <p>📅 {film["Année"]}</p>
                  <p>⏱️ {film["Durée"]}</p>

                  {film["Genre"] && (
                    <p>
                      🎭{' '}
                      <a
                        href={getGenreLink(film["Genre"])}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {film["Genre"]}
                      </a>
                    </p>
                  )}

                  {hasFilm && (
                    <a
                      href={getVideoLink(film)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🎥 Voir analyse
                    </a>
                  )}

                  <label onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={film["VU Sylvain"] === 1}
                      onChange={() => handleCheckboxChange(film.reference)}
                    />
                    Vu
                  </label>

                </div>
              </div>
            );
          })}
        </div>

        {/* 🎬 MODAL */}
        {selectedFilm && (
          <div className="modal" onClick={() => setSelectedFilm(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedFilm.FILMS}</h2>

              <p>🎬 Réalisateur : {selectedFilm["Réalisateur"]}</p>
              <p>🎭 Acteurs : {selectedFilm["Acteur"]}</p>
              <p>⭐ IMDb : {selectedFilm["Note_IMDB"]}</p>
              <p>❤️ Ma note : {selectedFilm["Ma note"]}</p>

              <button onClick={() => setSelectedFilm(null)}>Fermer</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
