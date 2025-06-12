import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import type { ToVNodeOptions } from 'mdast-util-to-vnode'
import { toVNode } from 'mdast-util-to-vnode'
import { gfm } from 'micromark-extension-gfm'
import type { HighlighterCore, LanguageRegistration, ThemeRegistration } from 'shiki'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import css from 'shiki/langs/css.mjs'
import html from 'shiki/langs/html.mjs'
import javascript from 'shiki/langs/javascript.mjs'
import json from 'shiki/langs/json.mjs'
import markdown from 'shiki/langs/markdown.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import vue from 'shiki/langs/vue.mjs'
import catppuccinLatte from 'shiki/themes/catppuccin-latte.mjs'
import catppuccinMocha from 'shiki/themes/catppuccin-mocha.mjs'
import { computed, defineComponent, provide } from 'vue'
import './index.scss'
import CodeBlock from './nodes/CodeBlock.vue'
import { VUE_MARKDOWN_CONTEXT_KEY } from './utils'

export interface VueMarkdownProps {
  md: string
  components?: ToVNodeOptions['components']
  shiki?: {
    themes?: Record<string, ThemeRegistration>
    langs?: LanguageRegistration[][]
  }
}

export interface VUE_MARKDOWN_CONTEXT {
  shiki: {
    highlighter: HighlighterCore
    themes: Required<VueMarkdownProps>['shiki']['themes']
    langs: Required<VueMarkdownProps>['shiki']['langs']
  }
}

export const VueMarkdown = defineComponent<VueMarkdownProps>({
  name: 'VueMarkdown',
  props: {
    md: {
      type: String,
      default: '',
    },
    components: {
      type: Object as () => ToVNodeOptions['components'],
      default: undefined,
    },
    shiki: {
      type: Object as () => VueMarkdownProps['shiki'],
      default: () => ({
        themes: {
          light: catppuccinLatte,
          dark: catppuccinMocha,
        },
        langs: [
          css,
          html,
          javascript,
          json,
          markdown,
          typescript,
          vue,
        ],
      }),
    },
  },
  setup(props) {
    const vNode = computed(() => {
      const ast = fromMarkdown(props.md, {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()],
      })

      return toVNode(ast, {
        components: {
          code: CodeBlock,
          ...props.components,
        },
      })
    })

    const highlighter = createHighlighterCoreSync({
      engine: createJavaScriptRegexEngine(),
      themes: Object.values(props.shiki?.themes ?? {}),
      langs: props.shiki?.langs ?? [],
    })

    provide<VUE_MARKDOWN_CONTEXT>(VUE_MARKDOWN_CONTEXT_KEY, {
      shiki: {
        highlighter,
        themes: props.shiki?.themes,
        langs: props.shiki?.langs,
      },
    })

    return () => (
      <div class="vue-markdown">
        {vNode.value}
      </div>
    )
  },
})
