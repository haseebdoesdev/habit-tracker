import React, { useState } from 'react';

const Register = () => {
    // TODO: Define state for name, email, password
    // WHY: Collect new user information
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // TODO: Define handleRegister function
    // WHY: Send registration data to backend

    return (
        <div className="register-container">
            {/* TODO: Create registration form */}
            {/* WHY: Allow new users to sign up */}
        </div>
    );
};

export default Register;
