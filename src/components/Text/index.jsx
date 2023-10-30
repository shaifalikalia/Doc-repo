import styled, { css } from "styled-components";

const Text = styled.p`
  padding: ${(p) => (p.padding ? p.padding : "0px")};
  margin: ${(p) => (p.margin ? p.margin : "0px")};

  font-size: ${(p) => (p.size ? p.size : "14px")};

  ${(p) =>
    p.width &&
    css`
      width: ${p.width};
    `}

  ${(p) =>
    p.height &&
    css`
      height: ${p.height};
    `}
    ${(p) =>
    p.minHeight &&
    css`
      min-height: ${p.minHeight};
    `}


    ${(p) =>
    p.ellipsis &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}

    ${(p) =>
    p.primary &&
    css`
      color: var(--color-primary);
      font-weight: 500;
    `}

    ${(p) =>
    p.secondary &&
    css`
      color: var(--color-secondary);
      font-weight: 500;
    `}

    ${(p) =>
    p.secondaryDark1 &&
    css`
      color: var(--color-secondary-dark-1);
      font-weight: 500;
    `}

    ${(p) =>
    p.weight &&
    css`
      font-weight: ${p.weight};
    `}

    ${(p) =>
    p.color &&
    css`
      color: ${p.color};
    `}

    ${(p) =>
    p.underline &&
    css`
      text-decoration: underline;
    `}

    ${(p) =>
    p.align &&
    css`
      text-align: ${p.align};
    `}

    ${(p) =>
    p.uppercase &&
    css`
      text-transform: uppercase;
    `}

    ${(p) =>
    p.lowercase &&
    css`
      text-transform: lowercase;
    `}

    ${(p) =>
    p.cursor &&
    css`
      cursor: ${p.cursor};
    `}

    ${(p) =>
    p.overflow &&
    css`
      overflow: ${p.overflow};
    `}

    ${(p) =>
    p.paddingTop &&
    css`
      padding-top: ${(_p) => _p.paddingTop};
    `}

    ${(p) =>
    p.paddingRight &&
    css`
      padding-right: ${(_p) => _p.paddingRight};
    `}

    ${(p) =>
    p.paddingBottom &&
    css`
      padding-bottom: ${(_p) => _p.paddingBottom};
    `}

    ${(p) =>
    p.paddingLeft &&
    css`
      padding-left: ${(_p) => _p.paddingLeft};
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
      marginleft: ${(_p) => _p.marginLeft};
    `}
`;

export default Text;
