const APP_BASE_ROUTE = "/home";
const AUTH_BASE_ROUTE = "";
const JOBS_BASE_ROUTE = `${APP_BASE_ROUTE}/jobs`;

const Routes = {
  APP_BASE_ROUTE,
  AUTH_BASE_ROUTE,
  JOBS_BASE_ROUTE,

  LOGIN_PAGE: `${AUTH_BASE_ROUTE}/login`,
  SIGNUP_PAGE: `${AUTH_BASE_ROUTE}/register`,

  JOBS_PAGE: `${JOBS_BASE_ROUTE}/all`,
  JOB_PAGE: `${JOBS_BASE_ROUTE}/:id`,

  SKILLS_PAGE: `${APP_BASE_ROUTE}/skills/all`,
  SKILL_PAGE: `${APP_BASE_ROUTE}/skills/:id`,

  COMPANIES_PAGE: `${APP_BASE_ROUTE}/companies/all`,
  COMPANY_PAGE: `${APP_BASE_ROUTE}/companies/:id`,

  CONTACTS_PAGE: `${APP_BASE_ROUTE}/contacts/all`,
};

export default Routes;
