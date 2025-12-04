import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MiModal from './Mimodal';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const checkUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      if (userData.monedas === undefined) userData.monedas = 0;
      if (userData.puntos === undefined) userData.puntos = 0;
      setUser(userData);
    } else {
      setUser(null);
    }
    setShowMenu(false);
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('auth-change', checkUser);
    
    return () => {
      window.removeEventListener('auth-change', checkUser);
    };
  }, [location]); 

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.dispatchEvent(new Event('auth-change')); 
    navigate('/login');
  };

  const handleOpcionNoDisponible = (titulo: string, msg: string) => {
    setModal({ isOpen: true, title: titulo, message: msg });
    setShowMenu(false);
  };

  return (
    <nav className={isVisible ? '' : 'navbar-hidden'}>
      
      <MiModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({...modal, isOpen: false})} 
        type="alert" 
        title={modal.title} 
        message={modal.message} 
      />

      <div className="brand">
        <div className="logo-icon">Sz</div>
        <Link to="/" style={{textDecoration: 'none', color: 'white', marginLeft: 0}}>
          Stream<span className="text-neon">Zone</span>
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/">Explorar</Link>
        <Link to="/nosotros">Equipo</Link>
        <Link to="/tyc">Normas</Link>
        
        {user ? (
          <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            
            
            <div 
              className="profile-avatar-small" 
              onClick={() => setShowMenu(!showMenu)}
              title="Menú de usuario"
            >
              {(user?.nombre?.[0] ?? user?.usuario?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
            </div>

            {showMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p style={{margin:0, color:'white', fontWeight:'bold'}}>{user?.nombre ?? user?.usuario ?? user?.email ?? 'Usuario'}</p>
                </div>
                
                <Link to="/dashboard" className="dropdown-item">
                  📊 Mi Panel
                </Link>
                
                <Link to="/configuracion" className="dropdown-item">
                  ⚙️ Configuración de Usuario
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item text-red" onClick={handleLogout}>
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="nav-btn-login">INICIAR SESIÓN</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;