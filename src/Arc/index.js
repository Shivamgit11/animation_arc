import React, { useState, useRef, useEffect } from 'react';

const ArcAnimation = () => {
  const [currentProgress, setCurrentProgress] = useState(0); // current progress is to track the position of ball like whether it is at the start or at the end
  const ballRef = useRef(null);
  const arcPathRef = useRef(null);
  const animationIdRef = useRef(null);// for preventing the animation

  
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; //Animation for ease in out for cubic

  
  const moveToPoint = (targetProgress) => {  //for moving ball from point to point
    const arcPath = arcPathRef.current;
    const length = arcPath.getTotalLength();
    const animationDuration = 4000; // Time for travelling for point to point
    const startTime = performance.now(); //for starting the animation

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const timeFraction = Math.min(elapsedTime / animationDuration, 1); 
      const easedProgress = easeInOutCubic(timeFraction); // Animation wil run with the help of this

    
      const newProgress = currentProgress + (targetProgress - currentProgress) * easedProgress;
      const position = length * newProgress;
      const coords = arcPath.getPointAtLength(position);
    //   Above will take the progress 

   
      const container = document.querySelector('.arc-container');
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
   // for taking the container dimension

      // Move the animated ball along the path, adapting to full screen
      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${(coords.x / 100) * containerWidth - 7.5}px, ${(coords.y / 50) * containerHeight - 7.5}px)`;
      }

      // Continue the animation if the timeFraction is less than 1
      if (timeFraction < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentProgress(targetProgress); // Set the final progress
      }
    };

    // Start the animation
    cancelAnimationFrame(animationIdRef.current); // Cancel any ongoing animation
    animationIdRef.current = requestAnimationFrame(animate);
  };

  
  useEffect(() => {
    moveToPoint(0);

    return () => cancelAnimationFrame(animationIdRef.current);
  }, []);

  return (
    <div className="arc-container">
     
      <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
       
        <path ref={arcPathRef} id="arcPath" d="M 5 45 C 25 5, 75 5, 95 45" stroke="blue" fill="transparent" strokeWidth="0.5" />

         {/*Above is the curve  looks like arc */}
        <circle cx="5" cy="45" r="0.5" fill="red" />
        <circle cx="50" cy="15" r="0.5" fill="red" />
        <circle cx="95" cy="45" r="0.5" fill="red" /> 
       {/* Above is the red ball which will placed at the points near A, B, C */}
        
        <text x="2" y="48" fontFamily="Arial" fontSize="2" fill="black" onClick={() => moveToPoint(0)}>A</text>
        <text x="49" y="12" fontFamily="Arial" fontSize="2" fill="black" onClick={() => moveToPoint(0.5)}>B</text>
        <text x="92" y="48" fontFamily="Arial" fontSize="2" fill="black" onClick={() => moveToPoint(1)}>C</text>
        {/* above  is the point on that we have to click */}
      </svg>

      
      <div className="ball" ref={ballRef}></div>
      {/* Above is the blue ball which is moving from points to point */}
    </div>
  );
};

export default ArcAnimation;





// import React, { useState, useRef, useEffect } from 'react';

// const ArcAnimationWithVisibleDivs = () => {
//   const [currentProgress, setCurrentProgress] = useState(0);
//   const ballRef = useRef(null);
//   const animationIdRef = useRef(null);

//   // Easing function (ease-in-out cubic)
//   const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

//   // Function to calculate arc position based on progress (A -> B -> C)
//   const getArcPosition = (progress) => {
//     const startX = 5; // Point A x position (in percentage)
//     const startY = 90; // Point A y position
//     const endX = 95; // Point C x position
//     const endY = 90; // Point C y position
//     const peakX = 50; // Peak (B) x position (middle of arc)
//     const peakY = 10; // Peak (B) y position (top of arc)

//     const x =
//       startX * (1 - progress) * (1 - progress) +
//       2 * peakX * progress * (1 - progress) +
//       endX * progress * progress;
//     const y =
//       startY * (1 - progress) * (1 - progress) +
//       2 * peakY * progress * (1 - progress) +
//       endY * progress * progress;

//     return { x, y };
//   };

//   // Function to move the ball to a specific point (A, B, or C)
//   const moveToPoint = (targetProgress) => {
//     const animationDuration = 4000; // Duration of animation in milliseconds
//     const startTime = performance.now();

//     const animate = (currentTime) => {
//       const elapsedTime = currentTime - startTime;
//       const timeFraction = Math.min(elapsedTime / animationDuration, 1);
//       const easedProgress = easeInOutCubic(timeFraction);

//       const newProgress = currentProgress + (targetProgress - currentProgress) * easedProgress;
//       const position = getArcPosition(newProgress);

//       if (ballRef.current) {
//         ballRef.current.style.transform = `translate(${position.x}vw, ${position.y}vh)`; // Moving the ball with a smooth animation
//       }

//       if (timeFraction < 1) {
//         animationIdRef.current = requestAnimationFrame(animate);
//       } else {
//         setCurrentProgress(targetProgress);
//       }
//     };

//     cancelAnimationFrame(animationIdRef.current); // Cancel any ongoing animation
//     animationIdRef.current = requestAnimationFrame(animate);
//   };

//   // Set the initial position of the ball at Point A on component mount
//   useEffect(() => {
//     moveToPoint(0); // Start from point A

//     // Cleanup on component unmount to prevent memory leaks
//     return () => cancelAnimationFrame(animationIdRef.current);
//   }, []);

//   return (
//     <div className="arc-container">
//       {/* Arc Path */}
//       <div className="arc-path"></div>

//       {/* Divs for Points A, B, and C */}
//       <div className="point point-a" onClick={() => moveToPoint(0)}>A</div>
//       <div className="point point-b" onClick={() => moveToPoint(0.5)}>B</div>
//       <div className="point point-c" onClick={() => moveToPoint(1)}>C</div>

//       {/* The moving ball */}
//       <div className="ball" ref={ballRef}></div>
//     </div>
//   );
// };

// export default ArcAnimationWithVisibleDivs;
