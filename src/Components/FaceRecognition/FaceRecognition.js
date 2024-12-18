import React from "react";
import "./FaceRecognition.css";


const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" height="auto" />
        {box.map((face, index) => (
          // Ensure the bounding box data is valid before applying the style
          face && face.top_row && face.left_col && face.bottom_row && face.right_col ? (
            <div
              key={index}
              className="bounding-box"
              style={{
                top: `${face.top_row * 100}%`,
                right: `${(1 - face.right_col) * 100}%`, // Reverse right for proper positioning
                bottom: `${(1 - face.bottom_row) * 100}%`, // Reverse bottom for proper positioning
                left: `${face.left_col * 100}%`,
              }}
            />
          ) : null
        ))}
      </div>
    </div>
  );
};



export default FaceRecognition;
