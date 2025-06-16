import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const parser = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, {
        themes: {
            light: "catppuccin-latte",
            dark: "catppuccin-mocha"
        }
    }).use(rehypeStringify)

export function getParser() {
    return parser
}