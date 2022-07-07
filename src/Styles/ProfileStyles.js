import styled from 'styled-components';

export const RowProfileWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-bottom: 10px;
`;

export const ProfileWrapper = styled.div`
  display: grid;
  grid-template-rows: ${(props) => props.GridRowsTemplate};
`;

export const ProfileRowElement = styled.div`
  display: flex;
  align-items: center;
`;
