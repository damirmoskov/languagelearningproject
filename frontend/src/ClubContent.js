import React from 'react';

const ClubContent = ({ content }) => {
  if (!content) {
    return null;
  }

  if (content.error) {
    return <div style={{ color: 'red', marginTop: '20px' }}>Error: {content.error}</div>;
  }

  return (
    <div className="club-content" style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', textAlign: 'left' }}>
      <h2>{content.name}</h2>
      {content.url && <p><a href={content.url} target="_blank" rel="noopener noreferrer">Read the full article</a></p>}

      <h3>Vocabulary</h3>
      <ul>
        {content.vocabulary && content.vocabulary.map((word, index) => <li key={index}>{word}</li>)}
      </ul>

      <h3>Round One: Yes/No Questions</h3>
      <ol>
        {content.round_one && content.round_one.map((q, i) => <li key={i}>{q}</li>)}
      </ol>

      <h3>Round Two: Agree/Disagree Statements</h3>
      <ol>
        {content.round_two && content.round_two.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
    </div>
  );
};

export default ClubContent;
