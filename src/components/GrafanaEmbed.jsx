import React, { useEffect, useState } from 'react';

const GrafanaEmbed = () => {
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component is rendered client-side
    setIsClient(true);

    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    };

    if (isClient) {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initialize dimensions
    }

    return () => {
      if (isClient) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isClient]); // Run the effect only after the component mounts on the client

  if (!isClient) {
    return null; // Return nothing on the server side to prevent errors
  }

  const iframeStyle = {
    width: `${dimensions.width / 2}px`,
    height: `${dimensions.height / 2}px`
  };

  return (
    <div className='flex justify-center'>
      <iframe 
        src="http://localhost:3000/d-solo/aec24rk3p05c0c/test-dashboard?orgId=1&from=1738667043472&to=1738688643472&timezone=browser&panelId=1&__feature.dashboardSceneSolo" 
        style={iframeStyle}
        frameBorder="0"
      />
    </div>
  );
};

export default GrafanaEmbed;
