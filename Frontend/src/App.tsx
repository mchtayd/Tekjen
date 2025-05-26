import {FC} from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './components/LoginForm'
import { Main } from './components/Main'
import { EmployeeRegistration } from './components/EmployeeRegistration'
import { MaterialRegister } from './components/MaterialRegister'
import { Footer } from './components/Footer';

const App:FC = () =>{
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginForm />}/>
        <Route path='/main' element={<Main />}/>
        <Route path='/employeeRegistration' element={<EmployeeRegistration />}/>
        <Route path='/materialRegister' element={<MaterialRegister />}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App
