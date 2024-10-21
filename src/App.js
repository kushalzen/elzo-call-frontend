import React, { useState } from 'react';
import axios from 'axios';
import { RetellWebClient } from 'retell-client-js-sdk';

function App() {
  // const [accessToken, setAccessToken] = useState("");
  // const [retellClient, setRetellClient] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const BACKEND_URL = "https://talk.elzo.ai";
  
  const startWebCall = async () => {
    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted.");

      // Initiate the web call
      const response = await axios.post(`${BACKEND_URL}/web-call`);
      const token = response.data.access_token;
      // setAccessToken(token);
      console.log("Access token received:", token);

      // Initialize Retell Web Client
      const client = new RetellWebClient();
      // setRetellClient(client);

      // Start the call with the access token
      await client.startCall({
        accessToken: token,
        sampleRate: 24000, // Recommended for web calls
        emitRawAudioSamples: true // Optional: receive raw audio bytes
      });
      console.log("Web call started successfully.");
      client.on("update", (update) => {
        console.log("Transcript update:", update.transcript);
        setTranscript(update.transcript); // Update transcript state with the array of messages
      });
      console.log("Getting Transcripts sucesfully.");

      // Set up event listeners
      client.on("call_started", () => console.log("Call started"));
      client.on("call_ended", () => console.log("Call ended"));
      client.on("update", (update) => console.log("Transcript update:", update.transcript));
    } catch (err) {
      console.error("Error starting web call:", err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web Call with Retell</h1>
        <button onClick={startWebCall}>
          Start Web Call
        </button>
        <div>
        <h2>Live Transcript:</h2>
          <div className="chat-container">
            {transcript.map((message, index) => (
              <p
                key={index}
                style={{
                  color: message.role === 'agent' ? 'blue' : 'green',
                  textAlign: message.role === 'agent' ? 'left' : 'right'
                }}
              >
                <strong>{message.role}:</strong> {message.content}
              </p>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;