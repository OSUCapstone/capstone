import { Redirect, Route, Switch } from "react-router";
import { NavBar, PrivateRoute } from "./components";

import { JobPage, JobsPage, LoginPage, SignupPage } from "./pages";
import CompanyPage from "./pages/CompanyPage";
import Routes from "./Routes";

const App = () => (
  <div className="h-screen">
    <Switch>
      <Route path={Routes.LOGIN_PAGE}>
        <LoginPage />
      </Route>

      <Route path={Routes.SIGNUP_PAGE}>
        <SignupPage />
      </Route>

      {/* Authorized Pages all live inside Nav container */}
      <PrivateRoute path={Routes.APP_BASE_ROUTE}>
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <div className="w-full flex-none">
            <NavBar />
          </div>

          <Switch>
            <PrivateRoute path={Routes.COMPANY_PAGE}>
              <CompanyPage />
            </PrivateRoute>

            <PrivateRoute exact path={Routes.JOBS_PAGE}>
              <JobsPage />
            </PrivateRoute>

            <PrivateRoute exact path={Routes.JOB_PAGE}>
              <JobPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.SKILLS_PAGE}>
              <CompanyPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.COMPANIES_PAGE}>
              <CompanyPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.CONTACTS_PAGE}>
              <CompanyPage />
            </PrivateRoute>
          </Switch>
        </div>
      </PrivateRoute>

      <Route component={() => <Redirect to={Routes.LOGIN_PAGE} />} />
    </Switch>
  </div>
);

export default App;
