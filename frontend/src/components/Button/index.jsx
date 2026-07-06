import React from 'react';
import { ArrowRight } from 'lucide-react';
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components';

const Button = () => {

  const navigate = useNavigate()

  return (
    <StyledWrapper>
      <button
        className="btn"
        onClick={() => navigate('/books')}
      >
        Enter the stacks
        <ArrowRight size={16} color="#fff" />
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
   display: inline-block;
   padding: 0.9rem 1.8rem;
   font-size: 19px;
   font-weight: 700;
   color: white;
   border: 3px solid #6f431f;
   cursor: pointer;
   position: relative;
   background-color: transparent;
   text-decoration: none;
   overflow: hidden;
   z-index: 1;
   display: flex;
    align-items: center;
    gap: 0.5rem;
   letter-spacing: 1.5px;
   font-family: 'Cormorant Garamond', sans-serif;
  }

  .btn::before {
   content: "";
   position: absolute;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   background-color: #6f431f;
   transform: translateX(-100%);
   transition: all .3s;
   z-index: -1;
  }

  .btn:hover::before {
   transform: translateX(0);
  }`;

export default Button;
