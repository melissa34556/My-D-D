import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error("My D&D render error:", error);
  }
  render() {
    if (this.state.error) {
      return <main style={{minHeight:"100vh",background:"#11151b",color:"#f4f4f4",padding:"28px",fontFamily:"sans-serif"}}>
        <h1>My D&D kon niet worden geladen</h1>
        <p>Er is een fout opgetreden bij het opbouwen van het scherm.</p>
        <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",background:"#202630",padding:"14px",borderRadius:"8px",color:"#ffb4a8"}}>{String(this.state.error?.message || this.state.error)}</pre>
        <p>Maak een screenshot van deze melding en stuur die mee, dan kan ik de precieze fout oplossen.</p>
      </main>;
    }
    return this.props.children;
  }
}

window.addEventListener("error", event => console.error("My D&D runtime error:", event.error || event.message));
window.addEventListener("unhandledrejection", event => console.error("My D&D async error:", event.reason));

createRoot(document.getElementById("root")).render(
  <React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>
);
