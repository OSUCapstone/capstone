import { Redirect, Route, Switch } from "react-router";
import { NavBar, PrivateRoute } from "./components";

import { JobPage, JobsPage, LoginPage, SignupPage, CompanyPage } from "./pages";
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
            {/* Jobs */}
            <PrivateRoute exact path={Routes.JOBS_PAGE}>
              <JobsPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.JOB_PAGE}>
              <JobPage />
            </PrivateRoute>

            {/* Skills */}
            <PrivateRoute exact path={Routes.SKILLS_PAGE}>
              <JobsPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.SKILL_PAGE}>
              <JobPage />
            </PrivateRoute>

            {/* Companies */}
            <PrivateRoute path={Routes.COMPANY_PAGE}>
              <CompanyPage />
            </PrivateRoute>

            {/* Contacts */}
            <PrivateRoute exact path={Routes.CONTACTS_PAGE}>
              <JobsPage />
            </PrivateRoute>
          </Switch>
        </div>
      </PrivateRoute>

      <Route component={() => <Redirect to={Routes.LOGIN_PAGE} />} />
    </Switch>
  </div>
);

export default App;
