import { Route } from 'react-keeper'
import Page from './PageExportexcel';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/exportexcel/:id' >

            </Route>
        </div>)
};