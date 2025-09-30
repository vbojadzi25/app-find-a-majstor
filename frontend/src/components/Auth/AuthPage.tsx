import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Find a Majstor</h1>
          <p>Connect with skilled craftsmen in your area</p>
        </div>

        <div className="auth-toggle">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default AuthPage;