/// <resources type="react" />
/// <resources type="draft-js" />

declare module 'draft-js-plugins-editor' {
    type PluginsEditorProps =
        | Draft.EditorProps
        | {
              plugins: any;
          };

    export default class PluginsEditor extends React.Component<PluginsEditorProps, Draft.EditorState> {}
    function createEditorStateWithText(text: string): PluginsEditor;
    function composeDecorators(...func: any[]): (...args: any[]) => any;
}

// @todo flesh out component type
declare module 'draft-js-emoji-plugin' {
    function createEmojiPlugin(config?: object): any;
    type EmojiSuggestions = any;

}

declare module 'draft-js-mention-plugin' {
    // @todo missing defaultTheme
    // @todo missing defaultSuggestionsFilter

    type Props = {
        suggestions: any[];
        onAddMention: (mention: any) => void;
        entryComponent: (...props: any[]) => JSX.Element;
        entityMutability: string;
    };

    type State = {
        isActive: boolean;
        focusedOptionIndex: number;
    };

    type MentionSuggestions<T> = React.Component<Props, State>;
    export default function createMentionPlugin(config?: object): any;
}
