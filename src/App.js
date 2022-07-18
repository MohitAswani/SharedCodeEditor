import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
