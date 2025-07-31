// src/features/movies/MovieService.js
const API_BASE_URL = 'https://swapi.info/api';

class MovieService {
  /**
   * Fetch all Star Wars films from SWAPI
   * @returns {Promise<Array>} Array of movie objects
   */
  static async fetchAllMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/films`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // The API returns an array directly based on your sample data
      return this.transformMovieData(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }
  }

  /**
   * Fetch a single movie by ID
   * @param {string|number} movieId - The movie ID
   * @returns {Promise<Object>} Movie object
   */
  static async fetchMovieById(movieId) {
    try {
      const response = await fetch(`${API_BASE_URL}/films/${movieId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformSingleMovie(data.result || data);
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error);
      throw new Error(`Failed to fetch movie: ${error.message}`);
    }
  }

  /**
   * Transform array of movies from API format to our format
   * @param {Array} movies - Raw movie data from API
   * @returns {Array} Transformed movie data
   */
  static transformMovieData(movies) {
    return movies.map(movie => this.transformSingleMovie(movie));
  }

  /**
   * Transform single movie from API format to our format
   * @param {Object} movie - Raw movie data from API
   * @returns {Object} Transformed movie data
   */
  static transformSingleMovie(movie) {
    // The API response directly contains the movie properties
    return {
      uid: movie.episode_id?.toString() || Math.random().toString(),
      title: movie.title,
      episode_id: movie.episode_id,
      opening_crawl: movie.opening_crawl?.replace(/\r\n/g, '\n'), // Clean up line breaks
      director: movie.director,
      producer: movie.producer,
      release_date: movie.release_date,
      characters: movie.characters || [],
      planets: movie.planets || [],
      starships: movie.starships || [],
      vehicles: movie.vehicles || [],
      species: movie.species || [],
      created: movie.created,
      edited: movie.edited,
      url: movie.url
    };
  }

  /**
   * Format release date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  static formatReleaseDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Sort movies by specified key
   * @param {Array} movies - Array of movies
   * @param {string} sortKey - Key to sort by
   * @param {boolean} ascending - Sort order
   * @returns {Array} Sorted movies
   */
  static sortMovies(movies, sortKey, ascending = true) {
    return [...movies].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (!valA || !valB) return 0;

      // Handle numeric sorting for episode_id
      if (sortKey === 'episode_id') {
        return ascending ? valA - valB : valB - valA;
      }

      // Handle date sorting
      if (sortKey === 'release_date') {
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        return ascending ? dateA - dateB : dateB - dateA;
      }

      // Handle string sorting
      return ascending
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }
}

export default MovieService;