import { Route } from 'react-keeper'
import Page from './PageExportword';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/exportword/:id' >

            </Route>
        </div>)
};