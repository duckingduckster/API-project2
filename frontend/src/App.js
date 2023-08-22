// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
// import LoginFormPage from "./store/components/LoginFormPage";
import * as sessionActions from "./store/session";
// import SignupFormPage from "./store/components/SignupFormModal";
import Navigation from "./components/Navigation";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
        </Switch>
      )}
    </>
  );
}

export default App;
