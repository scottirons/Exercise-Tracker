import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
    return (
    <nav className="linkies">      
        <Link className = "App-link" to="/">Home</Link>
        |
        <Link className = "App-link" to="/create-exercise">Create an Exercise</Link>       
    </nav>);
}

export default Navigation;