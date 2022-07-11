import { Button, Checkbox, DatePicker, Input, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { GlobalInputStyle } from '../Styles/GlobalStyle';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
import { RowStyle } from '../Styles/TableStyles';
const { RangePicker } = DatePicker;
const UserProfile = inject('GlobalStore')(
  observer((props) => {
    const [ShowPasswordInput, SetNewShowPasswordInput] = useState(false);
    return (
      <ProfileWrapper GridRowsTemplate="1fr 1fr 1fr 1fr 1fr">
        <RowProfileWrapper>
          <ProfileRowElement>Имя пользователя:</ProfileRowElement>
          <ProfileRowElement>
            <GlobalInputStyle>
              <Input
                size="small"
                width="190px"
                value={props.Profile.Username}
              />
            </GlobalInputStyle>
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Пароль:</ProfileRowElement>
          <ProfileRowElement>
            {ShowPasswordInput ? (
              <RowStyle width="197px" justifyContent="space-between">
                <Input size="small" />
                <RowStyle width="140px" justifyContent="space-evenly">
                  <Button
                    onClick={() => {
                      SetNewShowPasswordInput(false);
                    }}
                    icon={<CheckOutlined />}
                    size="small"
                    type="primary
                "
                  />
                  <Button
                    onClick={() => {
                      SetNewShowPasswordInput(false);
                    }}
                    size="small"
                    icon={<CloseOutlined />}
                    type="primary"
                    danger={true}
                  />
                </RowStyle>
              </RowStyle>
            ) : (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  SetNewShowPasswordInput(true);
                }}
              >
                Установить новый пароль
              </Button>
            )}
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Выбор роли:</ProfileRowElement>
          <ProfileRowElement>
            <Select
              size="small"
              options={props.Roles}
              value={props.Profile.RoleId}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Доступ включен:</ProfileRowElement>
          <ProfileRowElement>
            <Checkbox checked={props.Profile.Enabled} />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Период:</ProfileRowElement>
          <ProfileRowElement>
            <RangePicker showTime={true} size="small" />
          </ProfileRowElement>
        </RowProfileWrapper>
      </ProfileWrapper>
    );
  })
);

export default UserProfile;
