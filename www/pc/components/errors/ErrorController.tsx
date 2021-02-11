import React, {Component} from 'react';
import Page400 from './Page400';
import Page401 from './Page401';
import Page403 from './Page403';
import Page404 from './Page404';
import Page410 from './Page410';
import Page500 from './Page500';

interface Props {
    status: number;
    message?: string;
}

class ErrorController extends Component<Props> {
    public render() {
        const {status, message} = this.props;
        switch (status) {
            case 410:
                return <Page410/>;
            case 400:
                return <Page400/>;
            case 401:
                return <Page401/>;
            case 403:
                return <Page403 message={message}/>;
            case 404:
                return <Page404/>;
            case 500:
            case 501:
            case 502:
            case 503:
                return <Page500/>;
            case 0:
            case 200:
            case 201:
            default:
                return <Page500/>;
        }
    }
}

export default ErrorController;
