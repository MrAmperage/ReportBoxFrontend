import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';
import { GlobalInputStyle } from '../Styles/GlobalStyle';
import { Collapse, Input, Tree } from 'antd';
const { Panel } = Collapse;
const UserProfile = inject('GlobalStore')(
  observer((props) => {
    return (
      <>
        <ProfileWrapper GridRowsTemplate="1fr">
          <RowProfileWrapper>
            <ProfileRowElement>Роль:</ProfileRowElement>
            <ProfileRowElement>
              <GlobalInputStyle>
                <Input
                  onChange={(Event) => {}}
                  size="small"
                  width="190px"
                  value={props.Profile.Rolename}
                />
              </GlobalInputStyle>
            </ProfileRowElement>
          </RowProfileWrapper>
        </ProfileWrapper>
        <Collapse>
          <Panel header="Меню пользователя">
            <Tree
              treeData={props.UserMenu}
              checkable={true}
              selectable={false}
            />
          </Panel>
        </Collapse>
        <Collapse>
          <Panel header="Группы">
            <Tree />
          </Panel>
        </Collapse>
      </>
    );
  })
);

export default UserProfile;
