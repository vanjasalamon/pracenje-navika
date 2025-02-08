import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./AuthProvider";


import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Navike from "./Navike";
import Pregled from "./Pregled";


function App() {

  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={Register} />
        <Route path="/Login" component={Login} />
        <Route path="/Home" component={Home} />
        <Route path="/Navike" component={Navike} />
        <Route path="/Pregled" component={Pregled} />
      </Router>
    </AuthProvider>

  );
}

export default App;
