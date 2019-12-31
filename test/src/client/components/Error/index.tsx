import * as React from 'react'
import './index.less'

export default class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }
  componentDidMount() {
    // eslint-disable-next-line max-params
    window.onerror = function (msg, url, row, col, error) {
      console.log('警告！！！捕获到错误', msg);
      return true;
    }

    // 捕获404错误
    // eslint-disable-next-line max-params
    window.addEventListener('error', (msg, url, row, col, error) => {
      console.log('警告！！！404错误', msg, url, row, col, error);
      return false;
    }, true)

    // 捕获promise错误
    window.addEventListener('unhandledrejection', function (e) {
      e.preventDefault();
      console.log("警告！！！", e.reason);
    })
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="cmpt-error">
          <h2>页面出现错误</h2>
        </div>
      )
    }
    return this.props.children;
  }
}