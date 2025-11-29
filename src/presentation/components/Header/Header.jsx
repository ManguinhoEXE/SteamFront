import './Header.css';

export const Header = ({ userName }) => {
  return (
    <header className="header">
      <h1 className="header-title">Hola {userName}</h1>
      <div className="header-icon">
        <img src="/images/imageLogin.jpg" alt="Gamepad" className="header-gamepad" />
      </div>
    </header>
  );
};
