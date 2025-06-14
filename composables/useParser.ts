import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

export const useParser = () => {
  const value = useState("md_parser", async() => {
    const md = MarkdownIt()
    md.use(await Shiki({
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      }
    }))
    return md
  })
  return value.value
}