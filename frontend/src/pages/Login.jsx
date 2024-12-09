import React, { useState } from 'react';
import { AuthenticationForm } from '../components/AuthenticationForm';

const Login = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        padding: '1rem',
      }}
    >
      <div style={{ width: '400px' }}> {/* Set a fixed width for the form */}
        <AuthenticationForm />
      </div>
    </div>
  );
};

export default Login;