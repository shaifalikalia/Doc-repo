import styled, { css } from "styled-components";

const Button = styled.button`
  height: ${(p) => (p.height ? p.height : "48px")};

  padding: ${(p) => (p.padding ? p.padding : "0 30px")};

  font-weight: ${(p) => (p.fontWeight ? p.fontWeight : "500")};
  font-size: ${(p) => (p.fontSize ? p.fontSize : "15px")};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-radius: ${(p) => (p.borderRadius ? p.borderRadius : "30px")};

  box-sizing: border-box;
  transition-property: all;
  transition-duration: 0.3s;

  color: var(--color-white);
  background-color: var(--color-primary);
  border: 2px solid var(--color-primary);
  outline: none !important;
  ${(p) =>
    p.boxShadow &&
    css`
      box-shadow: ${(_p) => _p.boxShadow};
    `}

  &:hover:enabled {
    border: 2px solid var(--color-primary-dark);
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: var(--color-gray);
    border: 2px solid var(--color-gray-dark-1);
    color: var(--color-gray-dark-2);
    cursor: default;
    appearance: none;
    box-shadow: none;
    opacity: 0.8;
  }

  ${(p) =>
    p.margin &&
    css`
      margin: ${(_p) => _p.margin};
    `}

  ${(p) =>
    p.marginTop &&
    css`
      margin-top: ${(_p) => _p.marginTop};
    `}

    ${(p) =>
    p.marginRight &&
    css`
      margin-right: ${(_p) => _p.marginRight};
    `}

    ${(p) =>
    p.marginBottom &&
    css`
      margin-bottom: ${(_p) => _p.marginBottom};
    `}

    ${(p) =>
    p.marginLeft &&
    css`
      margin-left: ${(_p) => _p.marginLeft};
    `}
    
    ${(p) =>
    p.danger &&
    css`
      border: 2px solid var(--color-danger);
      background-color: var(--color-danger);
      color: var(--color-white);

      &:hover:enabled {
        color: var(--color-white);
        background-color: var(--color-danger-dark);
        border: 2px solid var(--color-danger-dark);
      }
    `}

    ${(p) =>
    p.bordered &&
    css`
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      background-color: var(--color-white);

      &:hover:enabled {
        color: var(--color-white);
        background-color: var(--color-primary);
        border: 2px solid var(--color-primary-dark);
      }
    `}

    ${(p) =>
    p.borderedSecondary &&
    css`
      color: var(--color-secondary);
      border: 2px solid var(--color-secondary);
      background-color: var(--color-white);

      &:hover:enabled {
        color: var(--color-white);
        background-color: var(--color-secondary);
        border: 2px solid var(--color-secondary-dark);
      }
    `}
`;

export default Button;
