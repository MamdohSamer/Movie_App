import React, {useEffect, useState } from 'react'
import Search from './Search'
import Moviecard from './moviecard'
import { useDebounce } from 'react-use';
const API_BASE_URL ='https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS= {
  method : 'get',
  headers:{
    accept: 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }

}
const App = () => {
  const [search , setSearch] = useState('');
  const [errormessage , setErrormessage] = useState('');
  const [movies, setMovies] = useState([])
  const [isloding, setIsloding] = useState(false)
  const [debounce_search, setdebounce_search] = useState("")
  useDebounce( () => setdebounce_search(search) , 500 , [search])

  const fetchmovie = async (query = "")=>{
  

    setErrormessage("");
  
    setIsloding(true);
    try{
      const endpoint =query? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint , API_OPTIONS);
    
      const data = await response.json();

      console.log(data);
      
      if(data.response === "false"){
        setErrormessage(data.Error || "falied to fetch movies");
        setMovies([]);
        return;
      }

      setMovies(data.results ||[]);
    }catch (error){

      console.error(`Error fetching ${error}`);
      
      setErrormessage('error fetching movies . please try again later');
    }finally{
      setIsloding(false);
    }



  }
  useEffect( ()=>{
    fetchmovie(debounce_search)
       }, [debounce_search]);
  return (
    <main>
        <div className='pattern'/>

        <div className='wrapper'>
            <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1>
                  Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
              </h1>
              <Search Search={search} setSearch={setSearch}/>
            </header>
            <section className='all-movies'>
              <h2 className='mt-[30px]'>All movies</h2>
             
              {isloding ? (<p className='text-white'> is loading</p>) :
              errormessage?( <p className='text-red-500'>{errormessage}</p>):(
                <ul>
                  {movies.map((movies) =>(
                    <Moviecard key={movies.id} movies={movies}/>
                    ))}
                </ul>)}
            </section>
        </div>
    </main>
  )
}

export default App;
