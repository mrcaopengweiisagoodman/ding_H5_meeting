import { Route } from 'react-keeper'
import Page from './PageMeetingadd';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/meetingadd' >

            </Route>
        </div>)
};