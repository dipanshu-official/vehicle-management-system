import React from "react";
import { AppRouter } from "./router/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />;
    </>
  );
}

export default App;
