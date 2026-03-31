import React, { useState } from 'react';
import filmsData from './films_complet.json';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFilms, setFilteredFilms] = useState([]);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const results = filmsData.filter(film => {
      // Vérifie si le film ou ses champs existent
      if (!film) return false;

      // Recherche dans le titre
      if (film.titre && typeof film.titre === 'string' && film.titre.toLowerCase().includes(term)) {
        return true;
      }

      // Recherche dans le réalisateur
      if (film.realisateur && typeof film.realisateur === 'string' && film.realisateur.toLowerCase().includes(term)) {
        return true;
      }

      // Recherche dans les acteurs
      if (film.acteur && typeof film.acteur === 'string' && film.acteur.toLowerCase().includes(term)) {
        return true;
      }

      // Recherche dans le genre
      if (film.genre && typeof film.genre === 'string' && film.genre.toLowerCase().includes(term)) {
        return true;
      }

      // Recherche dans les mots-clés
      if (film.mots_cles && typeof film.mots_cles === 'string' && film.mots_cles.toLowerCase().includes(term)) {
        return true;
      }

      // Recherche dans le pays
      if (film.pays && typeof film.pays === 'string' && film.pays.toLowerCase().includes(term)) {
        return true;
      }

      // Recherche dans la maison de production
      if (film.maison_production && typeof film.maison_production === 'string' && film.maison_production.toLowerCase().includes(term)) {
        return true;
      }

      return false;
    });

    setFilteredFilms(results);
    console.log('Résultats de la recherche:', results);
  };

  return (
    <div className="App">
      <h1>Ma Collection de Films</h1>
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
        {filteredFilms.length > 0 ? (
          filteredFilms.map(film => (
            <div key={film.reference} className="film-name">
              {film.titre}
            </div>
          ))
        ) : (
          <p>Aucun film trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default App;