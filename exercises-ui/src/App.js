import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import  Navigation  from './components/Navigation';
import { useState } from 'react';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState([]);

  return (
    <div className="App">
      <Router>
        <header>
          <h1>Exercisey McExercise Face</h1>
          <p>Log your exercises, edit them when you want to pretend you lifted more weight, and delete them, too!</p>
        </header>
        <Navigation />
        <div className="App-header">
          <Route path="/" exact>
            <HomePage setExerciseToEdit={setExerciseToEdit} />
          </Route>
          <Route path="/create-exercise">
            <CreateExercisePage />
          </Route>
          <Route path="/edit-exercise">
            <EditExercisePage exerciseToEdit={exerciseToEdit} />
          </Route>
          </div>
          <footer className="Footer">© 2022 Scott Irons</footer>
      </Router>
    </div>
  );
}

export default App;