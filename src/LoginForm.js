import { initializeApp } from 'firebase/app';
//import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, {  useState, useEffect } from 'react';


// LoginSuccessful is a function sent in by parent component
function LoginForm({LoginEvent}) {
    const firebaseConfig = {
        apiKey: "AIzaSyBxCM1GWSLbtK4HhbAfJ9RGEweawn1FqIA",
        authDomain: "react-login-77f77.firebaseapp.com",
        projectId: "react-login-77f77",
        storageBucket: "react-login-77f77.appspot.com", // Fixed `.app` to `.appspot.com`
        messagingSenderId: "1098258177806",
        appId: "1:1098258177806:web:101a9cf45c01688df8015f",
    };

    initializeApp(firebaseConfig);

    const [loggedUser, setLoggedUser] = useState('');

    // function to sign in with Google's page
    const signInWithGoogle = () => {

        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        // signInWithRedirect(auth, provider)
        signInWithPopup(auth, provider)
            .then((result) => {
                // User signed in
                console.log(result.user);
                setLoggedUser(result.user)

            }).catch((error) => {
            // Handle Errors here.
            console.error(error);
        });
    };

    // function to sign out
    function logoutGoogle () {
        const auth=getAuth();
        auth.signOut();
        setLoggedUser(null)
    }

    // we put the onAuthStateChanged in useEffect so this is only called when
    // this component mounts
    useEffect(() => {
        const auth = getAuth();
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in.
                console.log("User is signed in:", user);

                setLoggedUser(user);

            } else {
                // No user is signed in.
                console.log("No user is signed in.");
            }
            LoginEvent(user);
        });
    }, [LoginEvent]);
    // note the ? to show either login or logout button
    return (
        <div >
            { loggedUser?
                <><p>user: {loggedUser.email}</p> <button onClick={logoutGoogle}>Log out</button> </>
                :<button onClick={signInWithGoogle}>Sign in with Google</button>
            }

        </div>
    );

}
export default LoginForm;