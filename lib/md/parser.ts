import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const parser = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki, {
        themes: {
            light: "vitesse-light",
            dark: "vitesse-dark"
        }
    }).use(rehypeStringify)

export function getParser() {
    return parser
}