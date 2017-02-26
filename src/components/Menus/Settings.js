// @flow
import React from 'react'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Google from 'react-icons/lib/fa/google'
import {Link} from 'react-router'
import {observer} from 'mobx-react'

import {preferenceStore, dataStore} from '../../store'
import {orders} from '../../store/PreferenceStore'
import type {Order} from '../../store/PreferenceStore'
import http from '../../utils/http'
import css from '../../styles/Settings.scss'
import Text from '../Text'
import Radio from '../Radio'

const Item = ({label, children}) => (
  <div className="settings-item">
    <h2>{label}</h2>
    {children}
  </div>
)

@observer
class LanguageSelector extends React.PureComponent {
  render() {
    return (
      <Radio
        options={[
          {label: 'Finnish', value: 'fi'},
          {label: 'English', value: 'en'}
        ]}
        selected={preferenceStore.lang}
        onChange={lang => {preferenceStore.lang = lang}} />
    )
  }
}

@observer
export default class Settings extends React.PureComponent {
  setOrder = (value: Order) => {preferenceStore.order = value}
  setUseLocation = (value: boolean) => {preferenceStore.useLocation = value}
  render() {
    return (
      <div className={css.container}>
        <h1><Text id="settings" /></h1>
        <Link className={css.favorites} to="/settings/favorites">
          <Text id="favorites" className="button" element="button" />
        </Link>
        <Item label={<Text id="language" />}>
          <LanguageSelector />
        </Item>
        <Item label={<Text id="order" />}>
          <Radio
            options={orders.map(order => ({
              value: order,
              label: <Text id={order} />
            }))}
            selected={preferenceStore.order}
            onChange={this.setOrder} />
        </Item>
        <Item label={<Text id="useLocation" />}>
          <Radio
            options={[
              {label: <Text id="yes" />, value: true},
              {label: <Text id="no" />, value: false}
            ]}
            selected={preferenceStore.useLocation}
            onChange={this.setUseLocation} />
        </Item>
        <Item label={<Text id="profile" />}>
          {dataStore.user ?
          <div className={css.user}>
            <img src={dataStore.user.photo} />
            <p>{dataStore.user.displayName}<br /><small>{dataStore.user.email}</small></p>
            <button
              className="button button-small"
              style={{marginLeft: '1em'}}
              onClick={() =>
                http.get('/me/logout', true).then(() => dataStore.user = null)
              }>
                <Text id="logout" />
              </button>
          </div>
          :
          <div className={css.loginButtons}>
            <a href={`https://www.facebook.com/dialog/oauth?client_id=1841481822746867&redirect_uri=${location.href}?facebook&response_type=token&scope=email`}>
              <button style={{background: '#3b5998'}}>
                <Facebook className="inline-icon" /><Text id="facebookLogin" />
              </button>
            </a>
            <a href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=402535393048-osrrh9uci8031oh4sv3vepgifsol0rd8.apps.googleusercontent.com&redirect_uri=${location.href}?google&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email`}>
              <button style={{background: '#983b3b'}}>
                <Google className="inline-icon" /><Text id="googleLogin" />
              </button>
            </a>
          </div>
          }
        </Item>
      </div>
    )
  }
}
