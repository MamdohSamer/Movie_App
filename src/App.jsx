import React, { useEffect, useState } from 'react';
import Search from './Search';
import Moviecard from './moviecard';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'get',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [errormessage, setErrormessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [isloding, setIsloding] = useState(false);
  const [debounce_search, setdebounce_search] = useState('');

  useDebounce(() => setdebounce_search(search), 1500, [search]);

  const fetchmovie = async (query = "", pageNumber = 1) => {
    setErrormessage("");
    setIsloding(true);

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNumber}`;

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      setTotalPages(data.total_pages || 1);

      if (!response.ok) {
        throw new Error(data.status_message || "Failed to fetch movies");
      }

      setMovies((prevMovies) =>
        pageNumber === 1 ? data.results : [...prevMovies, ...data.results]
      );
    } catch (error) {
      console.error(`Error fetching ${error}`);
      setErrormessage("Error fetching movies. Please try again later.");
    } finally {
      setIsloding(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchmovie(debounce_search, nextPage);
  };

  const goHome = () => {
    setSearch('');
    setPage(1);
    setDebounce_search('');
    fetchmovie('', 1);
  };

  useEffect(() => {
    setPage(1);
    fetchmovie(debounce_search, 1);
  }, [debounce_search]);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search Search={search} setSearch={setSearch} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-[30px]'>All movies</h2>

          {isloding ? (
            <p className='text-white'> is loading</p>
          ) : errormessage ? (
            <p className='text-red-500'>{errormessage}</p>
          ) : (
            <ul>
              {movies.map((movies) => (
                <Moviecard key={movies.id} movies={movies} />
              ))}
            </ul>
          )}
        </section>

        {!isloding && !errormessage && movies.length > 0 && (
          <div className='text-center mt-4'>
            <button onClick={loadMore} className='load'>
              Load More
            </button>
            <p className='text-white mt-2'>
              Page {page} of {totalPages}
            </p>
          </div>
        )}
        <div className='text-center mt-4'>
          <button
            onClick={goHome}
            className='mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800'
          >
            ⬅️ Back to Home
          </button>
        </div>        
      </div>
    </main>
  );
};

export default App;
