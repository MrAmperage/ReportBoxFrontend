import styled from 'styled-components';

export const RowTablePointerStyle = styled.div`
  cursor: pointer;
`;

export const RowInputStyle = styled.div`
  width: ${(props) => props.width};
`;

export const RowStyle = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  width: ${(props) => props.width};
`;
