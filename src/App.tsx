import { Routes, Route } from 'react-router-dom';
import Navbar from './componentes/barranav';
import Login from './login/login';
import { Inicio, Nosotros, TyC } from './paginas/paginas';
import './App.css';
import Registro from './paginas/Registro';
import TiendaRegalos from './paginas/TiendaRegalos';
import ConfiguracionUsuario from './paginas/Configusuario';
import StreamRoom from './paginas/StreamRoom'; 
import DashboardUnificado from './paginas/DashUnificado';
import MiStream from './paginas/Mistream.tsx';


function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content"> 
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<DashboardUnificado />} />    
          <Route path="/regalos" element={<TiendaRegalos />} />
          <Route path="/configuracion" element={<ConfiguracionUsuario />} />
          
          <Route path="/stream/:id" element={<StreamRoom />} /> 
          <Route path="/mistream" element={<MiStream />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;