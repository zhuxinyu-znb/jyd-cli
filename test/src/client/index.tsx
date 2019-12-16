import * as React from "react";
import * as ReactDOM from "react-dom";
import Routes from "./routers";
import "@assets/styles/common.css";
import { BrowserRouter } from "react-router-dom";
import { message } from 'antd';
import ErrorBoundary from '@components/Error'


message.config({ duration: 2 })
window.message = message;
const { useContext } = React


const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/">
        {Routes}
      </BrowserRouter>
    </ErrorBoundary>
  )
}

ReactDOM.render(<App />, document.getElementById("app"));


if (module.hot) {
  module.hot.dispose(function () {
    // 模块即将被替换时
    console.log("module will be replaced");
  });

  module.hot.accept(function () {
    // 模块或其依赖项之一刚刚更新时
    console.log("module update");
  });
}
