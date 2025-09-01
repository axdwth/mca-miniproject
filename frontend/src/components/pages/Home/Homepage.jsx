import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../../../styles/Homepage.css'; 

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to the MCA Department</h1>
      <form onSubmit={""} className="chat-form">
        <input type="text" name="chat" id="query" placeholder="Ask me!" />
        <button type="submit">Ask</button>
      </form>
    </div>
  );
}

