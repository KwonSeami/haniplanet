import {RouterProps} from 'next/router';

type CustomRouterProps = RouterProps<{
    query: {
        [key: string]: string;
    };
    queryParams: {
        [key: string]: string;
    };
}>;

interface WithRouterProps {
    router: CustomRouterProps;
}