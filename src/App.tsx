import { useEffect } from "react";
import "./App.css";

import { Exam } from "./components/exam";

function App() {
  useEffect(() => {
    navigator.serviceWorker
      .register("/react-py-sw.js")
      .then((registration) =>
        console.log(
          "Service Worker registration successful with scope: ",
          registration.scope
        )
      )
      .catch((err) => console.log("Service Worker registration failed: ", err));
  }, []);

  return (
    // Add the provider to your app
    <Exam />
  );
}

export default App;
