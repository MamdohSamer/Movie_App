import React from 'react'

const Search = ({Search , setSearch}) => {
  return (
    <div className='search'>
      <div>
        <img src="search.svg" alt="search" />

        <input type="text" 
        
        placeholder='search through thousands of movies'

        value={Search}
        
        onChange={(event) =>setSearch(event.target.value)}/>
      </div>
    </div>
  )
}

export default Search;