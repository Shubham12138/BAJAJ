import React, { useState } from "react";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Dropdown options for filtering response data
  const options = [
    { label: "Alphabets", value: "alphabets" },
    { label: "Numbers", value: "numbers" },
    { label: "Highest alphabet", value: "highest_alphabet" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseData(null);

    // Validate JSON input
    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
    } catch (err) {
      setError("Invalid JSON input.");
      return;
    }

    // Call the backend API (adjust the URL if needed)
    try {
      const res = await fetch("http://localhost:8080/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      if (!res.ok) {
        throw new Error("API error");
      }
      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      setError("Error calling API: " + err.message);
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    let newSelected = [...selectedOptions];
    if (newSelected.includes(value)) {
      newSelected = newSelected.filter((opt) => opt !== value);
    } else {
      newSelected.push(value);
    }
    setSelectedOptions(newSelected);
  };

  // Render the filtered response data based on selected dropdown options
  const renderResponse = () => {
    if (!responseData) return null;

    const displayData = {};
    selectedOptions.forEach((option) => {
      displayData[option] = responseData[option];
    });

    return (
      <div className="response">
        <h3>API Response</h3>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Website title set to your roll number */}
        <h1>ABCD123</h1>
      </header>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label>
            JSON Input:
            <textarea
              rows="5"
              cols="50"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='e.g. { "data": ["A", "C", "z"] }'
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="dropdown">
          <h3>Select Data to Display:</h3>
          {options.map((option) => (
            <label key={option.value} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={handleOptionChange}
              />
              {option.label}
            </label>
          ))}
        </div>
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;
