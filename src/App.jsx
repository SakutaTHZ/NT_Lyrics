import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css";
import { BrowserRouter as Router } from "react-router-dom";
import AnimatedRoutes from "../src/components/special/AnimatedRoutes";
import { PrimeReactProvider } from "primereact/api";
import { ScrollTop } from 'primereact/scrolltop';

import AuthProvider from "./components/hooks/AuthProvider";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <AuthProvider> 
          <AnimatedRoutes />
        </AuthProvider>
      </Router>
      <ScrollTop className="opacity-40"/>
    </PrimeReactProvider>
  );
}

export default App;
