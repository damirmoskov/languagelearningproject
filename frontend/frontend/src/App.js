import React, { useState, useEffect } from 'react';
import ClubContent from './ClubContent';

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
          fetch('http://localhost:5001/api/languages'),
          fetch('http://localhost:5001/api/levels'),
          fetch('http://localhost:5001/api/speaking_clubs')
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
    // For the PoC, we only fetch content for the "Let's Celebrate" club (id 3)
    if (clubId === 3) {
      setIsContentLoading(true);
      setSelectedClubContent(null);
      try {
        const response = await fetch();
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
    <div>
      <h1>Language Speaking Clubs</h1>

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

      <div>
        <h2>Speaking Clubs</h2>
        <ul>
          {speakingClubs.map(club => (
            <li key={club.id}>
              {club.name}
              <button onClick={() => handleClubClick(club.id)} style={{ marginLeft: '10px' }}>
                Load Content
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isContentLoading && <div>Loading club content...</div>}
      <ClubContent content={selectedClubContent} />
    </div>
  );
}

export default App;
