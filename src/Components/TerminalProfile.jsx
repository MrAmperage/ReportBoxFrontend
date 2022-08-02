import { Input } from 'antd';
import React from 'react';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
import { RowInputStyle } from '../Styles/TableStyles';

export default function TerminalProfile(props) {
  return (
    <ProfileWrapper GridRowsTemplate="1fr">
      <RowProfileWrapper>
        <ProfileRowElement>ID терминала:</ProfileRowElement>
        <ProfileRowElement>
          <RowInputStyle width="190px">
            <Input size="small" value={props.Profile.Id} disabled={true} />
          </RowInputStyle>
        </ProfileRowElement>
      </RowProfileWrapper>
    </ProfileWrapper>
  );
}
