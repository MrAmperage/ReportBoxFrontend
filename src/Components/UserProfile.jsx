import { Button, Checkbox, DatePicker, Input, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import Bcrypt from 'bcryptjs';
import React, { useState } from 'react';
import { GlobalInputStyle } from '../Styles/GlobalStyle';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
import { RowStyle } from '../Styles/TableStyles';
import Moment from 'moment';
const UserProfile = inject('GlobalStore')(
  observer((props) => {
    const [ShowPasswordInput, SetNewShowPasswordInput] = useState(false);
    const SavePassword = (Password) => {
      return Bcrypt.hash(Password, 12);
    };
    return (
      <ProfileWrapper GridRowsTemplate="1fr 1fr 1fr 1fr 1fr 1fr">
        <RowProfileWrapper>
          <ProfileRowElement>Имя пользователя:</ProfileRowElement>
          <ProfileRowElement>
            <GlobalInputStyle>
              <Input
                onChange={(Event) => {
                  props.ProfileHandler('Username', Event.target.value);
                }}
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
                <Input
                  size="small"
                  value={props.Profile.NotHashedPassword}
                  onChange={(Event) => {
                    props.ProfileHandler(
                      'NotHashedPassword',
                      Event.target.value
                    );
                  }}
                />
                <RowStyle width="140px" justifyContent="space-evenly">
                  <Button
                    onClick={() => {
                      SavePassword(props.Profile.NotHashedPassword).then(
                        (Password) => {
                          props.ProfileHandler('Password', Password);
                          SetNewShowPasswordInput(false);
                        }
                      );
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
              onChange={(Value) => {
                props.ProfileHandler('RoleId', Value);
              }}
              size="small"
              options={props.Roles}
              value={props.Profile.RoleId}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Доступ включен:</ProfileRowElement>
          <ProfileRowElement>
            <Checkbox
              checked={props.Profile.Enabled}
              onChange={(Event) => {
                props.ProfileHandler('Enabled', Event.target.checked);
              }}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Доступ с:</ProfileRowElement>
          <ProfileRowElement>
            <DatePicker
              onOk={(MomentObject) => {
                props.ProfileHandler('StartDate', MomentObject.format());
              }}
              format="DD.MM.YYY HH:mm:ss"
              size="small"
              showTime={true}
              value={Moment(props.Profile.StartDate)}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
        <RowProfileWrapper>
          <ProfileRowElement>Доступ по:</ProfileRowElement>
          <ProfileRowElement>
            <DatePicker
              onOk={(MomentObject) => {
                props.ProfileHandler('EndDate', MomentObject.format());
              }}
              format="DD.MM.YYY HH:mm:ss"
              size="small"
              showTime={true}
              value={Moment(props.Profile.EndDate)}
            />
          </ProfileRowElement>
        </RowProfileWrapper>
      </ProfileWrapper>
    );
  })
);

export default UserProfile;
