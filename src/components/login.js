// eslint-disable-next-line no-unused-vars
import React,{useRef, useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'


import { setCredentials } from '../features/auth/authSlice'
import { useLoginMutation } from '../features/auth/authApiSlice'
import { useDispatch } from 'react-redux';


const login = () => {
    const useRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();
  return (
    <div>login</div>
  )
}

export default login
