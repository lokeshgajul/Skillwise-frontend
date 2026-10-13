import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Main from "./navigation/Main";
import { ContentProvider } from "./context/ContentContext";
import { ThemeProvider } from "./context/ThemeContext";
// https://app.visily.ai/projects/d30d932d-0614-4cbb-ba92-ae2f19c79626/boards/1658728
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
