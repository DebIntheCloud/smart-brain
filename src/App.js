import React, { useState } from 'react'; // Importing useState hook
import './App.css';
import Navigation from "./Components/Navigation/Navigation";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import Clarifai from 'clarifai';
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import ParticlesBg from 'particles-bg';


const PAT = 'dcb52ced76444b13be68163102a8b7fc';  // Do NOT leave this in production!
const USER_ID = 'cu9ym2eezj7bb';
const APP_ID = 'Face-Recognition-Brain';  // Or any app ID you're using

function App() {
  // State Management
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState([]);
  const [route, setRoute] = useState("Signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({      
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  });

 // Load User Data
  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  };

 // Input Change Handler
  const onInputChange = (event) => {
    setInput(event.target.value);
  };

    // Calculate Face Bounding Box
  const displayFaceBox = (face) => {
    setBox(prevBoxes => [...prevBoxes, face]);
  };

  // Button Submit Handler
  const onButtonSubmit = () => {
    setImageUrl(input);

    // Clarifai API call via proxy
    fetch("http://localhost:3000/imageUrl", {  // Call your backend endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        imageUrl: imageUrl,
        pat: PAT,
        userId: USER_ID,
        appID: APP_ID 
      }),
    })
      .then(response => response.json())
      .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
      }) 
      .then(data => {
  // Validate API response
        if (data?.outputs?.[0]?.regions) {
          const clarifaiFaces = data.outputs[0].data.regions.map(
            region => region.region_info.bounding_box
          );
   // Clear previous boxes and set new face detection boxes
          setBox([]);
          clarifaiFaces.forEach(displayFaceBox); 

  // Update user entries
          return fetch("http://localhost:3000/image", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id }),
          });
        } 
      })
      .then(response => {
        if (!response.ok) {
        throw new Error(`Server error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(count => {
      setUser(prevUser => ({
      ...prevUser,
      entries: count.entries
    }));
  })
      .catch(err => {
      console.error("Error processing image:", err);
      alert('There was an error processing the image or updating your rank.');
    });
  };

  // Route Change Handler
  const changeRoute = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
      setRoute("Signin");
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };


  return (
    <div className="App">
      <ParticlesBg className="particles"
        type="cobweb"
        color="#ffffff"
        num={300}
        bg={true}
      />
      <Navigation 
      isSignedIn={isSignedIn} 
      changeRoute={changeRoute} 
      />
      {route === "home" ? (
        <div>
            <Logo />
            <Rank 
            name={user.name} 
            entries={user.entries} 
            />
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onButtonSubmit={onButtonSubmit} 
            />
            <FaceRecognition 
            imageUrl={imageUrl} 
            box={box} 
            />
          </div>
         ) : (
            route === "Signin" ? (
          <Signin
            changeRoute={changeRoute}
            loadUser={loadUser}
            />
         ) : (
         <Register
            loadUser={loadUser}
            changeRoute={changeRoute}
          />
        )
      )}
    </div>
  );
}

export default App;
