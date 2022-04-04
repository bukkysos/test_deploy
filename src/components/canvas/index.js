// import React, { useCallback, useEffect, useRef } from "react";

// const CardCanvas = ({ children }) => {
//   const slipCanvasRef = useRef(null);

//   const draw = (ctx) => {
//     const data =
//       "data:image/svg+xml," +
//       "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
//       "<foreignObject width='100%' height='100%'>" +
//       `${children}` +
//       "</foreignObject>" +
//       "</svg>";
//     var img = new Image();
//     img.src = data;
//     ctx.drawImage(img, 0, 0);
//   };

//   const drawFn = useCallback((ctx) => {
//     draw(ctx);
//   },[draw]);

//   useEffect(() => {
//     const canvas = slipCanvasRef.current;
//     const context = canvas.getContext("2d");

//     // Our first draw
//     drawFn(context);
//   }, []);

//   return (
//     <>
//       <canvas ref={slipCanvasRef} {...children} />
//     </>
//   );
// };

// export { CardCanvas };
