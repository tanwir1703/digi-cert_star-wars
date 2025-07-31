// src/features/movies/moviesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MovieService from './movieService';

// Async thunk for fetching all movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await MovieService.fetchAllMovies();
      return movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single movie by ID
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (movieId, { rejectWithValue }) => {
    try {
      const movie = await MovieService.fetchMovieById(movieId);
      return movie;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Movie list state
  items: [],
  loading: false,
  error: null,
  
  // Single movie details state
  selectedMovie: null,
  selectedMovieLoading: false,
  selectedMovieError: null,
  
  // UI state
  sortKey: 'release_date',
  sortAscending: true,
  
  // Statistics/metadata
  totalMovies: 0,
  lastFetched: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // UI actions
    setSortKey: (state, action) => {
      const { key, ascending } = action.payload;
      state.sortKey = key;
      state.sortAscending = ascending;
    },
    
    // Clear selected movie
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
      state.selectedMovieError = null;
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.selectedMovieError = null;
    },
    
    // Reset entire state
    resetMoviesState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Fetch all movies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalMovies = action.payload.length;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch movies';
        state.items = [];
        state.totalMovies = 0;
      });

    // Fetch single movie
    builder
      .addCase(fetchMovieById.pending, (state) => {
        state.selectedMovieLoading = true;
        state.selectedMovieError = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.selectedMovieLoading = false;
        state.selectedMovie = action.payload;
        state.selectedMovieError = null;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.selectedMovieLoading = false;
        state.selectedMovieError = action.payload || 'Failed to fetch movie details';
        state.selectedMovie = null;
      });
  },
});

// Action creators
export const { 
  setSortKey, 
  clearSelectedMovie, 
  clearErrors, 
  resetMoviesState 
} = moviesSlice.actions;

// Selectors
export const selectAllMovies = (state) => state.movies.items;
export const selectMoviesLoading = (state) => state.movies.loading;
export const selectMoviesError = (state) => state.movies.error;
export const selectSelectedMovie = (state) => state.movies.selectedMovie;
export const selectSelectedMovieLoading = (state) => state.movies.selectedMovieLoading;
export const selectSelectedMovieError = (state) => state.movies.selectedMovieError;
export const selectSortConfig = (state) => ({
  key: state.movies.sortKey,
  ascending: state.movies.sortAscending
});
export const selectMoviesStats = (state) => ({
  total: state.movies.totalMovies,
  lastFetched: state.movies.lastFetched
});

// Computed selectors
export const selectSortedMovies = (state) => {
  const movies = selectAllMovies(state);
  const { key, ascending } = selectSortConfig(state);
  return MovieService.sortMovies(movies, key, ascending);
};

export const selectMovieByEpisode = (state, episodeId) => {
  const movies = selectAllMovies(state);
  return movies.find(movie => movie.episode_id === parseInt(episodeId));
};

export const selectMoviesByDirector = (state, director) => {
  const movies = selectAllMovies(state);
  return movies.filter(movie => 
    movie.director.toLowerCase().includes(director.toLowerCase())
  );
};

export const selectMoviesGroupedByTrilogy = (state) => {
  const movies = selectAllMovies(state);
  
  return {
    original: movies.filter(movie => [4, 5, 6].includes(movie.episode_id)),
    prequel: movies.filter(movie => [1, 2, 3].includes(movie.episode_id)),
    sequel: movies.filter(movie => [7, 8, 9].includes(movie.episode_id))
  };
};

export default moviesSlice.reducer;