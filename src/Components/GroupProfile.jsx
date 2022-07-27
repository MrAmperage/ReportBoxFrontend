import { Input, Select } from 'antd';
import React from 'react';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
import { RowInputStyle } from '../Styles/TableStyles';

export default function GroupProfile(props) {
  return (
    <ProfileWrapper GridRowsTemplate="1fr">
      <RowProfileWrapper>
        <ProfileRowElement>Группа:</ProfileRowElement>
        <ProfileRowElement>
          <Input
            size="small"
            width="190px"
            value={props.Profile.Caption}
            onChange={(Event) => {
              props.ProfileHandler('Caption', Event.target.value);
            }}
          />
        </ProfileRowElement>
      </RowProfileWrapper>
      <RowProfileWrapper>
        <ProfileRowElement>Округление плеч:</ProfileRowElement>
        <ProfileRowElement>
          <Select
            onChange={(Value) => {
              props.ProfileHandler('ShouldersRound', Value);
            }}
            dropdownMatchSelectWidth={130}
            value={props.Profile.ShouldersRound}
            options={[
              { label: 'Вверх', value: 'Up' },
              { label: 'Вниз', value: 'Down' },
              { label: 'Математически', value: 'Math' },
            ]}
            size="small"
          />
        </ProfileRowElement>
      </RowProfileWrapper>
      <RowProfileWrapper>
        <ProfileRowElement>Прицессия плеч:</ProfileRowElement>
        <ProfileRowElement>
          <RowInputStyle width="50px">
            <Input
              onChange={(Event) => {
                props.ProfileHandler(
                  'ShouldersPrecision',
                  Event.target.valueAsNumber >= 0
                    ? Event.target.valueAsNumber
                    : 0
                );
              }}
              size="small"
              type="number"
              value={props.Profile.ShouldersPrecision}
            />
          </RowInputStyle>
        </ProfileRowElement>
      </RowProfileWrapper>
    </ProfileWrapper>
  );
}
