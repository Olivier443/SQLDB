import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {

  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [titleMovieInfo, setTitleMovieInfo] = useState(null);
  const [ratingList, setRatingList] = useState(null);
  const [buttonRatingValue, setButtonRatingValue] = useState('');
  const [filmForThatRatingList, setFilmForThatRatingList] = useState(null);
  const [storeMap, setStoreMap] = useState(new Map());
  const [state, setState] = useState(null);


  /////////////////////////////////

  // Numerical Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(10);
  // Logic for displaying current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filmForThatRatingList ? filmForThatRatingList.slice(indexOfFirstItem, indexOfLastItem) : [];
  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil((filmForThatRatingList ? filmForThatRatingList.length : 0) / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <li
        key={number}
        onClick={() => setCurrentPage(number)}
        style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc' }}
      >
        {number}
      </li>
    );
  });

  // Logic for handling next and previous buttons
  const handleNextButton = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousButton = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /////////////////////////////////



  /////////////////////////////////

  // Alphabetical Pagination
  const [data1, setData1] = useState([]);
  const [currentLetter, setCurrentLetter] = useState('A');

  // Alphabet array for pagination
  const alphabetArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter data based on the current letter
  const currentItems1 = data.filter(item => item.title.toUpperCase().startsWith(currentLetter));

  /////////////////////////////////



  // Whole list of films
  useEffect(() => {
    fetch('/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // List of films for a specific rating
  useEffect(() => {
    fetch(`/datalist/rating/${buttonRatingValue}`)
      .then(response => response.json())
      .then(thatdata => setFilmForThatRatingList(thatdata))
      .catch(error => console.error('Error fetching data:', error));
  }, [buttonRatingValue]);


  // Value of the input to get the title of the film
  const titleHandler = (ev) => {
    ev.preventDefault();
    setTitle(ev.target.value);
  }


  // This is the click on the button
  const titleInfoHandler = (ev) => {
    setTitleMovieInfo(null);
    const endpoint = `/titleinfo/${title}`;
    fetch(`/titleinfo/${title}`)
      .then(response => response.json())
      .then(titleMovieInfo => setTitleMovieInfo(titleMovieInfo))
      .catch(error => console.error('error fetching data:', error));
  }


  // Get the list of all the ratings available in the list
  const ratingHandler = (ratingList) => {
    setRatingList(null);
    fetch(`/ratinglist`)
      .then(response => response.json())
      .then(ratingList => setRatingList(ratingList))
      .catch(error => console.error('error fetching data:', error));
  }

  useEffect(() => {
    const value = JSON.stringify(Object.fromEntries(storeMap), null, 2);
    setState(value);
  }, []);

  const handleButtonClick = (aRating, value) => {
    const updatedMap = new Map(storeMap);
    updatedMap.set(aRating, value);
    setButtonRatingValue(value);
    setStoreMap(updatedMap);
  }


  return (
    <div>
      <h1>Data from MySQL Table</h1>


      {/* Get list of the ratings available in the movie list */}
      <div className='container'>
        <div>
          <h1>Get the available ratings of the list of films</h1>
        </div>
        <div>
          <label>Get the ratings: </label>
          <button onClick={ratingHandler}>Movie Ratings</button>
        </div>

        {(ratingList && ratingList.length > 0) &&
          <>
            <ul>
              {ratingList.map((aRating, index) => (
                <div key={index}>
                  <li>
                    <label>Get the list of the films for: </label>
                    <button key={aRating.rating} value={aRating.rating} onClick={(e) => handleButtonClick(aRating, e.target.value)}>{aRating.rating}</button>
                  </li>
                </div>
              ))}
            </ul>
          </>}
      </div>

      {/* Get list of movies only for a specific rating */}
      <div className='container'>
        <div>
          <p>List of films for the rating <span>{buttonRatingValue}</span></p>
        </div>
        <div>
          {currentItems.length > 0 ?
            <ul className='ul'>
              {currentItems.map((item, index) => (
                <div className='container' key={index}>
                  <li><span style={{ color: 'blue', fontWeight: 'bold' }}>Title:</span> {item.title}</li>
                </div>
              ))}
            </ul>
            :
            <p>No data to display.</p>
          }
          <button onClick={handlePreviousButton} disabled={currentPage === 1}>Previous</button>
          <ul style={{ display: 'flex', listStyleType: 'none' }}>
            {renderPageNumbers}
          </ul>
          <button onClick={handleNextButton} disabled={currentPage === pageNumbers.length}>Next</button>
        </div>
      </div>

      {/* Search a film by title */}
      <div className='container'>
        <div>
          <h2>Search a film by title</h2>
        </div>
        <div>
          <label>Title of the movie: </label>
          <input type='text' onChange={titleHandler} placeholder='Type the title of the movie' />
          <button onClick={titleInfoHandler}>Get the Movie Information</button>
        </div>

        {(titleMovieInfo && titleMovieInfo.length > 0) &&
          <>
            <ul>
              <>
                <li><span>Title:</span> {titleMovieInfo[0].title}</li>
                <li><span>Release Year:</span> {titleMovieInfo[0].release_year}</li>
                <li><span>Length:</span> {titleMovieInfo[0].length}</li>
                <li><span>Description:</span> {titleMovieInfo[0].description}</li>
              </>

              <br />

              {titleMovieInfo.map((aTitleMovie, index) => (
                <div key={index}>
                  <li><span>First Name:</span> {aTitleMovie.first_name}</li>
                  <li><span>Last Name:</span> {aTitleMovie.last_name}</li>
                  <br />
                </div>
              ))}
            </ul>
          </>
        }
      </div>



      {/* List of all the films */}
      <div className='container'>
        <div>
          <h2>List of films</h2>
        </div>
        {currentItems1.length > 0 ?
          <>
            <ul style={{ display: 'flex', listStyleType: 'none' }}>
              {alphabetArray.map(letter => (
                <li
                  key={letter}
                  onClick={() => setCurrentLetter(letter)}
                  style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc' }}
                >
                  {letter}
                </li>
              ))}
            </ul>
            <ul className='ul'>
              {currentItems1.map((item, index) => (
                <div className='container' key={index}>
                  <li><span style={{ color: 'blue', fontWeight: 'bold' }}>Title:</span> {item.title}</li>
                  <li><span>Description:</span> {item.description}</li>
                  <li><span>Length:</span> {item.length}</li>
                  <li><span>Rating:</span> {item.rating}</li>
                  <li><span>Release year:</span> {item.release_year}</li>
                </div>
              ))}
            </ul>
          </>
          :
          <>
            <p>No data to display for a movie starting with this letter of the alphabet.</p>
            <ul style={{ display: 'flex', listStyleType: 'none' }}>
              {alphabetArray.map(letter => (
                <li
                  key={letter}
                  onClick={() => setCurrentLetter(letter)}
                  style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc' }}
                >
                  {letter}
                </li>
              ))}
            </ul>
          </>
        }
      </div>

    </div>
  );
}

export default App;
