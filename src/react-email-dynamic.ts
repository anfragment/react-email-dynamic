import React from 'react';
import * as swc from '@swc/core';
import * as ReactComponents from '@react-email/components';
import * as reactEmailRender from '@react-email/render';

const defaultSWCOptions: swc.Options = {
  jsc: {
    parser: {
      syntax: 'ecmascript',
      jsx: true,
    },
  },
  module: {
    type: 'commonjs',
    strictMode: false,
  },
};

interface RenderOptions {
  /**
   * Options passed to the `@react-email/render`'s `render` function. Pass `{ plainText: true }` to render plain text instead of HTML.
   * @see https://react.email/docs/utilities/render
   */
  reactEmailRenderOptions?: reactEmailRender.Options,
  /**
   * Configuration options for the SWC compiler.
   * @see https://swc.rs/docs/usage/core#transform
   * @see https://swc.rs/docs/configuration/swcrc
   */
  swcOptions?: swc.Options,
  /**
   * An object serving as the scope for the template. Enables the passing of data and/or custom components.
   * @see https://github.com/anfragment/react-email-dynamic?tab=readme-ov-file#advanced-usage-custom-components-and-data
   */
  scope?: Record<string, any>,
}

/**
 * Render a React Email template.
 * @returns The rendered string (HTML or plain text).
 */
export async function render(
  /**
   * The React Email template to be rendered, written in JSX.
   */
  template: string,
  /**
   * Optional options to customize the render process.
   */
  options?: RenderOptions,
): Promise<string> {
  const { code } = await swc.transform(template, options?.swcOptions ?? defaultSWCOptions);

  const scope = {
    React,
    ...ReactComponents,
    ...options?.scope,
  };
  const element = new Function(...Object.keys(scope), `return ${code}`)(...Object.values(scope));

  return reactEmailRender.renderAsync(element, options?.reactEmailRenderOptions);
}

/**
 * Render a React Email template synchronously.
 * @returns The rendered string (HTML or plain text).
 */
export function renderSync(
  /**
   * The React Email template to be rendered, written in JSX.
   */
  template: string,
  /**
   * Optional options to customize the render process.
   */
  options?: RenderOptions,
): string {
  const { code } = swc.transformSync(template, options?.swcOptions ?? defaultSWCOptions);

  const scope = {
    React,
    ...ReactComponents,
    ...options?.scope,
  };
  const element = new Function(...Object.keys(scope), `return ${code}`)(...Object.values(scope));

  return reactEmailRender.render(element, options?.reactEmailRenderOptions);
}
