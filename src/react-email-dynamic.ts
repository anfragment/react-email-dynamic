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

/**
 * Render a React Email template.
 * @returns The rendered string (HTML or plain text).
 */
export async function render(
  /**
   * The input React Email template, written in JSX.
   */
  input: string,
  /**
   * Optional options to customize the render process.
   */
  options?: {
    /**
     * Options for the `@react-email/render` package. Optional.
     */
    reactEmailRenderOptions?: reactEmailRender.Options,
    /**
     * Options for the `@swc/core` package. Optional.
     */
    swcOptions?: swc.Options,
    /**
     * Custom scope to be injected into the template. Can be used to provide additional components or variables to the template. Optional.
     */
    scope?: Record<string, any>,
  }
): Promise<string> {
  const { code } = await swc.transform(input, options?.swcOptions ?? defaultSWCOptions);

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
   * The input React Email template, written in JSX.
   */
  input: string,
  /**
   * Optional options to customize the render process.
   */
  options?: {
    /**
     * Options for the `@react-email/render` package. Optional.
     */
    reactEmailRenderOptions?: reactEmailRender.Options,
    /**
     * Options for the `@swc/core` package. Optional.
     */
    swcOptions?: swc.Options,
    /**
     * Custom scope to be injected into the template. Can be used to provide additional components or variables to the template. Optional.
     */
    scope?: Record<string, any>,
  }
): string {
  const { code } = swc.transformSync(input, options?.swcOptions ?? defaultSWCOptions);

  const scope = {
    React,
    ...ReactComponents,
    ...options?.scope,
  };
  const element = new Function(...Object.keys(scope), `return ${code}`)(...Object.values(scope));

  return reactEmailRender.render(element, options?.reactEmailRenderOptions);
}

