var e = { exports: {} }
/*!
  Highlight.js v11.5.0 (git: 7a62552656)
  (c) 2006-2022 Ivan Sagalaev and other contributors
  License: BSD-3-Clause
 */ !(function (e, n) {
  var t,
    a = (function () {
      var e = { exports: {} }
      function n(e) {
        return (
          e instanceof Map
            ? (e.clear =
                e.delete =
                e.set =
                  () => {
                    throw Error('map is read-only')
                  })
            : e instanceof Set &&
              (e.add =
                e.clear =
                e.delete =
                  () => {
                    throw Error('set is read-only')
                  }),
          Object.freeze(e),
          Object.getOwnPropertyNames(e).forEach(t => {
            var a = e[t]
            'object' != typeof a || Object.isFrozen(a) || n(a)
          }),
          e
        )
      }
      ;(e.exports = n), (e.exports.default = n)
      var t = e.exports
      class a {
        constructor(e) {
          void 0 === e.data && (e.data = {}),
            (this.data = e.data),
            (this.isMatchIgnored = !1)
        }
        ignoreMatch() {
          this.isMatchIgnored = !0
        }
      }
      function i(e) {
        return e
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
      }
      function r(e, ...n) {
        const t = Object.create(null)
        for (const n in e) t[n] = e[n]
        return (
          n.forEach(e => {
            for (const n in e) t[n] = e[n]
          }),
          t
        )
      }
      const s = e => !!e.kind
      class o {
        constructor(e, n) {
          ;(this.buffer = ''), (this.classPrefix = n.classPrefix), e.walk(this)
        }
        addText(e) {
          this.buffer += i(e)
        }
        openNode(e) {
          if (!s(e)) return
          let n = e.kind
          ;(n = e.sublanguage
            ? 'language-' + n
            : ((e, { prefix: n }) => {
                if (e.includes('.')) {
                  const t = e.split('.')
                  return [
                    `${n}${t.shift()}`,
                    ...t.map((e, n) => `${e}${'_'.repeat(n + 1)}`),
                  ].join(' ')
                }
                return `${n}${e}`
              })(n, { prefix: this.classPrefix })),
            this.span(n)
        }
        closeNode(e) {
          s(e) && (this.buffer += '</span>')
        }
        value() {
          return this.buffer
        }
        span(e) {
          this.buffer += `<span class="${e}">`
        }
      }
      class l {
        constructor() {
          ;(this.rootNode = { children: [] }), (this.stack = [this.rootNode])
        }
        get top() {
          return this.stack[this.stack.length - 1]
        }
        get root() {
          return this.rootNode
        }
        add(e) {
          this.top.children.push(e)
        }
        openNode(e) {
          const n = { kind: e, children: [] }
          this.add(n), this.stack.push(n)
        }
        closeNode() {
          if (this.stack.length > 1) return this.stack.pop()
        }
        closeAllNodes() {
          for (; this.closeNode(); );
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4)
        }
        walk(e) {
          return this.constructor._walk(e, this.rootNode)
        }
        static _walk(e, n) {
          return (
            'string' == typeof n
              ? e.addText(n)
              : n.children &&
                (e.openNode(n),
                n.children.forEach(n => this._walk(e, n)),
                e.closeNode(n)),
            e
          )
        }
        static _collapse(e) {
          'string' != typeof e &&
            e.children &&
            (e.children.every(e => 'string' == typeof e)
              ? (e.children = [e.children.join('')])
              : e.children.forEach(e => {
                  l._collapse(e)
                }))
        }
      }
      class c extends l {
        constructor(e) {
          super(), (this.options = e)
        }
        addKeyword(e, n) {
          '' !== e && (this.openNode(n), this.addText(e), this.closeNode())
        }
        addText(e) {
          '' !== e && this.add(e)
        }
        addSublanguage(e, n) {
          const t = e.root
          ;(t.kind = n), (t.sublanguage = !0), this.add(t)
        }
        toHTML() {
          return new o(this, this.options).value()
        }
        finalize() {
          return !0
        }
      }
      function d(e) {
        return e ? ('string' == typeof e ? e : e.source) : null
      }
      function g(e) {
        return h('(?=', e, ')')
      }
      function u(e) {
        return h('(?:', e, ')*')
      }
      function b(e) {
        return h('(?:', e, ')?')
      }
      function h(...e) {
        return e.map(e => d(e)).join('')
      }
      function m(...e) {
        const n = (e => {
          const n = e[e.length - 1]
          return 'object' == typeof n && n.constructor === Object
            ? (e.splice(e.length - 1, 1), n)
            : {}
        })(e)
        return '(' + (n.capture ? '' : '?:') + e.map(e => d(e)).join('|') + ')'
      }
      function p(e) {
        return RegExp(e.toString() + '|').exec('').length - 1
      }
      const f = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
      function y(e, { joinWith: n }) {
        let t = 0
        return e
          .map(e => {
            t += 1
            const n = t
            let a = d(e),
              i = ''
            for (; a.length > 0; ) {
              const e = f.exec(a)
              if (!e) {
                i += a
                break
              }
              ;(i += a.substring(0, e.index)),
                (a = a.substring(e.index + e[0].length)),
                '\\' === e[0][0] && e[1]
                  ? (i += '\\' + (Number(e[1]) + n))
                  : ((i += e[0]), '(' === e[0] && t++)
            }
            return i
          })
          .map(e => `(${e})`)
          .join(n)
      }
      const E = '[a-zA-Z]\\w*',
        v = '[a-zA-Z_]\\w*',
        x = '\\b\\d+(\\.\\d+)?',
        w =
          '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)',
        _ = '\\b(0b[01]+)',
        k = { begin: '\\\\[\\s\\S]', relevance: 0 },
        N = {
          scope: 'string',
          begin: "'",
          end: "'",
          illegal: '\\n',
          contains: [k],
        },
        A = {
          scope: 'string',
          begin: '"',
          end: '"',
          illegal: '\\n',
          contains: [k],
        },
        S = (e, n, t = {}) => {
          const a = r({ scope: 'comment', begin: e, end: n, contains: [] }, t)
          a.contains.push({
            scope: 'doctag',
            begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
            end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
            excludeBegin: !0,
            relevance: 0,
          })
          const i = m(
            'I',
            'a',
            'is',
            'so',
            'us',
            'to',
            'at',
            'if',
            'in',
            'it',
            'on',
            /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
            /[A-Za-z]+[-][a-z]+/,
            /[A-Za-z][a-z]{2,}/
          )
          return (
            a.contains.push({
              begin: h(/[ ]+/, '(', i, /[.]?[:]?([.][ ]|[ ])/, '){3}'),
            }),
            a
          )
        },
        O = S('//', '$'),
        M = S('/\\*', '\\*/'),
        R = S('#', '$')
      var T = Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE: /\b\B/,
        IDENT_RE: E,
        UNDERSCORE_IDENT_RE: v,
        NUMBER_RE: x,
        C_NUMBER_RE: w,
        BINARY_NUMBER_RE: _,
        RE_STARTERS_RE:
          '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~',
        SHEBANG: (e = {}) => {
          const n = /^#![ ]*\//
          return (
            e.binary && (e.begin = h(n, /.*\b/, e.binary, /\b.*/)),
            r(
              {
                scope: 'meta',
                begin: n,
                end: /$/,
                relevance: 0,
                'on:begin': (e, n) => {
                  0 !== e.index && n.ignoreMatch()
                },
              },
              e
            )
          )
        },
        BACKSLASH_ESCAPE: k,
        APOS_STRING_MODE: N,
        QUOTE_STRING_MODE: A,
        PHRASAL_WORDS_MODE: {
          begin:
            /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
        },
        COMMENT: S,
        C_LINE_COMMENT_MODE: O,
        C_BLOCK_COMMENT_MODE: M,
        HASH_COMMENT_MODE: R,
        NUMBER_MODE: { scope: 'number', begin: x, relevance: 0 },
        C_NUMBER_MODE: { scope: 'number', begin: w, relevance: 0 },
        BINARY_NUMBER_MODE: { scope: 'number', begin: _, relevance: 0 },
        REGEXP_MODE: {
          begin: /(?=\/[^/\n]*\/)/,
          contains: [
            {
              scope: 'regexp',
              begin: /\//,
              end: /\/[gimuy]*/,
              illegal: /\n/,
              contains: [
                k,
                { begin: /\[/, end: /\]/, relevance: 0, contains: [k] },
              ],
            },
          ],
        },
        TITLE_MODE: { scope: 'title', begin: E, relevance: 0 },
        UNDERSCORE_TITLE_MODE: { scope: 'title', begin: v, relevance: 0 },
        METHOD_GUARD: { begin: '\\.\\s*[a-zA-Z_]\\w*', relevance: 0 },
        END_SAME_AS_BEGIN: e =>
          Object.assign(e, {
            'on:begin': (e, n) => {
              n.data._beginMatch = e[1]
            },
            'on:end': (e, n) => {
              n.data._beginMatch !== e[1] && n.ignoreMatch()
            },
          }),
      })
      function I(e, n) {
        '.' === e.input[e.index - 1] && n.ignoreMatch()
      }
      function C(e, n) {
        void 0 !== e.className && ((e.scope = e.className), delete e.className)
      }
      function L(e, n) {
        n &&
          e.beginKeywords &&
          ((e.begin =
            '\\b(' +
            e.beginKeywords.split(' ').join('|') +
            ')(?!\\.)(?=\\b|\\s)'),
          (e.__beforeBegin = I),
          (e.keywords = e.keywords || e.beginKeywords),
          delete e.beginKeywords,
          void 0 === e.relevance && (e.relevance = 0))
      }
      function z(e, n) {
        Array.isArray(e.illegal) && (e.illegal = m(...e.illegal))
      }
      function B(e, n) {
        if (e.match) {
          if (e.begin || e.end)
            throw Error('begin & end are not supported with match')
          ;(e.begin = e.match), delete e.match
        }
      }
      function j(e, n) {
        void 0 === e.relevance && (e.relevance = 1)
      }
      const D = (e, n) => {
          if (!e.beforeMatch) return
          if (e.starts) throw Error('beforeMatch cannot be used with starts')
          const t = Object.assign({}, e)
          Object.keys(e).forEach(n => {
            delete e[n]
          }),
            (e.keywords = t.keywords),
            (e.begin = h(t.beforeMatch, g(t.begin))),
            (e.starts = {
              relevance: 0,
              contains: [Object.assign(t, { endsParent: !0 })],
            }),
            (e.relevance = 0),
            delete t.beforeMatch
        },
        $ = [
          'of',
          'and',
          'for',
          'in',
          'not',
          'or',
          'if',
          'then',
          'parent',
          'list',
          'value',
        ]
      function P(e, n, t = 'keyword') {
        const a = Object.create(null)
        return (
          'string' == typeof e
            ? i(t, e.split(' '))
            : Array.isArray(e)
            ? i(t, e)
            : Object.keys(e).forEach(t => {
                Object.assign(a, P(e[t], n, t))
              }),
          a
        )
        function i(e, t) {
          n && (t = t.map(e => e.toLowerCase())),
            t.forEach(n => {
              const t = n.split('|')
              a[t[0]] = [e, U(t[0], t[1])]
            })
        }
      }
      function U(e, n) {
        return n ? Number(n) : (e => $.includes(e.toLowerCase()))(e) ? 0 : 1
      }
      const Z = {},
        H = e => {
          console.error(e)
        },
        F = (e, ...n) => {
          console.log('WARN: ' + e, ...n)
        },
        G = (e, n) => {
          Z[`${e}/${n}`] ||
            (console.log(`Deprecated as of ${e}. ${n}`), (Z[`${e}/${n}`] = !0))
        },
        K = Error()
      function W(e, n, { key: t }) {
        let a = 0
        const i = e[t],
          r = {},
          s = {}
        for (let e = 1; e <= n.length; e++)
          (s[e + a] = i[e]), (r[e + a] = !0), (a += p(n[e - 1]))
        ;(e[t] = s), (e[t]._emit = r), (e[t]._multi = !0)
      }
      function X(e) {
        ;(e => {
          e.scope &&
            'object' == typeof e.scope &&
            null !== e.scope &&
            ((e.beginScope = e.scope), delete e.scope)
        })(e),
          'string' == typeof e.beginScope &&
            (e.beginScope = { _wrap: e.beginScope }),
          'string' == typeof e.endScope && (e.endScope = { _wrap: e.endScope }),
          (e => {
            if (Array.isArray(e.begin)) {
              if (e.skip || e.excludeBegin || e.returnBegin)
                throw (
                  (H(
                    'skip, excludeBegin, returnBegin not compatible with beginScope: {}'
                  ),
                  K)
                )
              if ('object' != typeof e.beginScope || null === e.beginScope)
                throw (H('beginScope must be object'), K)
              W(e, e.begin, { key: 'beginScope' }),
                (e.begin = y(e.begin, { joinWith: '' }))
            }
          })(e),
          (e => {
            if (Array.isArray(e.end)) {
              if (e.skip || e.excludeEnd || e.returnEnd)
                throw (
                  (H(
                    'skip, excludeEnd, returnEnd not compatible with endScope: {}'
                  ),
                  K)
                )
              if ('object' != typeof e.endScope || null === e.endScope)
                throw (H('endScope must be object'), K)
              W(e, e.end, { key: 'endScope' }),
                (e.end = y(e.end, { joinWith: '' }))
            }
          })(e)
      }
      function q(e) {
        function n(n, t) {
          return RegExp(
            d(n),
            'm' +
              (e.case_insensitive ? 'i' : '') +
              (e.unicodeRegex ? 'u' : '') +
              (t ? 'g' : '')
          )
        }
        class t {
          constructor() {
            ;(this.matchIndexes = {}),
              (this.regexes = []),
              (this.matchAt = 1),
              (this.position = 0)
          }
          addRule(e, n) {
            ;(n.position = this.position++),
              (this.matchIndexes[this.matchAt] = n),
              this.regexes.push([n, e]),
              (this.matchAt += p(e) + 1)
          }
          compile() {
            0 === this.regexes.length && (this.exec = () => null)
            const e = this.regexes.map(e => e[1])
            ;(this.matcherRe = n(y(e, { joinWith: '|' }), !0)),
              (this.lastIndex = 0)
          }
          exec(e) {
            this.matcherRe.lastIndex = this.lastIndex
            const n = this.matcherRe.exec(e)
            if (!n) return null
            const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
              a = this.matchIndexes[t]
            return n.splice(0, t), Object.assign(n, a)
          }
        }
        class a {
          constructor() {
            ;(this.rules = []),
              (this.multiRegexes = []),
              (this.count = 0),
              (this.lastIndex = 0),
              (this.regexIndex = 0)
          }
          getMatcher(e) {
            if (this.multiRegexes[e]) return this.multiRegexes[e]
            const n = new t()
            return (
              this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)),
              n.compile(),
              (this.multiRegexes[e] = n),
              n
            )
          }
          resumingScanAtSamePosition() {
            return 0 !== this.regexIndex
          }
          considerAll() {
            this.regexIndex = 0
          }
          addRule(e, n) {
            this.rules.push([e, n]), 'begin' === n.type && this.count++
          }
          exec(e) {
            const n = this.getMatcher(this.regexIndex)
            n.lastIndex = this.lastIndex
            let t = n.exec(e)
            if (this.resumingScanAtSamePosition())
              if (t && t.index === this.lastIndex);
              else {
                const n = this.getMatcher(0)
                ;(n.lastIndex = this.lastIndex + 1), (t = n.exec(e))
              }
            return (
              t &&
                ((this.regexIndex += t.position + 1),
                this.regexIndex === this.count && this.considerAll()),
              t
            )
          }
        }
        if (
          (e.compilerExtensions || (e.compilerExtensions = []),
          e.contains && e.contains.includes('self'))
        )
          throw Error(
            'ERR: contains `self` is not supported at the top-level of a language.  See documentation.'
          )
        return (
          (e.classNameAliases = r(e.classNameAliases || {})),
          (function t(i, s) {
            const o = i
            if (i.isCompiled) return o
            ;[C, B, X, D].forEach(e => e(i, s)),
              e.compilerExtensions.forEach(e => e(i, s)),
              (i.__beforeBegin = null),
              [L, z, j].forEach(e => e(i, s)),
              (i.isCompiled = !0)
            let l = null
            return (
              'object' == typeof i.keywords &&
                i.keywords.$pattern &&
                ((i.keywords = Object.assign({}, i.keywords)),
                (l = i.keywords.$pattern),
                delete i.keywords.$pattern),
              (l = l || /\w+/),
              i.keywords && (i.keywords = P(i.keywords, e.case_insensitive)),
              (o.keywordPatternRe = n(l, !0)),
              s &&
                (i.begin || (i.begin = /\B|\b/),
                (o.beginRe = n(o.begin)),
                i.end || i.endsWithParent || (i.end = /\B|\b/),
                i.end && (o.endRe = n(o.end)),
                (o.terminatorEnd = d(o.end) || ''),
                i.endsWithParent &&
                  s.terminatorEnd &&
                  (o.terminatorEnd += (i.end ? '|' : '') + s.terminatorEnd)),
              i.illegal && (o.illegalRe = n(i.illegal)),
              i.contains || (i.contains = []),
              (i.contains = [].concat(
                ...i.contains.map(e =>
                  (e => (
                    e.variants &&
                      !e.cachedVariants &&
                      (e.cachedVariants = e.variants.map(n =>
                        r(e, { variants: null }, n)
                      )),
                    e.cachedVariants
                      ? e.cachedVariants
                      : J(e)
                      ? r(e, { starts: e.starts ? r(e.starts) : null })
                      : Object.isFrozen(e)
                      ? r(e)
                      : e
                  ))('self' === e ? i : e)
                )
              )),
              i.contains.forEach(e => {
                t(e, o)
              }),
              i.starts && t(i.starts, s),
              (o.matcher = (e => {
                const n = new a()
                return (
                  e.contains.forEach(e =>
                    n.addRule(e.begin, { rule: e, type: 'begin' })
                  ),
                  e.terminatorEnd &&
                    n.addRule(e.terminatorEnd, { type: 'end' }),
                  e.illegal && n.addRule(e.illegal, { type: 'illegal' }),
                  n
                )
              })(o)),
              o
            )
          })(e)
        )
      }
      function J(e) {
        return !!e && (e.endsWithParent || J(e.starts))
      }
      class Q extends Error {
        constructor(e, n) {
          super(e), (this.name = 'HTMLInjectionError'), (this.html = n)
        }
      }
      const V = i,
        Y = r,
        ee = Symbol('nomatch')
      var ne = (e => {
        const n = Object.create(null),
          i = Object.create(null),
          r = []
        let s = !0
        const o =
            "Could not find the language '{}', did you forget to load/include a language module?",
          l = { disableAutodetect: !0, name: 'Plain text', contains: [] }
        let d = {
          ignoreUnescapedHTML: !1,
          throwUnescapedHTML: !1,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: 'hljs-',
          cssSelector: 'pre code',
          languages: null,
          __emitter: c,
        }
        function p(e) {
          return d.noHighlightRe.test(e)
        }
        function f(e, n, t) {
          let a = '',
            i = ''
          'object' == typeof n
            ? ((a = e), (t = n.ignoreIllegals), (i = n.language))
            : (G(
                '10.7.0',
                'highlight(lang, code, ...args) has been deprecated.'
              ),
              G(
                '10.7.0',
                'Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277'
              ),
              (i = e),
              (a = n)),
            void 0 === t && (t = !0)
          const r = { code: a, language: i }
          A('before:highlight', r)
          const s = r.result ? r.result : y(r.language, r.code, t)
          return (s.code = r.code), A('after:highlight', s), s
        }
        function y(e, t, i, r) {
          const l = Object.create(null)
          function c() {
            if (!k.keywords) return void A.addText(S)
            let e = 0
            k.keywordPatternRe.lastIndex = 0
            let n = k.keywordPatternRe.exec(S),
              t = ''
            for (; n; ) {
              t += S.substring(e, n.index)
              const i = v.case_insensitive ? n[0].toLowerCase() : n[0],
                r = ((a = i), k.keywords[a])
              if (r) {
                const [e, a] = r
                if (
                  (A.addText(t),
                  (t = ''),
                  (l[i] = (l[i] || 0) + 1),
                  l[i] <= 7 && (O += a),
                  e.startsWith('_'))
                )
                  t += n[0]
                else {
                  const t = v.classNameAliases[e] || e
                  A.addKeyword(n[0], t)
                }
              } else t += n[0]
              ;(e = k.keywordPatternRe.lastIndex),
                (n = k.keywordPatternRe.exec(S))
            }
            var a
            ;(t += S.substr(e)), A.addText(t)
          }
          function g() {
            null != k.subLanguage
              ? (() => {
                  if ('' === S) return
                  let e = null
                  if ('string' == typeof k.subLanguage) {
                    if (!n[k.subLanguage]) return void A.addText(S)
                    ;(e = y(k.subLanguage, S, !0, N[k.subLanguage])),
                      (N[k.subLanguage] = e._top)
                  } else e = E(S, k.subLanguage.length ? k.subLanguage : null)
                  k.relevance > 0 && (O += e.relevance),
                    A.addSublanguage(e._emitter, e.language)
                })()
              : c(),
              (S = '')
          }
          function u(e, n) {
            let t = 1
            const a = n.length - 1
            for (; t <= a; ) {
              if (!e._emit[t]) {
                t++
                continue
              }
              const a = v.classNameAliases[e[t]] || e[t],
                i = n[t]
              a ? A.addKeyword(i, a) : ((S = i), c(), (S = '')), t++
            }
          }
          function b(e, n) {
            return (
              e.scope &&
                'string' == typeof e.scope &&
                A.openNode(v.classNameAliases[e.scope] || e.scope),
              e.beginScope &&
                (e.beginScope._wrap
                  ? (A.addKeyword(
                      S,
                      v.classNameAliases[e.beginScope._wrap] ||
                        e.beginScope._wrap
                    ),
                    (S = ''))
                  : e.beginScope._multi && (u(e.beginScope, n), (S = ''))),
              (k = Object.create(e, { parent: { value: k } })),
              k
            )
          }
          function h(e, n, t) {
            let i = ((e, n) => {
              const t = e && e.exec(n)
              return t && 0 === t.index
            })(e.endRe, t)
            if (i) {
              if (e['on:end']) {
                const t = new a(e)
                e['on:end'](n, t), t.isMatchIgnored && (i = !1)
              }
              if (i) {
                for (; e.endsParent && e.parent; ) e = e.parent
                return e
              }
            }
            if (e.endsWithParent) return h(e.parent, n, t)
          }
          function m(e) {
            return 0 === k.matcher.regexIndex ? ((S += e[0]), 1) : ((T = !0), 0)
          }
          let p = {}
          function f(n, r) {
            const o = r && r[0]
            if (((S += n), null == o)) return g(), 0
            if (
              'begin' === p.type &&
              'end' === r.type &&
              p.index === r.index &&
              '' === o
            ) {
              if (((S += t.slice(r.index, r.index + 1)), !s)) {
                const n = Error(`0 width match regex (${e})`)
                throw ((n.languageName = e), (n.badRule = p.rule), n)
              }
              return 1
            }
            if (((p = r), 'begin' === r.type))
              return (e => {
                const n = e[0],
                  t = e.rule,
                  i = new a(t),
                  r = [t.__beforeBegin, t['on:begin']]
                for (const t of r)
                  if (t && (t(e, i), i.isMatchIgnored)) return m(n)
                return (
                  t.skip
                    ? (S += n)
                    : (t.excludeBegin && (S += n),
                      g(),
                      t.returnBegin || t.excludeBegin || (S = n)),
                  b(t, e),
                  t.returnBegin ? 0 : n.length
                )
              })(r)
            if ('illegal' === r.type && !i) {
              const e = Error(
                'Illegal lexeme "' +
                  o +
                  '" for mode "' +
                  (k.scope || '<unnamed>') +
                  '"'
              )
              throw ((e.mode = k), e)
            }
            if ('end' === r.type) {
              const e = (function (e) {
                const n = e[0],
                  a = t.substr(e.index),
                  i = h(k, e, a)
                if (!i) return ee
                const r = k
                k.endScope && k.endScope._wrap
                  ? (g(), A.addKeyword(n, k.endScope._wrap))
                  : k.endScope && k.endScope._multi
                  ? (g(), u(k.endScope, e))
                  : r.skip
                  ? (S += n)
                  : (r.returnEnd || r.excludeEnd || (S += n),
                    g(),
                    r.excludeEnd && (S = n))
                do {
                  k.scope && A.closeNode(),
                    k.skip || k.subLanguage || (O += k.relevance),
                    (k = k.parent)
                } while (k !== i.parent)
                return i.starts && b(i.starts, e), r.returnEnd ? 0 : n.length
              })(r)
              if (e !== ee) return e
            }
            if ('illegal' === r.type && '' === o) return 1
            if (R > 1e5 && R > 3 * r.index)
              throw Error(
                'potential infinite loop, way more iterations than matches'
              )
            return (S += o), o.length
          }
          const v = _(e)
          if (!v)
            throw (
              (H(o.replace('{}', e)), Error('Unknown language: "' + e + '"'))
            )
          const x = q(v)
          let w = '',
            k = r || x
          const N = {},
            A = new d.__emitter(d)
          ;(() => {
            const e = []
            for (let n = k; n !== v; n = n.parent) n.scope && e.unshift(n.scope)
            e.forEach(e => A.openNode(e))
          })()
          let S = '',
            O = 0,
            M = 0,
            R = 0,
            T = !1
          try {
            for (k.matcher.considerAll(); ; ) {
              R++,
                T ? (T = !1) : k.matcher.considerAll(),
                (k.matcher.lastIndex = M)
              const e = k.matcher.exec(t)
              if (!e) break
              const n = f(t.substring(M, e.index), e)
              M = e.index + n
            }
            return (
              f(t.substr(M)),
              A.closeAllNodes(),
              A.finalize(),
              (w = A.toHTML()),
              {
                language: e,
                value: w,
                relevance: O,
                illegal: !1,
                _emitter: A,
                _top: k,
              }
            )
          } catch (n) {
            if (n.message && n.message.includes('Illegal'))
              return {
                language: e,
                value: V(t),
                illegal: !0,
                relevance: 0,
                _illegalBy: {
                  message: n.message,
                  index: M,
                  context: t.slice(M - 100, M + 100),
                  mode: n.mode,
                  resultSoFar: w,
                },
                _emitter: A,
              }
            if (s)
              return {
                language: e,
                value: V(t),
                illegal: !1,
                relevance: 0,
                errorRaised: n,
                _emitter: A,
                _top: k,
              }
            throw n
          }
        }
        function E(e, t) {
          t = t || d.languages || Object.keys(n)
          const a = (e => {
              const n = {
                value: V(e),
                illegal: !1,
                relevance: 0,
                _top: l,
                _emitter: new d.__emitter(d),
              }
              return n._emitter.addText(e), n
            })(e),
            i = t
              .filter(_)
              .filter(N)
              .map(n => y(n, e, !1))
          i.unshift(a)
          const r = i.sort((e, n) => {
              if (e.relevance !== n.relevance) return n.relevance - e.relevance
              if (e.language && n.language) {
                if (_(e.language).supersetOf === n.language) return 1
                if (_(n.language).supersetOf === e.language) return -1
              }
              return 0
            }),
            [s, o] = r,
            c = s
          return (c.secondBest = o), c
        }
        function v(e) {
          let n = null
          const t = (e => {
            let n = e.className + ' '
            n += e.parentNode ? e.parentNode.className : ''
            const t = d.languageDetectRe.exec(n)
            if (t) {
              const n = _(t[1])
              return (
                n ||
                  (F(o.replace('{}', t[1])),
                  F('Falling back to no-highlight mode for this block.', e)),
                n ? t[1] : 'no-highlight'
              )
            }
            return n.split(/\s+/).find(e => p(e) || _(e))
          })(e)
          if (p(t)) return
          if (
            (A('before:highlightElement', { el: e, language: t }),
            e.children.length > 0 &&
              (d.ignoreUnescapedHTML ||
                (console.warn(
                  'One of your code blocks includes unescaped HTML. This is a potentially serious security risk.'
                ),
                console.warn(
                  'https://github.com/highlightjs/highlight.js/wiki/security'
                ),
                console.warn('The element with unescaped HTML:'),
                console.warn(e)),
              d.throwUnescapedHTML))
          )
            throw new Q(
              'One of your code blocks includes unescaped HTML.',
              e.innerHTML
            )
          n = e
          const a = n.textContent,
            r = t ? f(a, { language: t, ignoreIllegals: !0 }) : E(a)
          ;(e.innerHTML = r.value),
            ((e, n, t) => {
              const a = (n && i[n]) || t
              e.classList.add('hljs'), e.classList.add('language-' + a)
            })(e, t, r.language),
            (e.result = {
              language: r.language,
              re: r.relevance,
              relevance: r.relevance,
            }),
            r.secondBest &&
              (e.secondBest = {
                language: r.secondBest.language,
                relevance: r.secondBest.relevance,
              }),
            A('after:highlightElement', { el: e, result: r, text: a })
        }
        let x = !1
        function w() {
          'loading' !== document.readyState
            ? document.querySelectorAll(d.cssSelector).forEach(v)
            : (x = !0)
        }
        function _(e) {
          return (e = (e || '').toLowerCase()), n[e] || n[i[e]]
        }
        function k(e, { languageName: n }) {
          'string' == typeof e && (e = [e]),
            e.forEach(e => {
              i[e.toLowerCase()] = n
            })
        }
        function N(e) {
          const n = _(e)
          return n && !n.disableAutodetect
        }
        function A(e, n) {
          const t = e
          r.forEach(e => {
            e[t] && e[t](n)
          })
        }
        'undefined' != typeof window &&
          window.addEventListener &&
          window.addEventListener(
            'DOMContentLoaded',
            () => {
              x && w()
            },
            !1
          ),
          Object.assign(e, {
            highlight: f,
            highlightAuto: E,
            highlightAll: w,
            highlightElement: v,
            highlightBlock: e => (
              G('10.7.0', 'highlightBlock will be removed entirely in v12.0'),
              G('10.7.0', 'Please use highlightElement now.'),
              v(e)
            ),
            configure: e => {
              d = Y(d, e)
            },
            initHighlighting: () => {
              w(),
                G(
                  '10.6.0',
                  'initHighlighting() deprecated.  Use highlightAll() now.'
                )
            },
            initHighlightingOnLoad: () => {
              w(),
                G(
                  '10.6.0',
                  'initHighlightingOnLoad() deprecated.  Use highlightAll() now.'
                )
            },
            registerLanguage: (t, a) => {
              let i = null
              try {
                i = a(e)
              } catch (e) {
                if (
                  (H(
                    "Language definition for '{}' could not be registered.".replace(
                      '{}',
                      t
                    )
                  ),
                  !s)
                )
                  throw e
                H(e), (i = l)
              }
              i.name || (i.name = t),
                (n[t] = i),
                (i.rawDefinition = a.bind(null, e)),
                i.aliases && k(i.aliases, { languageName: t })
            },
            unregisterLanguage: e => {
              delete n[e]
              for (const n of Object.keys(i)) i[n] === e && delete i[n]
            },
            listLanguages: () => Object.keys(n),
            getLanguage: _,
            registerAliases: k,
            autoDetection: N,
            inherit: Y,
            addPlugin: e => {
              ;(e => {
                e['before:highlightBlock'] &&
                  !e['before:highlightElement'] &&
                  (e['before:highlightElement'] = n => {
                    e['before:highlightBlock'](
                      Object.assign({ block: n.el }, n)
                    )
                  }),
                  e['after:highlightBlock'] &&
                    !e['after:highlightElement'] &&
                    (e['after:highlightElement'] = n => {
                      e['after:highlightBlock'](
                        Object.assign({ block: n.el }, n)
                      )
                    })
              })(e),
                r.push(e)
            },
          }),
          (e.debugMode = () => {
            s = !1
          }),
          (e.safeMode = () => {
            s = !0
          }),
          (e.versionString = '11.5.0'),
          (e.regex = {
            concat: h,
            lookahead: g,
            either: m,
            optional: b,
            anyNumberOfTimes: u,
          })
        for (const e in T) 'object' == typeof T[e] && t(T[e])
        return Object.assign(e, T), e
      })({})
      return ne
    })()
  ;(e.exports = a) /*! `css` grammar compiled for Highlight.js 11.5.0 */,
    (t = (() => {
      const e = [
          'a',
          'abbr',
          'address',
          'article',
          'aside',
          'audio',
          'b',
          'blockquote',
          'body',
          'button',
          'canvas',
          'caption',
          'cite',
          'code',
          'dd',
          'del',
          'details',
          'dfn',
          'div',
          'dl',
          'dt',
          'em',
          'fieldset',
          'figcaption',
          'figure',
          'footer',
          'form',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'header',
          'hgroup',
          'html',
          'i',
          'iframe',
          'img',
          'input',
          'ins',
          'kbd',
          'label',
          'legend',
          'li',
          'main',
          'mark',
          'menu',
          'nav',
          'object',
          'ol',
          'p',
          'q',
          'quote',
          'samp',
          'section',
          'span',
          'strong',
          'summary',
          'sup',
          'table',
          'tbody',
          'td',
          'textarea',
          'tfoot',
          'th',
          'thead',
          'time',
          'tr',
          'ul',
          'var',
          'video',
        ],
        n = [
          'any-hover',
          'any-pointer',
          'aspect-ratio',
          'color',
          'color-gamut',
          'color-index',
          'device-aspect-ratio',
          'device-height',
          'device-width',
          'display-mode',
          'forced-colors',
          'grid',
          'height',
          'hover',
          'inverted-colors',
          'monochrome',
          'orientation',
          'overflow-block',
          'overflow-inline',
          'pointer',
          'prefers-color-scheme',
          'prefers-contrast',
          'prefers-reduced-motion',
          'prefers-reduced-transparency',
          'resolution',
          'scan',
          'scripting',
          'update',
          'width',
          'min-width',
          'max-width',
          'min-height',
          'max-height',
        ],
        t = [
          'active',
          'any-link',
          'blank',
          'checked',
          'current',
          'default',
          'defined',
          'dir',
          'disabled',
          'drop',
          'empty',
          'enabled',
          'first',
          'first-child',
          'first-of-type',
          'fullscreen',
          'future',
          'focus',
          'focus-visible',
          'focus-within',
          'has',
          'host',
          'host-context',
          'hover',
          'indeterminate',
          'in-range',
          'invalid',
          'is',
          'lang',
          'last-child',
          'last-of-type',
          'left',
          'link',
          'local-link',
          'not',
          'nth-child',
          'nth-col',
          'nth-last-child',
          'nth-last-col',
          'nth-last-of-type',
          'nth-of-type',
          'only-child',
          'only-of-type',
          'optional',
          'out-of-range',
          'past',
          'placeholder-shown',
          'read-only',
          'read-write',
          'required',
          'right',
          'root',
          'scope',
          'target',
          'target-within',
          'user-invalid',
          'valid',
          'visited',
          'where',
        ],
        a = [
          'after',
          'backdrop',
          'before',
          'cue',
          'cue-region',
          'first-letter',
          'first-line',
          'grammar-error',
          'marker',
          'part',
          'placeholder',
          'selection',
          'slotted',
          'spelling-error',
        ],
        i = [
          'align-content',
          'align-items',
          'align-self',
          'all',
          'animation',
          'animation-delay',
          'animation-direction',
          'animation-duration',
          'animation-fill-mode',
          'animation-iteration-count',
          'animation-name',
          'animation-play-state',
          'animation-timing-function',
          'backface-visibility',
          'background',
          'background-attachment',
          'background-blend-mode',
          'background-clip',
          'background-color',
          'background-image',
          'background-origin',
          'background-position',
          'background-repeat',
          'background-size',
          'block-size',
          'border',
          'border-block',
          'border-block-color',
          'border-block-end',
          'border-block-end-color',
          'border-block-end-style',
          'border-block-end-width',
          'border-block-start',
          'border-block-start-color',
          'border-block-start-style',
          'border-block-start-width',
          'border-block-style',
          'border-block-width',
          'border-bottom',
          'border-bottom-color',
          'border-bottom-left-radius',
          'border-bottom-right-radius',
          'border-bottom-style',
          'border-bottom-width',
          'border-collapse',
          'border-color',
          'border-image',
          'border-image-outset',
          'border-image-repeat',
          'border-image-slice',
          'border-image-source',
          'border-image-width',
          'border-inline',
          'border-inline-color',
          'border-inline-end',
          'border-inline-end-color',
          'border-inline-end-style',
          'border-inline-end-width',
          'border-inline-start',
          'border-inline-start-color',
          'border-inline-start-style',
          'border-inline-start-width',
          'border-inline-style',
          'border-inline-width',
          'border-left',
          'border-left-color',
          'border-left-style',
          'border-left-width',
          'border-radius',
          'border-right',
          'border-right-color',
          'border-right-style',
          'border-right-width',
          'border-spacing',
          'border-style',
          'border-top',
          'border-top-color',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-top-style',
          'border-top-width',
          'border-width',
          'bottom',
          'box-decoration-break',
          'box-shadow',
          'box-sizing',
          'break-after',
          'break-before',
          'break-inside',
          'caption-side',
          'caret-color',
          'clear',
          'clip',
          'clip-path',
          'clip-rule',
          'color',
          'column-count',
          'column-fill',
          'column-gap',
          'column-rule',
          'column-rule-color',
          'column-rule-style',
          'column-rule-width',
          'column-span',
          'column-width',
          'columns',
          'contain',
          'content',
          'content-visibility',
          'counter-increment',
          'counter-reset',
          'cue',
          'cue-after',
          'cue-before',
          'cursor',
          'direction',
          'display',
          'empty-cells',
          'filter',
          'flex',
          'flex-basis',
          'flex-direction',
          'flex-flow',
          'flex-grow',
          'flex-shrink',
          'flex-wrap',
          'float',
          'flow',
          'font',
          'font-display',
          'font-family',
          'font-feature-settings',
          'font-kerning',
          'font-language-override',
          'font-size',
          'font-size-adjust',
          'font-smoothing',
          'font-stretch',
          'font-style',
          'font-synthesis',
          'font-variant',
          'font-variant-caps',
          'font-variant-east-asian',
          'font-variant-ligatures',
          'font-variant-numeric',
          'font-variant-position',
          'font-variation-settings',
          'font-weight',
          'gap',
          'glyph-orientation-vertical',
          'grid',
          'grid-area',
          'grid-auto-columns',
          'grid-auto-flow',
          'grid-auto-rows',
          'grid-column',
          'grid-column-end',
          'grid-column-start',
          'grid-gap',
          'grid-row',
          'grid-row-end',
          'grid-row-start',
          'grid-template',
          'grid-template-areas',
          'grid-template-columns',
          'grid-template-rows',
          'hanging-punctuation',
          'height',
          'hyphens',
          'icon',
          'image-orientation',
          'image-rendering',
          'image-resolution',
          'ime-mode',
          'inline-size',
          'isolation',
          'justify-content',
          'left',
          'letter-spacing',
          'line-break',
          'line-height',
          'list-style',
          'list-style-image',
          'list-style-position',
          'list-style-type',
          'margin',
          'margin-block',
          'margin-block-end',
          'margin-block-start',
          'margin-bottom',
          'margin-inline',
          'margin-inline-end',
          'margin-inline-start',
          'margin-left',
          'margin-right',
          'margin-top',
          'marks',
          'mask',
          'mask-border',
          'mask-border-mode',
          'mask-border-outset',
          'mask-border-repeat',
          'mask-border-slice',
          'mask-border-source',
          'mask-border-width',
          'mask-clip',
          'mask-composite',
          'mask-image',
          'mask-mode',
          'mask-origin',
          'mask-position',
          'mask-repeat',
          'mask-size',
          'mask-type',
          'max-block-size',
          'max-height',
          'max-inline-size',
          'max-width',
          'min-block-size',
          'min-height',
          'min-inline-size',
          'min-width',
          'mix-blend-mode',
          'nav-down',
          'nav-index',
          'nav-left',
          'nav-right',
          'nav-up',
          'none',
          'normal',
          'object-fit',
          'object-position',
          'opacity',
          'order',
          'orphans',
          'outline',
          'outline-color',
          'outline-offset',
          'outline-style',
          'outline-width',
          'overflow',
          'overflow-wrap',
          'overflow-x',
          'overflow-y',
          'padding',
          'padding-block',
          'padding-block-end',
          'padding-block-start',
          'padding-bottom',
          'padding-inline',
          'padding-inline-end',
          'padding-inline-start',
          'padding-left',
          'padding-right',
          'padding-top',
          'page-break-after',
          'page-break-before',
          'page-break-inside',
          'pause',
          'pause-after',
          'pause-before',
          'perspective',
          'perspective-origin',
          'pointer-events',
          'position',
          'quotes',
          'resize',
          'rest',
          'rest-after',
          'rest-before',
          'right',
          'row-gap',
          'scroll-margin',
          'scroll-margin-block',
          'scroll-margin-block-end',
          'scroll-margin-block-start',
          'scroll-margin-bottom',
          'scroll-margin-inline',
          'scroll-margin-inline-end',
          'scroll-margin-inline-start',
          'scroll-margin-left',
          'scroll-margin-right',
          'scroll-margin-top',
          'scroll-padding',
          'scroll-padding-block',
          'scroll-padding-block-end',
          'scroll-padding-block-start',
          'scroll-padding-bottom',
          'scroll-padding-inline',
          'scroll-padding-inline-end',
          'scroll-padding-inline-start',
          'scroll-padding-left',
          'scroll-padding-right',
          'scroll-padding-top',
          'scroll-snap-align',
          'scroll-snap-stop',
          'scroll-snap-type',
          'scrollbar-color',
          'scrollbar-gutter',
          'scrollbar-width',
          'shape-image-threshold',
          'shape-margin',
          'shape-outside',
          'speak',
          'speak-as',
          'src',
          'tab-size',
          'table-layout',
          'text-align',
          'text-align-all',
          'text-align-last',
          'text-combine-upright',
          'text-decoration',
          'text-decoration-color',
          'text-decoration-line',
          'text-decoration-style',
          'text-emphasis',
          'text-emphasis-color',
          'text-emphasis-position',
          'text-emphasis-style',
          'text-indent',
          'text-justify',
          'text-orientation',
          'text-overflow',
          'text-rendering',
          'text-shadow',
          'text-transform',
          'text-underline-position',
          'top',
          'transform',
          'transform-box',
          'transform-origin',
          'transform-style',
          'transition',
          'transition-delay',
          'transition-duration',
          'transition-property',
          'transition-timing-function',
          'unicode-bidi',
          'vertical-align',
          'visibility',
          'voice-balance',
          'voice-duration',
          'voice-family',
          'voice-pitch',
          'voice-range',
          'voice-rate',
          'voice-stress',
          'voice-volume',
          'white-space',
          'widows',
          'width',
          'will-change',
          'word-break',
          'word-spacing',
          'word-wrap',
          'writing-mode',
          'z-index',
        ].reverse()
      return r => {
        const s = r.regex,
          o = (e => ({
            IMPORTANT: { scope: 'meta', begin: '!important' },
            BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
            HEXCOLOR: {
              scope: 'number',
              begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/,
            },
            FUNCTION_DISPATCH: { className: 'built_in', begin: /[\w-]+(?=\()/ },
            ATTRIBUTE_SELECTOR_MODE: {
              scope: 'selector-attr',
              begin: /\[/,
              end: /\]/,
              illegal: '$',
              contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
            },
            CSS_NUMBER_MODE: {
              scope: 'number',
              begin:
                e.NUMBER_RE +
                '(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?',
              relevance: 0,
            },
            CSS_VARIABLE: {
              className: 'attr',
              begin: /--[A-Za-z][A-Za-z0-9_-]*/,
            },
          }))(r),
          l = [r.APOS_STRING_MODE, r.QUOTE_STRING_MODE]
        return {
          name: 'CSS',
          case_insensitive: !0,
          illegal: /[=|'\$]/,
          keywords: { keyframePosition: 'from to' },
          classNameAliases: { keyframePosition: 'selector-tag' },
          contains: [
            o.BLOCK_COMMENT,
            { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ },
            o.CSS_NUMBER_MODE,
            {
              className: 'selector-id',
              begin: /#[A-Za-z0-9_-]+/,
              relevance: 0,
            },
            {
              className: 'selector-class',
              begin: '\\.[a-zA-Z-][a-zA-Z0-9_-]*',
              relevance: 0,
            },
            o.ATTRIBUTE_SELECTOR_MODE,
            {
              className: 'selector-pseudo',
              variants: [
                { begin: ':(' + t.join('|') + ')' },
                { begin: ':(:)?(' + a.join('|') + ')' },
              ],
            },
            o.CSS_VARIABLE,
            { className: 'attribute', begin: '\\b(' + i.join('|') + ')\\b' },
            {
              begin: /:/,
              end: /[;}{]/,
              contains: [
                o.BLOCK_COMMENT,
                o.HEXCOLOR,
                o.IMPORTANT,
                o.CSS_NUMBER_MODE,
                ...l,
                {
                  begin: /(url|data-uri)\(/,
                  end: /\)/,
                  relevance: 0,
                  keywords: { built_in: 'url data-uri' },
                  contains: [
                    {
                      className: 'string',
                      begin: /[^)]/,
                      endsWithParent: !0,
                      excludeEnd: !0,
                    },
                  ],
                },
                o.FUNCTION_DISPATCH,
              ],
            },
            {
              begin: s.lookahead(/@/),
              end: '[{;]',
              relevance: 0,
              illegal: /:/,
              contains: [
                { className: 'keyword', begin: /@-?\w[\w]*(-\w+)*/ },
                {
                  begin: /\s/,
                  endsWithParent: !0,
                  excludeEnd: !0,
                  relevance: 0,
                  keywords: {
                    $pattern: /[a-z-]+/,
                    keyword: 'and or not only',
                    attribute: n.join(' '),
                  },
                  contains: [
                    { begin: /[a-z-]+(?=:)/, className: 'attribute' },
                    ...l,
                    o.CSS_NUMBER_MODE,
                  ],
                },
              ],
            },
            { className: 'selector-tag', begin: '\\b(' + e.join('|') + ')\\b' },
          ],
        }
      }
    })()),
    a.registerLanguage(
      'css',
      t
    ) /*! `javascript` grammar compiled for Highlight.js 11.5.0 */,
    (() => {
      var e = (() => {
        const e = '[A-Za-z$_][0-9A-Za-z$_]*',
          n = [
            'as',
            'in',
            'of',
            'if',
            'for',
            'while',
            'finally',
            'var',
            'new',
            'function',
            'do',
            'return',
            'void',
            'else',
            'break',
            'catch',
            'instanceof',
            'with',
            'throw',
            'case',
            'default',
            'try',
            'switch',
            'continue',
            'typeof',
            'delete',
            'let',
            'yield',
            'const',
            'class',
            'debugger',
            'async',
            'await',
            'static',
            'import',
            'from',
            'export',
            'extends',
          ],
          t = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'],
          a = [
            'Object',
            'Function',
            'Boolean',
            'Symbol',
            'Math',
            'Date',
            'Number',
            'BigInt',
            'String',
            'RegExp',
            'Array',
            'Float32Array',
            'Float64Array',
            'Int8Array',
            'Uint8Array',
            'Uint8ClampedArray',
            'Int16Array',
            'Int32Array',
            'Uint16Array',
            'Uint32Array',
            'BigInt64Array',
            'BigUint64Array',
            'Set',
            'Map',
            'WeakSet',
            'WeakMap',
            'ArrayBuffer',
            'SharedArrayBuffer',
            'Atomics',
            'DataView',
            'JSON',
            'Promise',
            'Generator',
            'GeneratorFunction',
            'AsyncFunction',
            'Reflect',
            'Proxy',
            'Intl',
            'WebAssembly',
          ],
          i = [
            'Error',
            'EvalError',
            'InternalError',
            'RangeError',
            'ReferenceError',
            'SyntaxError',
            'TypeError',
            'URIError',
          ],
          r = [
            'setInterval',
            'setTimeout',
            'clearInterval',
            'clearTimeout',
            'require',
            'exports',
            'eval',
            'isFinite',
            'isNaN',
            'parseFloat',
            'parseInt',
            'decodeURI',
            'decodeURIComponent',
            'encodeURI',
            'encodeURIComponent',
            'escape',
            'unescape',
          ],
          s = [
            'arguments',
            'this',
            'super',
            'console',
            'window',
            'document',
            'localStorage',
            'module',
            'global',
          ],
          o = [].concat(r, a, i)
        return l => {
          const c = l.regex,
            d = e,
            g = {
              begin: /<[A-Za-z0-9\\._:-]+/,
              end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
              isTrulyOpeningTag: (e, n) => {
                const t = e[0].length + e.index,
                  a = e.input[t]
                if ('<' === a || ',' === a) return void n.ignoreMatch()
                let i
                '>' === a &&
                  (((e, { after: n }) => {
                    const t = '</' + e[0].slice(1)
                    return -1 !== e.input.indexOf(t, n)
                  })(e, { after: t }) ||
                    n.ignoreMatch()),
                  (i = e.input.substr(t).match(/^\s+extends\s+/)) &&
                    0 === i.index &&
                    n.ignoreMatch()
              },
            },
            u = {
              $pattern: e,
              keyword: n,
              literal: t,
              built_in: o,
              'variable.language': s,
            },
            b = '\\.([0-9](_?[0-9])*)',
            h = '0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*',
            m = {
              className: 'number',
              variants: [
                {
                  begin: `(\\b(${h})((${b})|\\.)?|(${b}))[eE][+-]?([0-9](_?[0-9])*)\\b`,
                },
                { begin: `\\b(${h})\\b((${b})\\b|\\.)?|(${b})\\b` },
                { begin: '\\b(0|[1-9](_?[0-9])*)n\\b' },
                { begin: '\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b' },
                { begin: '\\b0[bB][0-1](_?[0-1])*n?\\b' },
                { begin: '\\b0[oO][0-7](_?[0-7])*n?\\b' },
                { begin: '\\b0[0-7]+n?\\b' },
              ],
              relevance: 0,
            },
            p = {
              className: 'subst',
              begin: '\\$\\{',
              end: '\\}',
              keywords: u,
              contains: [],
            },
            f = {
              begin: 'html`',
              end: '',
              starts: {
                end: '`',
                returnEnd: !1,
                contains: [l.BACKSLASH_ESCAPE, p],
                subLanguage: 'xml',
              },
            },
            y = {
              begin: 'css`',
              end: '',
              starts: {
                end: '`',
                returnEnd: !1,
                contains: [l.BACKSLASH_ESCAPE, p],
                subLanguage: 'css',
              },
            },
            E = {
              className: 'string',
              begin: '`',
              end: '`',
              contains: [l.BACKSLASH_ESCAPE, p],
            },
            v = {
              className: 'comment',
              variants: [
                l.COMMENT(/\/\*\*(?!\/)/, '\\*/', {
                  relevance: 0,
                  contains: [
                    {
                      begin: '(?=@[A-Za-z]+)',
                      relevance: 0,
                      contains: [
                        { className: 'doctag', begin: '@[A-Za-z]+' },
                        {
                          className: 'type',
                          begin: '\\{',
                          end: '\\}',
                          excludeEnd: !0,
                          excludeBegin: !0,
                          relevance: 0,
                        },
                        {
                          className: 'variable',
                          begin: d + '(?=\\s*(-)|$)',
                          endsParent: !0,
                          relevance: 0,
                        },
                        { begin: /(?=[^\n])\s/, relevance: 0 },
                      ],
                    },
                  ],
                }),
                l.C_BLOCK_COMMENT_MODE,
                l.C_LINE_COMMENT_MODE,
              ],
            },
            x = [l.APOS_STRING_MODE, l.QUOTE_STRING_MODE, f, y, E, m]
          p.contains = x.concat({
            begin: /\{/,
            end: /\}/,
            keywords: u,
            contains: ['self'].concat(x),
          })
          const w = [].concat(v, p.contains),
            _ = w.concat([
              {
                begin: /\(/,
                end: /\)/,
                keywords: u,
                contains: ['self'].concat(w),
              },
            ]),
            k = {
              className: 'params',
              begin: /\(/,
              end: /\)/,
              excludeBegin: !0,
              excludeEnd: !0,
              keywords: u,
              contains: _,
            },
            N = {
              variants: [
                {
                  match: [
                    /class/,
                    /\s+/,
                    d,
                    /\s+/,
                    /extends/,
                    /\s+/,
                    c.concat(d, '(', c.concat(/\./, d), ')*'),
                  ],
                  scope: {
                    1: 'keyword',
                    3: 'title.class',
                    5: 'keyword',
                    7: 'title.class.inherited',
                  },
                },
                {
                  match: [/class/, /\s+/, d],
                  scope: { 1: 'keyword', 3: 'title.class' },
                },
              ],
            },
            A = {
              relevance: 0,
              match: c.either(
                /\bJSON/,
                /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
                /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
                /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
              ),
              className: 'title.class',
              keywords: { _: [...a, ...i] },
            },
            S = {
              variants: [
                { match: [/function/, /\s+/, d, /(?=\s*\()/] },
                { match: [/function/, /\s*(?=\()/] },
              ],
              className: { 1: 'keyword', 3: 'title.function' },
              label: 'func.def',
              contains: [k],
              illegal: /%/,
            },
            O = {
              match: c.concat(
                /\b/,
                ((M = [...r, 'super']), c.concat('(?!', M.join('|'), ')')),
                d,
                c.lookahead(/\(/)
              ),
              className: 'title.function',
              relevance: 0,
            }
          var M
          const R = {
              begin: c.concat(
                /\./,
                c.lookahead(c.concat(d, /(?![0-9A-Za-z$_(])/))
              ),
              end: d,
              excludeBegin: !0,
              keywords: 'prototype',
              className: 'property',
              relevance: 0,
            },
            T = {
              match: [/get|set/, /\s+/, d, /(?=\()/],
              className: { 1: 'keyword', 3: 'title.function' },
              contains: [{ begin: /\(\)/ }, k],
            },
            I =
              '(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|' +
              l.UNDERSCORE_IDENT_RE +
              ')\\s*=>',
            C = {
              match: [
                /const|var|let/,
                /\s+/,
                d,
                /\s*/,
                /=\s*/,
                /(async\s*)?/,
                c.lookahead(I),
              ],
              keywords: 'async',
              className: { 1: 'keyword', 3: 'title.function' },
              contains: [k],
            }
          return {
            name: 'Javascript',
            aliases: ['js', 'jsx', 'mjs', 'cjs'],
            keywords: u,
            exports: { PARAMS_CONTAINS: _, CLASS_REFERENCE: A },
            illegal: /#(?![$_A-z])/,
            contains: [
              l.SHEBANG({ label: 'shebang', binary: 'node', relevance: 5 }),
              {
                label: 'use_strict',
                className: 'meta',
                relevance: 10,
                begin: /^\s*['"]use (strict|asm)['"]/,
              },
              l.APOS_STRING_MODE,
              l.QUOTE_STRING_MODE,
              f,
              y,
              E,
              v,
              m,
              A,
              { className: 'attr', begin: d + c.lookahead(':'), relevance: 0 },
              C,
              {
                begin:
                  '(' + l.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
                keywords: 'return throw case',
                relevance: 0,
                contains: [
                  v,
                  l.REGEXP_MODE,
                  {
                    className: 'function',
                    begin: I,
                    returnBegin: !0,
                    end: '\\s*=>',
                    contains: [
                      {
                        className: 'params',
                        variants: [
                          { begin: l.UNDERSCORE_IDENT_RE, relevance: 0 },
                          { className: null, begin: /\(\s*\)/, skip: !0 },
                          {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: u,
                            contains: _,
                          },
                        ],
                      },
                    ],
                  },
                  { begin: /,/, relevance: 0 },
                  { match: /\s+/, relevance: 0 },
                  {
                    variants: [
                      { begin: '<>', end: '</>' },
                      { match: /<[A-Za-z0-9\\._:-]+\s*\/>/ },
                      {
                        begin: g.begin,
                        'on:begin': g.isTrulyOpeningTag,
                        end: g.end,
                      },
                    ],
                    subLanguage: 'xml',
                    contains: [
                      {
                        begin: g.begin,
                        end: g.end,
                        skip: !0,
                        contains: ['self'],
                      },
                    ],
                  },
                ],
              },
              S,
              { beginKeywords: 'while if switch catch for' },
              {
                begin:
                  '\\b(?!function)' +
                  l.UNDERSCORE_IDENT_RE +
                  '\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{',
                returnBegin: !0,
                label: 'func.def',
                contains: [
                  k,
                  l.inherit(l.TITLE_MODE, {
                    begin: d,
                    className: 'title.function',
                  }),
                ],
              },
              { match: /\.\.\./, relevance: 0 },
              R,
              { match: '\\$' + d, relevance: 0 },
              {
                match: [/\bconstructor(?=\s*\()/],
                className: { 1: 'title.function' },
                contains: [k],
              },
              O,
              {
                relevance: 0,
                match: /\b[A-Z][A-Z_0-9]+\b/,
                className: 'variable.constant',
              },
              N,
              T,
              { match: /\$[(.]/ },
            ],
          }
        }
      })()
      a.registerLanguage('javascript', e)
    })() /*! `xml` grammar compiled for Highlight.js 11.5.0 */,
    (() => {
      var e = e => {
        const n = e.regex,
          t = n.concat(/[A-Z_]/, n.optional(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
          a = {
            className: 'symbol',
            begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/,
          },
          i = {
            begin: /\s/,
            contains: [
              {
                className: 'keyword',
                begin: /#?[a-z_][a-z1-9_-]+/,
                illegal: /\n/,
              },
            ],
          },
          r = e.inherit(i, { begin: /\(/, end: /\)/ }),
          s = e.inherit(e.APOS_STRING_MODE, { className: 'string' }),
          o = e.inherit(e.QUOTE_STRING_MODE, { className: 'string' }),
          l = {
            endsWithParent: !0,
            illegal: /</,
            relevance: 0,
            contains: [
              { className: 'attr', begin: /[A-Za-z0-9._:-]+/, relevance: 0 },
              {
                begin: /=\s*/,
                relevance: 0,
                contains: [
                  {
                    className: 'string',
                    endsParent: !0,
                    variants: [
                      { begin: /"/, end: /"/, contains: [a] },
                      { begin: /'/, end: /'/, contains: [a] },
                      { begin: /[^\s"'=<>`]+/ },
                    ],
                  },
                ],
              },
            ],
          }
        return {
          name: 'HTML, XML',
          aliases: [
            'html',
            'xhtml',
            'rss',
            'atom',
            'xjb',
            'xsd',
            'xsl',
            'plist',
            'wsf',
            'svg',
          ],
          case_insensitive: !0,
          contains: [
            {
              className: 'meta',
              begin: /<![a-z]/,
              end: />/,
              relevance: 10,
              contains: [
                i,
                o,
                s,
                r,
                {
                  begin: /\[/,
                  end: /\]/,
                  contains: [
                    {
                      className: 'meta',
                      begin: /<![a-z]/,
                      end: />/,
                      contains: [i, r, o, s],
                    },
                  ],
                },
              ],
            },
            e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
            { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 },
            a,
            {
              className: 'meta',
              end: /\?>/,
              variants: [
                { begin: /<\?xml/, relevance: 10, contains: [o] },
                { begin: /<\?[a-z][a-z0-9]+/ },
              ],
            },
            {
              className: 'tag',
              begin: /<style(?=\s|>)/,
              end: />/,
              keywords: { name: 'style' },
              contains: [l],
              starts: {
                end: /<\/style>/,
                returnEnd: !0,
                subLanguage: ['css', 'xml'],
              },
            },
            {
              className: 'tag',
              begin: /<script(?=\s|>)/,
              end: />/,
              keywords: { name: 'script' },
              contains: [l],
              starts: {
                end: /<\/script>/,
                returnEnd: !0,
                subLanguage: ['javascript', 'handlebars', 'xml'],
              },
            },
            { className: 'tag', begin: /<>|<\/>/ },
            {
              className: 'tag',
              begin: n.concat(
                /</,
                n.lookahead(n.concat(t, n.either(/\/>/, />/, /\s/)))
              ),
              end: /\/?>/,
              contains: [
                { className: 'name', begin: t, relevance: 0, starts: l },
              ],
            },
            {
              className: 'tag',
              begin: n.concat(/<\//, n.lookahead(n.concat(t, />/))),
              contains: [
                { className: 'name', begin: t, relevance: 0 },
                { begin: />/, relevance: 0, endsParent: !0 },
              ],
            },
          ],
        }
      }
      a.registerLanguage('xml', e)
    })() /*! `typescript` grammar compiled for Highlight.js 11.5.0 */,
    (() => {
      var e = (() => {
        const e = '[A-Za-z$_][0-9A-Za-z$_]*',
          n = [
            'as',
            'in',
            'of',
            'if',
            'for',
            'while',
            'finally',
            'var',
            'new',
            'function',
            'do',
            'return',
            'void',
            'else',
            'break',
            'catch',
            'instanceof',
            'with',
            'throw',
            'case',
            'default',
            'try',
            'switch',
            'continue',
            'typeof',
            'delete',
            'let',
            'yield',
            'const',
            'class',
            'debugger',
            'async',
            'await',
            'static',
            'import',
            'from',
            'export',
            'extends',
          ],
          t = ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'],
          a = [
            'Object',
            'Function',
            'Boolean',
            'Symbol',
            'Math',
            'Date',
            'Number',
            'BigInt',
            'String',
            'RegExp',
            'Array',
            'Float32Array',
            'Float64Array',
            'Int8Array',
            'Uint8Array',
            'Uint8ClampedArray',
            'Int16Array',
            'Int32Array',
            'Uint16Array',
            'Uint32Array',
            'BigInt64Array',
            'BigUint64Array',
            'Set',
            'Map',
            'WeakSet',
            'WeakMap',
            'ArrayBuffer',
            'SharedArrayBuffer',
            'Atomics',
            'DataView',
            'JSON',
            'Promise',
            'Generator',
            'GeneratorFunction',
            'AsyncFunction',
            'Reflect',
            'Proxy',
            'Intl',
            'WebAssembly',
          ],
          i = [
            'Error',
            'EvalError',
            'InternalError',
            'RangeError',
            'ReferenceError',
            'SyntaxError',
            'TypeError',
            'URIError',
          ],
          r = [
            'setInterval',
            'setTimeout',
            'clearInterval',
            'clearTimeout',
            'require',
            'exports',
            'eval',
            'isFinite',
            'isNaN',
            'parseFloat',
            'parseInt',
            'decodeURI',
            'decodeURIComponent',
            'encodeURI',
            'encodeURIComponent',
            'escape',
            'unescape',
          ],
          s = [
            'arguments',
            'this',
            'super',
            'console',
            'window',
            'document',
            'localStorage',
            'module',
            'global',
          ],
          o = [].concat(r, a, i)
        function l(l) {
          const c = l.regex,
            d = e,
            g = {
              begin: /<[A-Za-z0-9\\._:-]+/,
              end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
              isTrulyOpeningTag: (e, n) => {
                const t = e[0].length + e.index,
                  a = e.input[t]
                if ('<' === a || ',' === a) return void n.ignoreMatch()
                let i
                '>' === a &&
                  (((e, { after: n }) => {
                    const t = '</' + e[0].slice(1)
                    return -1 !== e.input.indexOf(t, n)
                  })(e, { after: t }) ||
                    n.ignoreMatch()),
                  (i = e.input.substr(t).match(/^\s+extends\s+/)) &&
                    0 === i.index &&
                    n.ignoreMatch()
              },
            },
            u = {
              $pattern: e,
              keyword: n,
              literal: t,
              built_in: o,
              'variable.language': s,
            },
            b = '\\.([0-9](_?[0-9])*)',
            h = '0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*',
            m = {
              className: 'number',
              variants: [
                {
                  begin: `(\\b(${h})((${b})|\\.)?|(${b}))[eE][+-]?([0-9](_?[0-9])*)\\b`,
                },
                { begin: `\\b(${h})\\b((${b})\\b|\\.)?|(${b})\\b` },
                { begin: '\\b(0|[1-9](_?[0-9])*)n\\b' },
                { begin: '\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b' },
                { begin: '\\b0[bB][0-1](_?[0-1])*n?\\b' },
                { begin: '\\b0[oO][0-7](_?[0-7])*n?\\b' },
                { begin: '\\b0[0-7]+n?\\b' },
              ],
              relevance: 0,
            },
            p = {
              className: 'subst',
              begin: '\\$\\{',
              end: '\\}',
              keywords: u,
              contains: [],
            },
            f = {
              begin: 'html`',
              end: '',
              starts: {
                end: '`',
                returnEnd: !1,
                contains: [l.BACKSLASH_ESCAPE, p],
                subLanguage: 'xml',
              },
            },
            y = {
              begin: 'css`',
              end: '',
              starts: {
                end: '`',
                returnEnd: !1,
                contains: [l.BACKSLASH_ESCAPE, p],
                subLanguage: 'css',
              },
            },
            E = {
              className: 'string',
              begin: '`',
              end: '`',
              contains: [l.BACKSLASH_ESCAPE, p],
            },
            v = {
              className: 'comment',
              variants: [
                l.COMMENT(/\/\*\*(?!\/)/, '\\*/', {
                  relevance: 0,
                  contains: [
                    {
                      begin: '(?=@[A-Za-z]+)',
                      relevance: 0,
                      contains: [
                        { className: 'doctag', begin: '@[A-Za-z]+' },
                        {
                          className: 'type',
                          begin: '\\{',
                          end: '\\}',
                          excludeEnd: !0,
                          excludeBegin: !0,
                          relevance: 0,
                        },
                        {
                          className: 'variable',
                          begin: d + '(?=\\s*(-)|$)',
                          endsParent: !0,
                          relevance: 0,
                        },
                        { begin: /(?=[^\n])\s/, relevance: 0 },
                      ],
                    },
                  ],
                }),
                l.C_BLOCK_COMMENT_MODE,
                l.C_LINE_COMMENT_MODE,
              ],
            },
            x = [l.APOS_STRING_MODE, l.QUOTE_STRING_MODE, f, y, E, m]
          p.contains = x.concat({
            begin: /\{/,
            end: /\}/,
            keywords: u,
            contains: ['self'].concat(x),
          })
          const w = [].concat(v, p.contains),
            _ = w.concat([
              {
                begin: /\(/,
                end: /\)/,
                keywords: u,
                contains: ['self'].concat(w),
              },
            ]),
            k = {
              className: 'params',
              begin: /\(/,
              end: /\)/,
              excludeBegin: !0,
              excludeEnd: !0,
              keywords: u,
              contains: _,
            },
            N = {
              variants: [
                {
                  match: [
                    /class/,
                    /\s+/,
                    d,
                    /\s+/,
                    /extends/,
                    /\s+/,
                    c.concat(d, '(', c.concat(/\./, d), ')*'),
                  ],
                  scope: {
                    1: 'keyword',
                    3: 'title.class',
                    5: 'keyword',
                    7: 'title.class.inherited',
                  },
                },
                {
                  match: [/class/, /\s+/, d],
                  scope: { 1: 'keyword', 3: 'title.class' },
                },
              ],
            },
            A = {
              relevance: 0,
              match: c.either(
                /\bJSON/,
                /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
                /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
                /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
              ),
              className: 'title.class',
              keywords: { _: [...a, ...i] },
            },
            S = {
              variants: [
                { match: [/function/, /\s+/, d, /(?=\s*\()/] },
                { match: [/function/, /\s*(?=\()/] },
              ],
              className: { 1: 'keyword', 3: 'title.function' },
              label: 'func.def',
              contains: [k],
              illegal: /%/,
            },
            O = {
              match: c.concat(
                /\b/,
                ((M = [...r, 'super']), c.concat('(?!', M.join('|'), ')')),
                d,
                c.lookahead(/\(/)
              ),
              className: 'title.function',
              relevance: 0,
            }
          var M
          const R = {
              begin: c.concat(
                /\./,
                c.lookahead(c.concat(d, /(?![0-9A-Za-z$_(])/))
              ),
              end: d,
              excludeBegin: !0,
              keywords: 'prototype',
              className: 'property',
              relevance: 0,
            },
            T = {
              match: [/get|set/, /\s+/, d, /(?=\()/],
              className: { 1: 'keyword', 3: 'title.function' },
              contains: [{ begin: /\(\)/ }, k],
            },
            I =
              '(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|' +
              l.UNDERSCORE_IDENT_RE +
              ')\\s*=>',
            C = {
              match: [
                /const|var|let/,
                /\s+/,
                d,
                /\s*/,
                /=\s*/,
                /(async\s*)?/,
                c.lookahead(I),
              ],
              keywords: 'async',
              className: { 1: 'keyword', 3: 'title.function' },
              contains: [k],
            }
          return {
            name: 'Javascript',
            aliases: ['js', 'jsx', 'mjs', 'cjs'],
            keywords: u,
            exports: { PARAMS_CONTAINS: _, CLASS_REFERENCE: A },
            illegal: /#(?![$_A-z])/,
            contains: [
              l.SHEBANG({ label: 'shebang', binary: 'node', relevance: 5 }),
              {
                label: 'use_strict',
                className: 'meta',
                relevance: 10,
                begin: /^\s*['"]use (strict|asm)['"]/,
              },
              l.APOS_STRING_MODE,
              l.QUOTE_STRING_MODE,
              f,
              y,
              E,
              v,
              m,
              A,
              { className: 'attr', begin: d + c.lookahead(':'), relevance: 0 },
              C,
              {
                begin:
                  '(' + l.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
                keywords: 'return throw case',
                relevance: 0,
                contains: [
                  v,
                  l.REGEXP_MODE,
                  {
                    className: 'function',
                    begin: I,
                    returnBegin: !0,
                    end: '\\s*=>',
                    contains: [
                      {
                        className: 'params',
                        variants: [
                          { begin: l.UNDERSCORE_IDENT_RE, relevance: 0 },
                          { className: null, begin: /\(\s*\)/, skip: !0 },
                          {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: u,
                            contains: _,
                          },
                        ],
                      },
                    ],
                  },
                  { begin: /,/, relevance: 0 },
                  { match: /\s+/, relevance: 0 },
                  {
                    variants: [
                      { begin: '<>', end: '</>' },
                      { match: /<[A-Za-z0-9\\._:-]+\s*\/>/ },
                      {
                        begin: g.begin,
                        'on:begin': g.isTrulyOpeningTag,
                        end: g.end,
                      },
                    ],
                    subLanguage: 'xml',
                    contains: [
                      {
                        begin: g.begin,
                        end: g.end,
                        skip: !0,
                        contains: ['self'],
                      },
                    ],
                  },
                ],
              },
              S,
              { beginKeywords: 'while if switch catch for' },
              {
                begin:
                  '\\b(?!function)' +
                  l.UNDERSCORE_IDENT_RE +
                  '\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{',
                returnBegin: !0,
                label: 'func.def',
                contains: [
                  k,
                  l.inherit(l.TITLE_MODE, {
                    begin: d,
                    className: 'title.function',
                  }),
                ],
              },
              { match: /\.\.\./, relevance: 0 },
              R,
              { match: '\\$' + d, relevance: 0 },
              {
                match: [/\bconstructor(?=\s*\()/],
                className: { 1: 'title.function' },
                contains: [k],
              },
              O,
              {
                relevance: 0,
                match: /\b[A-Z][A-Z_0-9]+\b/,
                className: 'variable.constant',
              },
              N,
              T,
              { match: /\$[(.]/ },
            ],
          }
        }
        return a => {
          const i = l(a),
            r = [
              'any',
              'void',
              'number',
              'boolean',
              'string',
              'object',
              'never',
              'symbol',
              'bigint',
              'unknown',
            ],
            c = {
              beginKeywords: 'namespace',
              end: /\{/,
              excludeEnd: !0,
              contains: [i.exports.CLASS_REFERENCE],
            },
            d = {
              beginKeywords: 'interface',
              end: /\{/,
              excludeEnd: !0,
              keywords: { keyword: 'interface extends', built_in: r },
              contains: [i.exports.CLASS_REFERENCE],
            },
            g = {
              $pattern: e,
              keyword: n.concat([
                'type',
                'namespace',
                'interface',
                'public',
                'private',
                'protected',
                'implements',
                'declare',
                'abstract',
                'readonly',
                'enum',
                'override',
              ]),
              literal: t,
              built_in: o.concat(r),
              'variable.language': s,
            },
            u = { className: 'meta', begin: '@[A-Za-z$_][0-9A-Za-z$_]*' },
            b = (e, n, t) => {
              const a = e.contains.findIndex(e => e.label === n)
              if (-1 === a) throw Error('can not find mode to replace')
              e.contains.splice(a, 1, t)
            }
          return (
            Object.assign(i.keywords, g),
            i.exports.PARAMS_CONTAINS.push(u),
            (i.contains = i.contains.concat([u, c, d])),
            b(i, 'shebang', a.SHEBANG()),
            b(i, 'use_strict', {
              className: 'meta',
              relevance: 10,
              begin: /^\s*['"]use strict['"]/,
            }),
            (i.contains.find(e => 'func.def' === e.label).relevance = 0),
            Object.assign(i, { name: 'TypeScript', aliases: ['ts', 'tsx'] }),
            i
          )
        }
      })()
      a.registerLanguage('typescript', e)
    })() /*! `markdown` grammar compiled for Highlight.js 11.5.0 */,
    (() => {
      var e = e => {
        const n = {
            begin: /<\/?[A-Za-z_]/,
            end: '>',
            subLanguage: 'xml',
            relevance: 0,
          },
          t = {
            variants: [
              { begin: /\[.+?\]\[.*?\]/, relevance: 0 },
              {
                begin:
                  /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
                relevance: 2,
              },
              {
                begin: e.regex.concat(
                  /\[.+?\]\(/,
                  /[A-Za-z][A-Za-z0-9+.-]*/,
                  /:\/\/.*?\)/
                ),
                relevance: 2,
              },
              { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 },
              { begin: /\[.*?\]\(.*?\)/, relevance: 0 },
            ],
            returnBegin: !0,
            contains: [
              { match: /\[(?=\])/ },
              {
                className: 'string',
                relevance: 0,
                begin: '\\[',
                end: '\\]',
                excludeBegin: !0,
                returnEnd: !0,
              },
              {
                className: 'link',
                relevance: 0,
                begin: '\\]\\(',
                end: '\\)',
                excludeBegin: !0,
                excludeEnd: !0,
              },
              {
                className: 'symbol',
                relevance: 0,
                begin: '\\]\\[',
                end: '\\]',
                excludeBegin: !0,
                excludeEnd: !0,
              },
            ],
          },
          a = {
            className: 'strong',
            contains: [],
            variants: [
              { begin: /_{2}/, end: /_{2}/ },
              { begin: /\*{2}/, end: /\*{2}/ },
            ],
          },
          i = {
            className: 'emphasis',
            contains: [],
            variants: [
              { begin: /\*(?!\*)/, end: /\*/ },
              { begin: /_(?!_)/, end: /_/, relevance: 0 },
            ],
          },
          r = e.inherit(a, { contains: [] }),
          s = e.inherit(i, { contains: [] })
        a.contains.push(s), i.contains.push(r)
        let o = [n, t]
        return (
          [a, i, r, s].forEach(e => {
            e.contains = e.contains.concat(o)
          }),
          (o = o.concat(a, i)),
          {
            name: 'Markdown',
            aliases: ['md', 'mkdown', 'mkd'],
            contains: [
              {
                className: 'section',
                variants: [
                  { begin: '^#{1,6}', end: '$', contains: o },
                  {
                    begin: '(?=^.+?\\n[=-]{2,}$)',
                    contains: [
                      { begin: '^[=-]*$' },
                      { begin: '^', end: '\\n', contains: o },
                    ],
                  },
                ],
              },
              n,
              {
                className: 'bullet',
                begin: '^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)',
                end: '\\s+',
                excludeEnd: !0,
              },
              a,
              i,
              { className: 'quote', begin: '^>\\s+', contains: o, end: '$' },
              {
                className: 'code',
                variants: [
                  { begin: '(`{3,})[^`](.|\\n)*?\\1`*[ ]*' },
                  { begin: '(~{3,})[^~](.|\\n)*?\\1~*[ ]*' },
                  { begin: '```', end: '```+[ ]*$' },
                  { begin: '~~~', end: '~~~+[ ]*$' },
                  { begin: '`.+?`' },
                  {
                    begin: '(?=^( {4}|\\t))',
                    contains: [{ begin: '^( {4}|\\t)', end: '(\\n)$' }],
                    relevance: 0,
                  },
                ],
              },
              { begin: '^[-\\*]{3,}', end: '$' },
              t,
              {
                begin: /^\[[^\n]+\]:/,
                returnBegin: !0,
                contains: [
                  {
                    className: 'symbol',
                    begin: /\[/,
                    end: /\]/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                  },
                  {
                    className: 'link',
                    begin: /:\s*/,
                    end: /$/,
                    excludeBegin: !0,
                  },
                ],
              },
            ],
          }
        )
      }
      a.registerLanguage('markdown', e)
    })() /*! `json` grammar compiled for Highlight.js 11.5.0 */,
    (() => {
      var e = e => ({
        name: 'JSON',
        contains: [
          {
            className: 'attr',
            begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
            relevance: 1.01,
          },
          { match: /[{}[\],:]/, className: 'punctuation', relevance: 0 },
          e.QUOTE_STRING_MODE,
          { beginKeywords: 'true false null' },
          e.C_NUMBER_MODE,
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
        ],
        illegal: '\\S',
      })
      a.registerLanguage('json', e)
    })()
})(e)
var n = e.exports
/*! (c) Andrea Giammarchi - ISC */ const t = 'highlighted-code',
  a = new WeakMap(),
  i = new Set(),
  r = { timeout: 300, box: 'border-box' },
  s = 'function' != typeof cancelIdleCallback,
  o = s ? setTimeout : requestIdleCallback,
  l = s ? clearTimeout : cancelIdleCallback,
  c = 'object' == typeof netscape
let d, g
class u extends HTMLTextAreaElement {
  static get library() {
    return n
  }
  static get observedAttributes() {
    return ['auto-height', 'disabled', 'language', 'tab-size']
  }
  static insertText(e) {
    const { activeElement: n } = document
    try {
      if (
        !(e
          ? document.execCommand('insertText', !1, e)
          : document.execCommand('delete'))
      )
        throw event
    } catch (t) {
      const { selectionStart: a } = n
      n.setRangeText(e), (n.selectionStart = n.selectionEnd = a + e.length)
    }
    n.oninput()
  }
  static useTheme(e) {
    d ||
      ((d = document.head.appendChild(document.createElement('link'))),
      (d.rel = 'stylesheet'),
      d.addEventListener('load', () => {
        for (const e of document.querySelectorAll(`textarea[is="${t}"]`))
          m.call(e)
      })),
      (d.href = e.includes('.')
        ? e
        : `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/${e}.min.css`)
  }
  constructor() {
    super(), (this.idle = 0)
    const e = this.ownerDocument.createElement('pre')
    ;(e.className = t),
      (e.innerHTML = '<code></code>'),
      a.set(this, e),
      // hack: removed "      font-family: monospace;\n"
      (this.style.cssText +=
        '\n      tab-size: 2;\n      white-space: pre;\n      color: transparent;\n      background-color: transparent;\n    ')
    const { autoHeight: n, language: i, tabSize: r } = this
    n && (delete this.autoHeight, (this.autoHeight = n)),
      i && (delete this.language, (this.language = i)),
      r && (delete this.tabSize, (this.tabSize = r))
  }
  get autoHeight() {
    return this.hasAttribute('auto-height')
  }
  set autoHeight(e) {
    e
      ? ((this.style.resize = 'none'), this.setAttribute('auto-height', ''))
      : ((this.style.resize = null), this.removeAttribute('auto-height'))
  }
  get language() {
    return this.getAttribute('language')
  }
  set language(e) {
    this.setAttribute('language', e)
  }
  get tabSize() {
    return this.getAttribute('tab-size')
  }
  set tabSize(e) {
    this.setAttribute('tab-size', e)
  }
  get value() {
    return super.value
  }
  set value(e) {
    ;(super.value = e), this.oninput()
  }
  attributeChangedCallback(e, n, t) {
    switch (e) {
      case 'auto-height':
        ;(this.style.height = null),
          null != t && ((this.value = this.value.trimEnd()), h.call(this))
        break
      case 'disabled':
        c && (a.get(this).style.pointerEvents = this.disabled ? 'all' : 'none')
        break
      case 'language':
        let e = 'hljs'
        t && (e += ' language-' + t),
          (a.get(this).querySelector('code').className = e)
        break
      case 'tab-size':
        ;(this.style.tabSize = t), (a.get(this).style.tabSize = t)
    }
  }
  connectedCallback() {
    i.add(this),
      this.parentElement.insertBefore(a.get(this), this.nextSibling),
      this.oninput(),
      m.call(this),
      g.observe(this, r),
      this.addEventListener('keydown', this),
      this.addEventListener('scroll', this),
      this.addEventListener('input', this)
  }
  disconnectedCallback() {
    i.delete(this),
      a.get(this).remove(),
      g.unobserve(this),
      this.removeEventListener('keydown', this),
      this.removeEventListener('scroll', this),
      this.removeEventListener('input', this)
  }
  handleEvent(e) {
    this['on' + e.type](e)
  }
  onkeydown(e) {
    'Tab' === e.key && (u.insertText('\t'), e.preventDefault())
  }
  oninput() {
    l(this.idle)
    const e = (this.idle = o(() => {
      const { language: t, value: i } = this,
        r = a.get(this).querySelector('code')
      t || (r.className = 'hljs'),
        (r.innerHTML =
          (t ? n.highlight(i, { language: t }) : n.highlightAuto(i)).value +
          '<br>'),
        this.onscroll(),
        e === this.idle && this.autoHeight && h.call(this)
    }, r))
  }
  onscroll() {
    const { scrollTop: e, scrollLeft: n } = this,
      t = a.get(this)
    ;(t.scrollTop = e),
      (t.scrollLeft = n),
      c &&
        'scrollLeftMax' in t &&
        (this.scrollLeft = Math.min(n, t.scrollLeftMax))
  }
}
if (!customElements.get(t)) {
  const e = e => {
    for (const { target: n } of e) {
      const e = a.get(n),
        {
          border: t,
          font: i,
          letterSpacing: r,
          lineHeight: s,
          padding: o,
          wordSpacing: l,
        } = getComputedStyle(n),
        { top: d, left: g, width: u, height: b } = n.getBoundingClientRect()
      e.style.cssText = `\n        position: absolute;\n        overflow: auto;\n        box-sizing: border-box;\n        pointer-events: ${
        c && n.disabled ? 'all' : 'none'
      };\n        tab-size: ${n.tabSize || 2};\n        top: ${
        d + scrollY
      }px;\n        left: ${
        g + scrollX
      }px;\n        width: ${u}px;\n        height: ${b}px;\n        font: ${i};\n        letter-spacing: ${r};\n        word-spacing: ${l};\n        line-height: ${s};\n        padding: ${o};\n        border: ${t};\n        margin: 0;\n        background: initial;\n        border-color: transparent;\n      `
    }
  }
  addEventListener('resize', () => {
    const n = []
    for (const e of i) n.push({ target: e })
    e(n)
  }),
    (g = new ResizeObserver(e)),
    customElements.define(t, u, { extends: 'textarea' })
}
var b = customElements.get(t)
function h() {
  this.style.height = 'auto'
  const {
      boxSizing: e,
      borderTop: n,
      borderBottom: t,
      paddingTop: a,
      paddingBottom: i,
    } = getComputedStyle(this),
    r = (parseFloat(a) || 0) + (parseFloat(i) || 0),
    s = (parseFloat(n) || 0) + (parseFloat(t) || 0),
    o = 'border-box' === e ? -s : r
  this.style.height = this.scrollHeight - o + 'px'
}
function m() {
  const e = a.get(this).querySelector('code')
  e.style.backgroundColor = null
  const { color: n, backgroundColor: t } = getComputedStyle(e)
  ;(this.style.caretColor = n),
    (this.style.backgroundColor = t),
    (e.style.cssText =
      '\n    background-color: transparent;\n    overflow: unset;\n    margin: 0;\n    padding: 0;\n  ')
}
export { b as default }
