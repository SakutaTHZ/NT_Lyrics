import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css";
import { BrowserRouter as Router } from "react-router-dom";
import AnimatedRoutes from "../src/components/special/AnimatedRoutes";
import { PrimeReactProvider } from "primereact/api";

import AuthProvider from "./components/hooks/AuthProvider";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <AuthProvider> 
          <AnimatedRoutes />
        </AuthProvider>
      </Router>
    </PrimeReactProvider>

    // <PrimeReactProvider>
    //   <Router>
    //     <AnimatedRoutes />
    //   </Router>
    // </PrimeReactProvider>
  );
}

export default App;
