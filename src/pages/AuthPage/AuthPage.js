import SignUpForm from "../../components/SignUpForm/SignUpForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useState } from "react";

export default function AuthPage({ setUser }) {
    const [showSignup, setShowSignUp] = useState(false);
    
    return (
        <main>
            <h1>AuthPage</h1>
            <button onClick={() => setShowSignUp(!showSignup) }>{ showSignup ? 'Log In' : 'Sign Up'}</button>
            {
                showSignup?
                <SignUpForm setUser={setUser} /> :
                <LoginForm setUser={setUser} />
            }
        </main>
    );
};