import * as React from 'react';
import styled, {StyledComponent} from 'styled-components';

export function createMarkup(__html: string) {
    return {
        __html,
    };
}

interface Props {
    text: string;
    keyword: string;
    caseSensitive?: boolean;
    color: string;
    background?: boolean;
    onHighlightClick?: React.MouseEventHandler;
}

export default class KeyWordHighlight extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        caseSensitive: false
    };

    public HighLightedSpan: StyledComponent<'span', any, {}, never>;

    constructor(props) {
        super(props);

        this.HighLightedSpan = styled.span`
            ${props.background ? 'background-color': 'color'}: ${props.color};
        `;
    }

    public render() {
        const {
            text: originalText = '',
            keyword: originalKeyword = '',
            caseSensitive,
            onHighlightClick
        } = this.props;
        const _keyword = caseSensitive ? originalKeyword : originalKeyword.toLowerCase();
        const _text = caseSensitive ? originalText : (originalText || '').toLowerCase();
        const lengthOfKeyword = _keyword.length;
        const splited = _text ? _text.split(_keyword) : [];
        const maxIdx = splited.length - 1;
        const returnArray: JSX.Element[] = [];

        splited.reduce((prev, curr, idx) => {
            const isNotLast = idx < maxIdx;
            const nextExcludeStartAt = prev + curr.length + (isNotLast ? lengthOfKeyword : 0);
            if (curr) {
                returnArray.push(
                    <span
                        key={idx}
                        className="excluded"
                        dangerouslySetInnerHTML={createMarkup(curr)}
                    />,
                );
            }
            if (isNotLast) {
                const kwd = originalText.substring(nextExcludeStartAt - lengthOfKeyword, nextExcludeStartAt);

                returnArray.push(
                    <this.HighLightedSpan key={`${idx}_${originalKeyword}`} onClick={e => onHighlightClick && onHighlightClick(e)}>
                        {kwd}
                    </this.HighLightedSpan>
                );
            }

            return nextExcludeStartAt;
        }, 0);
        
        return returnArray;
    }
}
