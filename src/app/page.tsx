"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import { useSession, signIn, signOut } from 'next-auth/react';
import Login from './Login';
import AddQuestions from "@components/AddQuestions/AddQuestions"
import { IFormQuestion } from '@database/volunteerFormSchema'


export default function Home() {
  const [apiResponse, setApiResponse] = useState('');
  const { data, status } = useSession();
  const [questions, setQuestions] = useState<IFormQuestion[]>([])

  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/example/');
      const data = await response.json();
      setApiResponse(data.message);
    } catch (error) {
      console.error('Error calling API:', error);
      setApiResponse('Failed to call API');
    }
  };

  const addQuestion = () => {
    // Create an empty question and append it to the questions array
    const emptyQuestion: IFormQuestion = {
      question: '',
      fieldType: 'Multiple Choice', // Set default fieldType or adjust as needed
      options: [],
    };
    setQuestions((prevQuestions) => [...prevQuestions, emptyQuestion]);
  };

  return (
    <main>
      <Navbar />
      <h1>Home</h1>
      <button onClick={handleApiCall}>Test Database Connection</button>
      <p>API Response: {apiResponse}</p>
      <div style={{ width: "500px", margin: "0 auto", paddingTop: "30px" }}>
        <h3>Login Website</h3>
        <Login />
      </div>
      <AddQuestions questions={questions} setQuestions={setQuestions}/>
      <button onClick={addQuestion}>add questions</button>
      {//whenever button is clicked, new empty question should be appended to the list
      }
    </main>
  );
}