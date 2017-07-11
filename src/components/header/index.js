import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import logo from '../../assets/images/LISK-nano.png';
import styles from './header.css';

class Header extends React.Component {
  render() {
    return (
  <header className={styles.wrapper}>
    <img className={styles.logo} src={logo} alt="logo" />
    <IconMenu
      className={`${styles.iconButton} main-menu-icon-button`}
      icon="more_vert"
      position="topRight"
      menuRipple
      theme={styles}
    >
      <MenuItem caption="Register second passphrase" />
      <MenuItem caption="Register as delegate" />
      <MenuItem caption="Sign message"
        className='sign-message'
        onClick={() => this.props.setActiveDialog('sign-message')}
      />
      <MenuItem caption="Verify message"
        className='verify-message'
        onClick={() => this.props.setActiveDialog('verify-message')}
      />
    </IconMenu>
    <Button className={styles.button} raised>logout</Button>
    <Button className={styles.button} raised primary>send</Button>
  </header>
    );
  }
}
export default Header;
