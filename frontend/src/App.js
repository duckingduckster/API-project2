// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
// import LoginFormPage from "./store/components/LoginFormPage";
import * as sessionActions from "./store/session";
// import SignupFormPage from "./store/components/SignupFormModal";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import SpotList from "./components/Spots/LandingPage";
import SpotDetails from "./components/Spots/SpotDetails";
import CreateSpot from "./components/Spots/CreateSpot";
import CreateReviewModal from "./components/Reviews/CreateReview";
import UpdateSpot from "./components/Spots/UpdateSpot";


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
            <Route path='/spots/:spotId/reviews'>
              <CreateReviewModal/>
            </Route>
            <Route path='/spots/:spotId/update'>
              <UpdateSpot/>
            </Route>
            <Route path='/spots/new'>
              <CreateSpot/>
            </Route>
            <Route exact path='/spots/:spotId'>
              <SpotDetails/>
            </Route>
            <Route exact path='/'>
              <SpotList/>
            </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
