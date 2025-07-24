import React from 'react';

const aboutSections = [
  {
    image: 'r1.jpg',
    title: 'Majestic Mountain Escapes',
    text: 'Breathe in crisp alpine air as golden sunrays dance over tranquil peaks. Let nature cradle your soul.',
  },
  {
    image: 'r2.jpg',
    title: 'Beachside Bliss',
    text: 'Sink your toes into velvet sands where waves whisper serenity and sunsets paint the skies in royalty.',
  },
  {
    image: 'r3.jpg',
    title: 'Regal Retreats',
    text: 'Step into a realm of opulence where architecture meets elegance and every detail echoes grandeur.',
  },
  {
    image: 'r4.jpg',
    title: 'Lakeside Luxury',
    text: 'Mirror-like lakes, candlelit dinners, and timeless stillness — an experience tailored for kings and queens.',
  },
];

const AboutResort = () => {
  return (
    <div style={{
      fontFamily: "'Playfair Display', serif",
      marginTop: '60px',
      color: '#3e3e3e',
      paddingBottom: '80px',
    }}>
<div style={{ textAlign: 'center', marginTop: '50px' }}>
  <h1 style={{
    fontSize: '3.2rem',
    fontWeight: '900',
    fontFamily: "'Times New Roman', serif",
    color: '#4B2E2E',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    marginBottom: '20px',
  }}>
    Welcome to Resort Finder
  </h1>
</div>



      <p style={{
        textAlign: 'center',
        fontSize: '1.1rem',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 25px',
        fontStyle: 'italic',
        lineHeight: '2',
        color: '#594545',
        fontFamily: "'Cinzel Decorative', cursive",
        textShadow: '0px 0px 3px rgba(128, 90, 50, 0.05)',
      }}>
        ResortFinder is your curated gateway to serene landscapes and unforgettable escapes. From sunlit shores to snow-cloaked sanctuaries, our platform helps you discover retreats that bring calm, comfort, and a touch of grandeur. Every stay is crafted for elegance and ease — the perfect balance of nature and nobility.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        marginTop: '70px',
        padding: '0 50px'
      }}>
        {aboutSections.map((section, index) => (
          <div key={index} style={{
            position: 'relative',
            overflow: 'hidden',
            height: '340px',
            borderRadius: '20px',
            boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
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
                filter: 'brightness(55%)',
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textAlign: 'center',
              padding: '18px',
              width: '90%',
              fontFamily: "'Cinzel', serif",
              textShadow: '2px 2px 12px rgba(0,0,0,0.7)'
            }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '10px', letterSpacing: '1px' }}>
                {section.title}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                {section.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Space after cards */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default AboutResort;
