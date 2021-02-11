import Link from 'next/link';
import * as React from 'react';
import {branch, compose, defaultProps, renderComponent, withProps} from 'recompose';
import A from './A';

interface OuterProps {
    href?: string;
    isNewTab?: boolean;
}

interface InnerProps extends OuterProps {
    Comp: React.ComponentType;
};

const herfHasOrigin = (href: string) => {
    if (typeof window !== 'undefined') {
        const {location: {origin}} = window;
    
        return href.includes(origin) || origin.includes(href);
    }

    return false;
}

const right = withProps(({href, isNewTab}: InnerProps) => {
    const hasOrigin = href[0] !== '/';

    return isNewTab || (hasOrigin && !herfHasOrigin(href)) ? {
        Comp: A
    } : {
        Comp: Link,
        href: hasOrigin ?
            href.split(window.location.origin)[1] :
            href
    }
});

const LinkOrA: React.FC<InnerProps> = ({Comp, ...rest}) => (
    <Comp {...rest} />
);

export default compose<InnerProps, OuterProps>(
    defaultProps({href: '', isNewTab: false}),
    branch(
        () => typeof window === 'undefined',
        renderComponent(() => null),
        right
    )
)(LinkOrA);
