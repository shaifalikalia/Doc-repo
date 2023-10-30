import styled, { css } from "styled-components";

const Card = styled.div`
  padding: ${(p) => (p.padding ? p.padding : "16px")};

  ${(p) =>
    p.width &&
    css`
      width: ${(_p) => _p.width};
    `}

  ${(p) =>
    p.height &&
    css`
      height: ${(_p) => _p.height};
    `}

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


    background-color: var(--color-white);
  box-shadow: ${(p) => (p.shadow ? p.shadow : "0 0 8px 0 rgba(0, 0, 0, 0.04)")};
  border-radius: ${(p) => (p.radius ? p.radius : "5px")};
  cursor: ${(p) => (p.cursor ? p.cursor : "pointer")};
`;

export default Card;
