import React from 'react';

// import { Container } from './styles';
interface HeaderProps {
    title: string
}

const Header: React.FC<HeaderProps> = (props) => {
  const { title } = props;
  
  return (
      <div>
          <header>
                <strong>{title}</strong>
          </header>
      </div>
  );
}

export default Header;