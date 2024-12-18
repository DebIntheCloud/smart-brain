import React from "react";

const Rank = ({ name = "Guest", entries = 0 }) => {
    return (
        <div className="text-center p-4">
            <div className="text-white text-xl mb-2">
                {`${name}, your current entry count is...`}
            </div>
            <div className="text-white text-4xl font-bold">
                {entries} 
            </div>      
        </div>  
    );
}

export default Rank;