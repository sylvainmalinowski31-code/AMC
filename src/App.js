import React, { useState, useEffect } from 'react';
import filmsData from './films_complet.json';
import './App.css';
import background from './assets/images/background.jpg';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [films, setFilms] = useState(filmsData);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
  const currentYearFilms = films.filter(film => film["Année"] === currentYear);
  setFilteredFilms(currentYearFilms.length > 0 ? currentYearFilms : films.slice(0, 50));
}, [films]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      const currentYearFilms = films.filter(film => film["Année"] === currentYear);
      setFilteredFilms(currentYearFilms.length > 0 ? currentYearFilms : films.slice(0, 50));
      return;
    }
    const results = films.filter(film => {
      if (!film) return false;

      const fieldsToSearch = [
        film.FILMS,
        film.Genre,
        film["Réalisateur"],
        film.Acteur,
        film.Franchise,
        film["Genre 2nd"],
        film["MOTS CLEFS"]
      ];

      return fieldsToSearch.some(field =>
        field && field.toString().toLowerCase().includes(term)
      );
    });
    setFilteredFilms(results);
  };

  const handleCheckboxChange = (reference) => {
    const updatedFilms = films.map(film => {
      if (film.reference === reference) {
        return { ...film, "VU Sylvain": film["VU Sylvain"] === 1 ? 0 : 1 };
      }
      return film;
    });
    setFilms(updatedFilms);
  };

  const saveFilmsToJSON = () => {
    const jsonData = JSON.stringify(films, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'films_complet.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilmClick = (film) => {
    setSelectedFilm(film);
  };

  const closeModal = () => {
    setSelectedFilm(null);
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="content">
        <div className="header">
          <h1>AMC</h1>
          <button className="save-button" onClick={saveFilmsToJSON}>
            💾 SAUVEGARDE
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Rechercher</button>
        </div>

        <h2>Films {currentYear}</h2>
        <div className="film-list">
          {filteredFilms.length > 0 ? (
            filteredFilms.map(film => (
              <div key={film.reference} className={`film-card ${film["J'ai"] !== 1 ? 'not-owned' : ''}`} onClick={() => handleFilmClick(film)}>
                <h3>{film.FILMS}</h3>
                <p>Année: {film["Année"]}</p>
                <p>Genre: {film.Genre}</p>
                {film.Oscar > 0 && (
                  <div className="oscar-info">
                    <span className="oscar-wins">{film.Oscar} <span className="oscar-label">Oscar</span></span>
                    <img
                      src="https://e7.pngegg.com/pngimages/584/165/png-clipart-90th-academy-awards-damien-chazelle-statue-award-film-90th-academy-awards-thumbnail.png"
                      alt="Oscar"
                      className="oscar-icon"
                    />
                    <span className="oscar-nominations">{film["Nomination Oscar"]} <span className="oscar-label">Nominations</span></span>
                  </div>
                )}
                {film.Récompenses && <p>Récompenses: {film.Récompenses}</p>}
                {film["Genre 2nd"] && <p>Genre secondaire: {film["Genre 2nd"]}</p>}
                {film["Box Office"] && <p>Box Office: {film["Box Office"]}</p>}
                {film.Prod && <p>Production: {film.Prod}</p>}
                <a href="https://ug.link/dh2300-b20b-JOkk/filemgr/share-download/?id=074db48743cd459f911fc04af0d8c0c4" target="_blank" rel="noopener noreferrer" className="film-link">
                  Lien 
                </a>
                <label>
                  <input
                    type="checkbox"
                    checked={film["VU Sylvain"] === 1}
                    onChange={() => handleCheckboxChange(film.reference)}
                  />
                  Vu par Sylvain
                </label>
              </div>
            ))
          ) : (
            <p>Aucun film trouvé.</p>
          )}
        </div>
      </div>

      {selectedFilm && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <>
              <h2>{selectedFilm.FILMS}</h2>
              <p>Année: {selectedFilm["Année"]}</p>
              <p>Genre: {selectedFilm.Genre}</p>
              {selectedFilm["Genre 2nd"] && <p>Genre secondaire: {selectedFilm["Genre 2nd"]}</p>}
              <p>Réalisateur: {selectedFilm["Réalisateur"]}</p>
              <p>Acteurs: {selectedFilm.Acteur}</p>
              {selectedFilm["Disque Dur"] && <p>Disque Dur: {selectedFilm["Disque Dur"]}</p>}
              {selectedFilm.Go && <p>Taille: {selectedFilm.Go} Go</p>}
              {selectedFilm.Compositeur && <p>Compositeur: {selectedFilm.Compositeur}</p>}
              {selectedFilm.Budget && <p>Budget: {selectedFilm.Budget}</p>}
              {selectedFilm["Sortie ciné fr"] && <p>Sortie en France: {selectedFilm["Sortie ciné fr"]}</p>}
              {selectedFilm.Pays && <p>Pays: {selectedFilm.Pays}</p>}
              {selectedFilm.Franchise && <p>Franchise: {selectedFilm.Franchise}</p>}
              {selectedFilm.Style && <p>Style: {selectedFilm.Style}</p>}
              {selectedFilm.Origines && <p>Origines: {selectedFilm.Origines}</p>}
              {selectedFilm.Public && <p>Public: {selectedFilm.Public}</p>}
              <a href="https://ug.link/dh2300-b20b-JOkk/filemgr/share-download/?id=074db48743cd459f911fc04af0d8c0c4" target="_blank" rel="noopener noreferrer" className="film-link">
                Lien
              </a>
            </>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;