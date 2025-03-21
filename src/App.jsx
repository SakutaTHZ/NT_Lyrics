import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css";
import { BrowserRouter as Router } from "react-router-dom";
import AnimatedRoutes from "../src/components/special/AnimatedRoutes";
import { PrimeReactProvider } from "primereact/api";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </PrimeReactProvider>
  );
}

export default App;