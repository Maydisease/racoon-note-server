import * as MarkdownIt from 'markdown-it';

const plugin = (md: MarkdownIt) => {
    md.inline.ruler2.before('emphasis', 'toDo', (state: any) => {
        if (state.tokens && typeof state.tokens === 'object' && state.tokens.length > 0) {
            state.tokens.forEach((token, index) => {
                if (token.type === 'softbreak') {
                    state.tokens[index].type = 'br_close'
                }
            });
        }
    });
};

export default plugin;
