import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import PrivateWrapper from '../privateWrapper';
import ReceiveButton from '../receiveButton';
import RegisterDelegate from '../registerDelegate';
import SecondPassphraseMenu from '../secondPassphrase';
import Send from '../send';
import SignMessage from '../signMessage';
import VerifyMessage from '../verifyMessage';
import logo from '../../assets/images/LISK-nano.png';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import styles from './header.css';

const Header = props => (
  <header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`} >
    <div className={styles.logoWrapper}>
      <img className={styles.logo} src={logo} alt="logo" />
    </div>
    <PrivateWrapper>
      <IconMenu
        className={`${styles.iconButton} main-menu-icon-button ${offlineStyle.disableWhenOffline}`}
        icon="more_vert"
        position="topRight"
        menuRipple
        theme={styles}
      >
        {
          !props.account.isDelegate &&
            <MenuItem caption="Register as delegate"
              className='register-as-delegate'
              onClick={() => props.setActiveDialog({
                title: 'Register as delegate',
                childComponent: RegisterDelegate,
              })}
            />
        }
        <SecondPassphraseMenu />
        <MenuItem caption="Sign message"
          className='sign-message'
          onClick={() => props.setActiveDialog({
            title: 'Sign message',
            childComponentProps: {
              account: props.account,
            },
            childComponent: SignMessage,
          })}
        />
        <MenuItem caption="Verify message"
          className='verify-message'
          onClick={() => props.setActiveDialog({
            title: 'Verify message',
            childComponent: VerifyMessage,
          })}
        />
      </IconMenu>
      <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>{props.t('logout')}</Button>
      <ReceiveButton className={styles.button} label='Receive' />
      <Button className={`${styles.button} send-button ${offlineStyle.disableWhenOffline}`}
        raised primary
        onClick={() => props.setActiveDialog({
          title: props.t('send'),
          childComponent: Send,
        })}>{props.t('send')}</Button>
    </PrivateWrapper>
  </header>
);

export default Header;
