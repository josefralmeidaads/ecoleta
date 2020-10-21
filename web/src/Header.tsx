import React from 'react';

// import { Container } from './styles';

interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { title } = props;
  return (
      <header>
          <h1>{title}</h1>
      </header>
  );
}

export default Header;