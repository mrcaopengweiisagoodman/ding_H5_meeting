import { Route } from 'react-keeper'
import Page from './PageStatistical';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/statistical' >

            </Route>
        </div>)
};