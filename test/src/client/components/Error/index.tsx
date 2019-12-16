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