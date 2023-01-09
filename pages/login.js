import React,{ useEffect, useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { COLORS, QUERIES } from '../constants';
import { addUser } from '../redux/userSlice';
import buildUrl from '../buildUrl';
import axios from 'axios';
import Link from 'next/link';


const LoginScreen = ({ location }) => {
    const [toggle, setToggle] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [name, setName] = useState('');

    const router = useRouter();
    
    const loginHandler = async (e) => {
        e.preventDefault()

        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
          });
    
          if (!result.error) {
            // set some auth state
            router.push('/');
        }
    }

    function refreshPage(){ 
        window.location.reload(); 
    }

    const registerHandler = async (e) => {
        e.preventDefault()

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ registerEmail }),
            headers: {
              'Content-Type': 'application/json',
            },
        });
        
          const data = await response.json();
        
          if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
          } else {
            router.push('/')
          }
        
        return data;
    }

    return (
        <Wrapper>
            <LoginWrapper>
                <AccountButton>
                    <LoginLabel
                        onClick={(e) => setToggle(true)}
                        style={{
                            '--color': toggle? 'black': `grey`,
                            '--decoLogin': toggle? 'underline': 'none',
                        }}
                    >
                        Login
                    </LoginLabel>
                    <RegisterLabel 
                        onClick={(e)=> setToggle(false)}
                        style={{
                            '--colorRegister': toggle? `grey`: 'black',
                            '--margin': toggle? 'none': '25px',
                        }}
                    >
                        Register
                    </RegisterLabel>
                    {/*<Line />*/}
                </AccountButton>
                {
                    toggle && (
                        <Login>
                            <Container>
                                <Label2>Email</Label2>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' />
                            </Container>
                            <Container>
                                <Label2>Password</Label2>
                                <Input value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' />
                            </Container>
                            <LoginButton onClick={loginHandler}>Login</LoginButton>
                            <Link href='/forget'><Span>forgot your password?</Span></Link>
                            
                        </Login>
                    )
                }
                {
                    !toggle && (
                        <Register>
                            <Container>
                            <Label2>We will email you password</Label2>
                            </Container>
                            <Container>
                                <Label2>Name</Label2>
                                <Input value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Name'/>
                            </Container>
                            <Container>
                                <Label2>Email</Label2>
                                <Input value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} type='email' placeholder='Email' />
                            </Container>
                            <RegisterButton onClick={registerHandler}>Register</RegisterButton>
                        </Register>
                    )
                }
            </LoginWrapper>
        </Wrapper>
    )
};

const Wrapper = styled.div`
    display: flex;
    padding-top: 250px;
    gap: 70px;
    height: auto;
   
    background-color: #f6f4f2 !important;

    @media ${QUERIES.tabletAndSmaller} {
        flex-direction: column;
        align-items: center;
        padding-bottom: 50px;
    }

    @media ${QUERIES.laptopAndUp} {
        padding-top: 120px;
    }
`;

const Image = styled.img`
    @media ${QUERIES.phoneAndSmaller} {
        width: 100%;
    }
`;

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.h1`
    color:  black;
    font-size: 2rem;
`;

const Label2 = styled(Label)`
    font-size: 0.8rem;
    color: black;
`;

const AccountButton = styled.div`
    display: inline;
    flex-direction: row;
    gap: 20px;

    @media ${QUERIES.phoneAndSmaller} {
        
    }
`;

const LoginLabel = styled.button`
    height: 60px;
    width: 180px;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: var(--color);

    @media ${QUERIES.phoneAndSmaller} {

    }
`;

const RegisterLabel = styled(LoginLabel)`
    color: var(--colorRegister);

    &~hr {
        margin-left: var(--margin);
    }
`;

const Login = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Register = styled(Login)`

`;

const Container = styled.div`
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
`;


const Input = styled.input`
    width: 350px;
    height: 50px;
    font-size: 1rem;
    border-radius: 5px;
    outline: none;

    @media ${QUERIES.phoneAndSmaller} {
        width: 100%;   
    }
`;

const LoginButton = styled.button`
    padding: 10px 12px;
    border-radius: 8px;
    border: none;
    font-size: 15px;
    margin-top: 10px;
    margin-top: 20px;
    text-transform: uppercase;
    background-color: #f02d34;
    color: #fff;
    cursor: pointer;
    width: 350px;
    height: 50px;
    font-size: 1rem;
    font-weight: bold;
    @media ${QUERIES.phoneAndSmaller} {
        width: 100%;   
    }
`;

const RegisterButton = styled(LoginButton)`

`;

const Span = styled.span`
    color: black;
    line-height: 12px;
    padding-left: 10px;
    cursor: pointer;
    text-decoration: underline;
`;

export default LoginScreen;