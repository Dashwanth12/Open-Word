import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'

const ViewButton = () => {
  const navigate = useNavigate()
  return (
    <StyledWrapper>
      <button onClick={() => navigate('/bestSellers')}>
        View All
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    color: #333;
    text-decoration: none;
    font-size: 25px;
    border: none;
    background: none;
    font-style: italic;
    font-family: 'Cormorant Garamond', serif;
    cursor: pointer;
    margin-top: 20px;
  }

  button::before {
    margin-left: auto;
  }

  button::after, button::before {
    content: '';
    width: 0%;
    height: 2px;
    background: #c4896c;
    display: block;
    transition: 0.5s;
  }

  button:hover::after, button:hover::before {
    width: 100%;
  }`;

export default ViewButton;