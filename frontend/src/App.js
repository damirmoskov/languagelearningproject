import React, { useState, useEffect } from 'react';
import ClubContent from './ClubContent';
import './App.css';

function App() {
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [speakingClubs, setSpeakingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClubContent, setSelectedClubContent] = useState(null);
  const [isContentLoading, setIsContentLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [languagesResponse, levelsResponse, clubsResponse] = await Promise.all([
          fetch('http://localhost:5002/api/languages'),
          fetch('http://localhost:5002/api/levels'),
          fetch('http://localhost:5002/api/speaking_clubs')
        ]);

        const languagesData = await languagesResponse.json();
        const levelsData = await levelsResponse.json();
        const clubsData = await clubsResponse.json();

        setLanguages(languagesData);
        setLevels(levelsData);
        setSpeakingClubs(clubsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleClubClick = async (clubId) => {
    if (clubId === 3) {
      setIsContentLoading(true);
      setSelectedClubContent(null);
      try {
        const response = await fetch('http://localhost:5002/api/speaking_clubs/3/content');
        const data = await response.json();
        setSelectedClubContent(data);
      } catch (error) {
        console.error("Error fetching club content:", error);
      } finally {
        setIsContentLoading(false);
      }
    } else {
      alert("Content for this club is not available yet.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Language Speaking Clubs</h1>
      </header>

      <main>
        <div className="selectors">
          <div>
            <h2>Languages</h2>
            <select>
              {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>

          <div>
            <h2>Levels</h2>
            <select>
              {levels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
        </div>

        <div>
          <h2>Speaking Clubs</h2>
          <ul className="club-list">
            {speakingClubs.map(club => (
              <li key={club.id}>
                <span>{club.name}</span>
                <button onClick={() => handleClubClick(club.id)} disabled={isContentLoading}>
                  {isContentLoading && club.id === 3 ? 'Loading...' : 'Load Content'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {isContentLoading && <div>Loading club content...</div>}

        {selectedClubContent && <ClubContent content={selectedClubContent} />}

      </main>
    </div>
  );
}

export default App;
