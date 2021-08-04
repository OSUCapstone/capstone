import { Redirect, Route, Switch } from "react-router";
import { NavBar, PrivateRoute } from "./components";

import { 
  LoginPage, 
  SignupPage, 
  CompanyPage, 
  CompanyCreatePage, 
  CompaniesPage, 
  ContactsPage,
  ContactCreatePage,
  ContactPage,
  JobPage, 
  JobsPage, 
  SkillPage,
  SkillCreatePage,
  SkillsPage,
  } from "./pages";
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
              <SkillsPage />
            </PrivateRoute>
            
            <PrivateRoute path={Routes.SKILL_CREATE_PAGE}>
              <SkillCreatePage />
            </PrivateRoute>

            <PrivateRoute path={Routes.SKILL_PAGE}>
              <SkillPage />
            </PrivateRoute>

            {/* Companies */}
            <PrivateRoute path={Routes.COMPANIES_PAGE}>
              <CompaniesPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.COMPANY_CREATE_PAGE}>
              <CompanyCreatePage />
            </PrivateRoute>

            <PrivateRoute path={Routes.COMPANY_PAGE}>
              <CompanyPage />
            </PrivateRoute>

            {/* Contacts */}
            <PrivateRoute exact path={Routes.CONTACTS_PAGE}>
              <ContactsPage />
            </PrivateRoute>

            <PrivateRoute path={Routes.CONTACT_CREATE_PAGE}>
              <ContactCreatePage />
            </PrivateRoute>

            <PrivateRoute path={Routes.CONTACT_PAGE}>
              <ContactPage />
            </PrivateRoute>
          </Switch>
        </div>
      </PrivateRoute>

      <Route component={() => <Redirect to={Routes.LOGIN_PAGE} />} />
    </Switch>
  </div>
);

export default App;
