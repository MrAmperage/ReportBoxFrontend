import { Button, Checkbox, Input, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { GlobalInputStyle } from '../Styles/GlobalStyle';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
const UserProfile = inject('GlobalStore')(
  observer((props) => {
    return (
      <ProfileWrapper GridRowsTemplate="1fr 1fr 1fr 1fr 1fr 1fr">
        <RowProfileWrapper>
          <ProfileRowElement>Имя пользователя:</ProfileRowElement>
          <ProfileRowElement>
            <GlobalInputStyle>
              <Input size="small" width="190px" />
            </GlobalInputStyle>
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Пароль:</ProfileRowElement>
          <ProfileRowElement>
            <Button size="small" type="primary">
              Установить новый пароль
            </Button>
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Выбор роли:</ProfileRowElement>
          <ProfileRowElement>
            <Select size="small" />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Доступ включен:</ProfileRowElement>
          <ProfileRowElement>
            <Checkbox />
          </ProfileRowElement>
        </RowProfileWrapper>
      </ProfileWrapper>
    );
  })
);

export default UserProfile;
