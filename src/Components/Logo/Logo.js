import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from "./brain.png";
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '20px', position: 'absolute', top: "50px", left: 0 }}>
            <Tilt className="Tilt br2 shadow-2" tiltMaxAngleX={35}>
                <div className="pa3" style={{ height: 150, width: 150}}>
                    <img style={{paddingTop: "5px"}} alt="logo" src={brain}></img>
                </div>
            </Tilt>
        </div>
    );
}


export default Logo;