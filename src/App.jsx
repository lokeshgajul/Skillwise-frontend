import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Main from "./navigation/Main";
import { ContentProvider } from "./context/ContentContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
