import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react'; 
const axios = require('axios'); 

function App() {

  const [subreddit, setSubreddit] = useState('')
  const [limit, setLimit] = useState(1)
  const [filter, setFilter] = useState('hot')
  const [time, setTime] = useState('week')

  const handleSubredditChange = (e) => {
    e.preventDefault(); 
    setSubreddit(e.target.value)
  }

  const handleLimitChange = (e) => {
    e.preventDefault(); 
    setLimit(e.target.value)
  }

  const handleFilterChange = (e) => {
    e.preventDefault(); 
    setFilter(e.target.value)
  }

  const handleTimeChange = (e) => {
    e.preventDefault()
    setTime(e.target.value)
  }

  const handleSubmit = (e) => {

    e.preventDefault() 

    const query = {
      subreddit: subreddit, 
      limit: limit, 
      filter: filter, 
      time: time,
    }

    axios.post('http://localhost:3001/subreddit', query)
          .then(() => console.log("Data sent"))
          .catch(err => {
            console.log(err); 
          })
  }

  return (
    <div className="App">
       <form onSubmit={handleSubmit}>
         <div className="form-group">
           <label>Subreddit:</label>
           <input type="text" placeholder="Enter Subreddit name..." onChange={handleSubredditChange} />
         </div>

         <div className="form-group">
           <label>Limit: </label>
           <input type="number" min="1" max="50" onChange={handleLimitChange} />
         </div>

         <div className="form-group"> 
           <label>Filter: </label>
           <div onChange={handleFilterChange} >
              <span className="radio">
                <input type="radio" value="hot" name="hot" />
                <label>Hot</label>
              </span>
              <span>
                <input type="radio" value="top" name="top" />
                <label>Top</label> 
              </span>
            </div>
         </div>

         <div className="form-group">
           <label>Time: </label>
           <select onChange={handleTimeChange}>
             <option value = 'today'>Today</option>
             <option value = 'week'>Week</option>
             <option value = 'month'>Month</option>
             <option value = 'year'>Year</option>
             <option value = 'all'>All</option>
           </select>
         </div>

         <input type="submit" value="Download" onSubmit={handleSubmit} /> 
       </form>
    </div>
  );
}

export default App;
