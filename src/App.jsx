import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Individuals from './pages/individuals';
import Settings from './pages/settings';
import Support from './pages/support';
import IndividualRequest from './pages/individualRequest';
import Signup from './pages/signup';
import Login from './pages/login';
import Verification from './pages/verification';
import { AppProvider } from './pages/tools/AppContext';
import CarDiagnoses from './pages/carDiagnoses';


function App() {
  return (
    <div>
    <BrowserRouter>
    <AppProvider>
     <Routes>
     <Route path={"/"} element={<Dashboard/>}></Route>
     <Route path={"/dashboard"} element={<Dashboard/>}></Route>
     <Route path={"/signup"} element={<Signup/>}></Route>
     <Route path={"/verification"} element={<Verification/>}></Route>
     <Route path={"/login"} element={<Login/>}></Route>
     <Route path={"/individuals"} element={<Individuals/>}></Route>
     <Route path={"/individualsRequest"} element={<IndividualRequest/>}></Route>
     <Route path={"/car_diagnoses"} element={<CarDiagnoses/>}></Route>
     
     <Route path={"/settings"} element={<Settings/>}></Route>
     <Route path={"/support"} element={<Support/>}></Route>
    </Routes>
    </AppProvider>
    </BrowserRouter>
  </div>
  )
}

export default App
