import { Route } from 'react-keeper'
import Page from './Pageresult';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/result/:mtMeetingId/:id' >

            </Route>
        </div>)
};