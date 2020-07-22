/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

// Required for @emotion/css
// import { jsx } from '@emotion/react'
import { extractCritical } from '@emotion/server'

interface Props {
  ids: any
  css: any
}

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const page = ctx.renderPage()
    const styles = extractCritical(page.html)
    return { ...initialProps, ...page, ...styles }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=0, user-scalable=0" />
          <style data-emotion-css={this.props.ids.join(' ')} dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
