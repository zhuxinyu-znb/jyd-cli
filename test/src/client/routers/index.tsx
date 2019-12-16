import * as React from "react";
import { Switch, Route, RouteProps, Redirect } from "react-router-dom";
import Loading from "@components/Loading";
import Login from "@pages/login";
import NoMatch from "@components/NoMatch";
import Map from '@pages/map';
const { Suspense, lazy } = React;

const Report = lazy(() =>
  import(/* webpackChunkName: "report" */ "@pages/report")
);

interface YDProps extends RouteProps {
  key: string,
  auth?: boolean,
  children?: any
}

const routeConfig: YDProps[] = [
  {
    key: 'login',
    path: "/login",
    exact: true,
    component: Login
  },
  {
    key: 'report',
    path: "/report",
    exact: true,
    component: Report
  },
  {
    key: 'map',
    path: "/map",
    exact: true,
    component: Map
  },
];



const generateRoutes = (routeConfig: YDProps[]) => (
  <Suspense fallback={Loading}>
    <Switch>
      <Route path="/" exact render={() => <Redirect to="/login" />} key="/home" />,
      {
        routeConfig.map((r, i: number) => {
          const { path, component, exact, key } = r;
          const LazyCom = component;
          return (
            <Route
              key={key}
              exact={exact}
              path={path}
              component={LazyCom}
            />
          );
        })
      }
      <Route component={NoMatch} />
    </Switch>
  </Suspense>
);


const Routes = generateRoutes(routeConfig);

export default Routes;
