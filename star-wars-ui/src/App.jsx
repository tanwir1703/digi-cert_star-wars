import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MovieList from './pages/MovieList';
import './index.css';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:id" element={<MovieList />} />
            <Route path="*" element={<Navigate to="/movies" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}