# React Email Dynamic
## Introduction
![GitHub License](https://img.shields.io/github/license/anfragment/react-email-dynamic?color=blue)
![NPM Downloads](https://img.shields.io/npm/dm/react-email-dynamic)

React Email Dynamic is a library that allows for **runtime** rendering of templates written with [React Email](https://react.email) components and JSX. This can be useful in scenarios where you want to keep your templates in a database or make them editable by non-developers. It uses [SWC](https://swc.rs) to compile the JSX and [React Email](https://react.email) itself to render the components.

## Installation
### NPM
```bash
npm install react-email-dynamic
```

### PNPM
```bash
pnpm install react-email-dynamic
```

### Yarn
```bash
yarn add react-email-dynamic
```

## Usage
```javascript
import { render } from 'react-email-dynamic';

const template = `
  <Html lang="en">
    <Text>Hello, World!</Text>
    <Hr />
    <Button href="https://example.com">Click me</Button>
  </Html>
`;

(async () => {
  const html = await render(template);
  const plainText = await render(template, {
    reactEmailRenderOptions: {
      plainText: true,
    },
  });
})();
```

## API
### `render(template: string, options?: RenderOptions): Promise<string>`
Renders the given template string into an HTML string asynchronously.

### `renderSync(template: string, options?: RenderOptions): string`
Renders the given template string into an HTML string synchronously. Use in environments where asynchronous calls are not possible or desired.

### `RenderOptions`
- `reactEmailRenderOptions?: @react-email/render.Options`: Options passed to the [React Email's render function](https://react.email/docs/utilities/render). Pass `{ plainText: true }` to render plain text instead of HTML.
- `scope?: Record<string, any>`: An object serving as the scope for the template. Enables the passing of data and/or custom components. See the [Advanced Usage](#advanced-usage-custom-components-and-data) section for more information.
- `swcOptions?: swc.Options`: Configuration options for the [SWC compiler](https://swc.rs/docs/usage/core#transform), allowing adjustments to the JSX parser and other compile-time settings.

## Security
This library does not perform input validation or sanitization. Passing user input directly to the template string or the scope object can lead to arbitrary code execution and XSS (Cross-Site Scripting) attacks. Only allow a trusted source to modify the template. If you need to pass user input to the template via the `scope` object, ensure each value is sanitized. Possible solutions include using libraries such as [DOMPurify](https://www.npmjs.com/package/dompurify) or [sanitize-html](https://www.npmjs.com/package/sanitize-html).

## Advanced Usage (custom components and data)
You can pass custom components and data into the template by using the `scope` option. The values can be any valid React component or data type. **This can lead to vulnerabilities**, so check the [Security](#security) section before using this feature.
```javascript
import { render } from 'react-email-dynamic';

const template = `
  <Html lang="en">
    <Heading>{message}</Heading>
    <CustomComponent />
  </Html>
`;

const scope = {
  message: 'Hello, World!',
  CustomComponent: () => <Text>Custom component</Text>,
};

(async () => {
  const html = await render(template, { scope });
})();
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

