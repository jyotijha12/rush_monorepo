## Update Environment variables

**REACT_APP_TABLEAU_SERVER_URL**=<TABLEAU_SEVER_URL>
**REACT_APP_BASE_URL**=<BASEURL>
**REACT_APP_BASE_API_URL**=<API_URL>
**REACT_APP_BASE_AUTHENTICATION_URL**=<AUTHENTICATION_URL>

##### #ENCRYPTION

**REACT_APP_ENCRYPTION_SECRET**=<ENCRYPTION_SECRET>

##### #WSO2

**REACT_APP_CLIENT_ID**=<WSO2_CLIENT_ID>
**REACT_APP_REDIRECT_URI**=<WSO2_REDIRECT_URI>
**REACT_APP_WSO2_URI**=<WSO2_URI>

##### #VAULT

**REACT_APP_VAULT_SECRET_PATH**=<VAULT_PATH>

##### #ROUTES

**REACT_APP_BASENAME**=<BASENAME> `eg: /absa`
**REACT_APP_BTI_SOLUTION**=<BTI_SOLUTION_PAGE_ROUTE> `eg: /bti-tool`
**REACT_APP_HOME**=<HOME_PAGE_ROUTE> `eg: /recent-applications`
**REACT_APP_WSO2**=<WSO2_PAGE_ROUTE> `eg: /wso2login`
**REACT_APP_TABLEAU**=<TABLEAU_PAGE_ROUTE> `eg: /tableau`

## Configure page routes

- `/absa` **basename** to <new_path>
  **Update in these files:** package.json, index.html

  **Note:** `REACT_APP_BASENAME` and `<new_path>` should be same and add trailing `/` at the end.
