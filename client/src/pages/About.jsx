import React from 'react';

const aboutSections = [
  {
    title: 'EXPLORE',
    text: 'Uncover hidden gems — from seaside sanctuaries to misty mountain escapes.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'RELAX',
    text: 'Let luxury meet nature. Spa retreats, peaceful villas, and barefoot bliss await.',
    image: 'r2.jpg',
  },
  {
    title: 'CONNECT',
    text: 'Trust, transparency, and terrific getaways — curated for travelers like you.',
    image: 'r3.jpg',
  },
  {
    title: 'BOOK',
    text: 'Real-time availability, seamless booking, and endless memories to be made.',
    image: 'r4.jpg',
  },
];

const AboutResort = () => {
  return (
    <div style={{
      fontFamily: "'italic','Playfair Display', serif",
      marginTop: '60px',
      color: '#2e2e2e',
      backgroundColor: '#f9f9f9',
      paddingBottom: '80px'
    }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '3.5rem',
        fontWeight: '700',
        letterSpacing: '3px',
        marginBottom: '20px',
        fontFamily: "'Dancing Script', cursive",
        color: '#3f3f3f',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>
        About ResortFinder
      </h1>

      <p style={{
        textAlign: 'center',
        fontSize: '1.4rem',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px',
        fontStyle: 'italic',
        lineHeight: '2',
        fontFamily: "'Cinzel', serif",
        color: '#4a4a4a'
      }}>
        At ResortFinder, we help you uncover stays that inspire your soul — from cozy retreats to majestic escapes. Your journey deserves more than a room. It deserves a story.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginTop: '60px',
        padding: '0 40px'
      }}>
        {aboutSections.map((section, index) => (
          <div key={index} style={{
            position: 'relative',
            overflow: 'hidden',
            height: '320px',
            borderRadius: '18px',
            boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            transition: 'transform 0.4s ease-in-out',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={section.image}
              alt={section.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(60%)',
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textAlign: 'center',
              padding: '20px',
              width: '85%',
              fontFamily: "'Cinzel', serif",
              textShadow: '1px 1px 8px rgba(0,0,0,0.5)'
            }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', letterSpacing: '1.2px' }}>{section.title}</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>{section.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gap after image section */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default AboutResort;
