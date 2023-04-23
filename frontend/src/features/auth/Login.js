// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux';


const Login = () => {

    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        useRef.current.focus()
    }, []);

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd]);


    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const userData = await login({ user, pwd }).unwrap();
            dispatch(setCredentials({ ...userData, user }));
            setUser('')
            setPwd('')
            navigate('/welcome');

        } catch (error) {
            if (!error?.originalStatus) {

                setErrMsg('No server response');

            } else if (errMsg.originalStatus?.status === 400) {

                setErrMsg('Missing username or password');

            } else if (errMsg.originalStatus?.status == 401) {

                setErrMsg('Unauthorized');

            } else {

                setErrMsg('Login failed');

            }
            errRef.current.focus();
        }

    }

    const handleUserInput = (e) => setUser(e.target.value);

    const handlePwdInput = (e) => setPwd(e.target.value);

    const content = isLoading ? <h1>Loading.........</h1> : (
        <section className="login">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
            <h1>Employee login</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    value={user}
                    onChange={handleUserInput}
                    autoComplete='off'
                    required
                />

                <label htmlFor="password">password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={pwd}
                    required
                />
                <button>SignIn</button>
            </form>
        </section>
    )

    return content
}

export default Login
