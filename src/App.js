import { Redirect, Route, Switch } from "react-router";
import { PrivateRoute } from "./components";

import { Home, LoginPage, SignupPage, JobPage, CompanyPage } from "./pages";
import Routes from "./Routes";

// comment just to deploy
const App = () => (
  <div>
    <Switch>
      <Route path={Routes.LOGIN_PAGE}>
        <LoginPage />
      </Route>

      <Route path={Routes.SIGNUP_PAGE}>
        <SignupPage />
      </Route>

      <PrivateRoute path={Routes.HOME_PAGE}>
        <Home />
      </PrivateRoute>

      <PrivateRoute path={Routes.JOB_PAGE}>
        <JobPage />
      </PrivateRoute>

      <PrivateRoute path={Routes.COMPANY_PAGE}>
        <CompanyPage />
      </PrivateRoute>

      <Route component={() => <Redirect to={Routes.LOGIN_PAGE} />} />
    </Switch>
  </div>
);

export default App;
