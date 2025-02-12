import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AIChatAssistant from './AIChatAssistant';
import DeepChef from './deepchef';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Quests from './components/Quests';
import Leaderboard from './components/Leaderboard';
import Auth from './components/Auth';
import AuthWrapper from './components/AuthWrapper';
import './global_styles.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <AuthWrapper>
                <div className="space-y-6">
                  <AIChatAssistant />
                  <DeepChef />
                </div>
              </AuthWrapper>
            } />
            <Route path="/profile" element={
              <AuthWrapper>
                <Profile />
              </AuthWrapper>
            } />
            <Route path="/quests" element={
              <AuthWrapper>
                <Quests />
              </AuthWrapper>
            } />
            <Route path="/leaderboard" element={
              <AuthWrapper>
                <Leaderboard />
              </AuthWrapper>
            } />
          </Routes>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);