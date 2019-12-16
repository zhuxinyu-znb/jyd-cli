import * as React from 'react'
import { NavLink, RouteComponentProps } from 'react-router-dom'
import { Form, Icon, Input, Button } from 'antd'
import { setStorage } from '@utils/storage'
import './index.less'

const { useState, useEffect, useContext } = React

const Login = (routerProps: RouteComponentProps) => {
  const { location, history } = routerProps

  const redirectUrl = location.state ? location.state.from.pathname : '/home';

  // const ydstore = useContext(YdStore)

  // const RedirectUrl = location.state ? location.state.from.pathname : "/index/index";

  const { 0: user, 1: setUser } = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    document.title = '系统登录'
  }, [])
  /* 
    const onInputChange = ({ target: { name, value } }) => setUser({ ...user, [name]: value })
  
    const onInputKeyUp = ({ keyCode }) => keyCode === 13 && onSubmit()
  
    const checkLogin = ({ username, password }) => {
      if (!username) {
        return {
          status: false,
          msg: '用户名不能为空！'
        }
      }
  
      if (!password) {
        return {
          status: false,
          msg: '密码不能为空！'
        }
      }
  
      return {
        status: true,
        msg: '验证通过'
      }
    }
  
    const onSubmit = async () => {
      const { status, msg } = checkLogin(user)
  
      if (status) {
        try {
          history.push(redirectUrl)
        } catch (err) {
          console.log(err)
          window.message.error('用户名或密码错误')
        }
      } else {
        window.message.error(msg)
      }
    } */

  return (
    <section className="page-login">
      <section className="login-panel">
        <h1 className="login-panel-title">系统登录</h1>
        <div className="form-group">
          <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="username"
            placeholder="用户名"
          // onKeyUp={onInputKeyUp}
          // onChange={onInputChange}
          />
        </div>
        <div className="form-group">
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="password"
            type="password"
            placeholder="密码"
          // onKeyUp={onInputKeyUp}
          // onChange={onInputChange}
          />
        </div>
        <div className="login-btn-group">
          <Button
            type="primary"
            className="login-form-button"
          // onClick={onSubmit}
          >登录</Button>
        </div>
      </section>
      <nav className="nav-bar">
        <NavLink to="/about" className="nav-bar-item">关于我们</NavLink>
      </nav>

    </section>
  )
}

export default Login
