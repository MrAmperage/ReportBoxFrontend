import { Checkbox, Input, Table } from 'antd';
import React from 'react';
import { GlobalInputStyle } from '../Styles/GlobalStyle';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';

export default function OrganizationProfile(props) {
  return (
    <>
      <ProfileWrapper GridRowsTemplate="1fr 1fr">
        <RowProfileWrapper>
          <ProfileRowElement>Наименование:</ProfileRowElement>
          <ProfileRowElement>
            <GlobalInputStyle>
              <Input
                size="small"
                value={props.Profile.Caption}
                onChange={(Event) => {
                  props.ProfileHandler('Caption', Event.target.value);
                }}
              />
            </GlobalInputStyle>
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Внутренняя:</ProfileRowElement>
          <ProfileRowElement>
            <Checkbox
              checked={props.Profile.Internal}
              onChange={(Event) => {
                props.ProfileHandler('Internal', Event.target.checked);
              }}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
      </ProfileWrapper>
      <Table columns={[{ title: 'Участок' }]} size="small" />
    </>
  );
}
