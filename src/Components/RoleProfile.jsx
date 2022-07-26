import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  ProfileRowElement,
  ProfileWrapper,
  RowProfileWrapper,
} from '../Styles/ProfileStyles';

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
              <Input
                onChange={(Event) => {
                  props.ProfileHandler('Rolename', Event.target.value);
                }}
                size="small"
                width="190px"
                value={props.Profile.Rolename}
              />
            </ProfileRowElement>
          </RowProfileWrapper>
        </ProfileWrapper>
        <Collapse>
          <Panel header="Меню пользователя">
            <Tree
              fieldNames={{ title: 'Caption', key: 'Id', children: 'LeftMenu' }}
              onCheck={(Checked) => {
                props.ProfileHandler('MenusAccess', Checked);
              }}
              checkedKeys={props.Profile.MenusAccess}
              treeData={props.UserMenu}
              checkable={true}
              selectable={false}
            />
          </Panel>
        </Collapse>
        <Collapse>
          <Panel header="Организации и участки">
            <Tree />
          </Panel>
        </Collapse>
      </>
    );
  })
);

export default UserProfile;
