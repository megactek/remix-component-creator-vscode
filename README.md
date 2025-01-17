
# Remix Route Creator

A VS Code extension that simplifies creating new routes in your Remix applications. Create page routes, resource routes, layouts, and error boundaries with a few clicks.

## Features

- Create different types of Remix routes:
  - Page Routes (with meta function)
  - Resource Routes (with loader and action)
  - Layout Routes (with Outlet)
  - Error Boundaries
- Automatic component naming based on route path
- Validates route names according to Remix conventions
- Creates nested routes automatically
- Opens newly created files immediately

## Installation

### From VSIX
1. Download the latest `.vsix` file from the releases
2. In VS Code, press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Install from VSIX" and select it
4. Choose the downloaded `.vsix` file

### From Source
1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to start debugging

## Usage

1. Right-click on any folder within your Remix routes directory
2. Select "Create Remix Route..." from the context menu
3. Choose the type of route you want to create:
   - Page Route
   - Resource Route
   - Layout Route
   - Error Boundary
4. Enter the route name (e.g., "items.new" or "edit")
5. The new route file will be created and opened automatically

## Route Types

### Page Route
```tsx
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "YourRoute" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function YourRoute() {
  return (
    <div>
      <h1>YourRoute</h1>
    </div>
  );
}
````

### Resource Route

```tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ message: 'Hello' })
}

export async function action({ request }: ActionFunctionArgs) {
  return json({ success: true })
}
```

### Layout Route

```tsx
import { Outlet } from '@remix-run/react'

export default function YourRoute() {
  return (
    <div>
      <header>
        <h1>YourRoute Layout</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

### Error Boundary

```tsx
import { useRouteError } from '@remix-run/react'

export default function YourRoute() {
  return (
    <div>
      <h1>YourRoute</h1>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  )
}
```

## Requirements

- VS Code 1.60.0 or higher
- A Remix v2 project

## Extension Settings

This extension contributes the following settings:

- None currently

## Known Issues

- None currently

## Release Notes

### 0.0.1

Initial release:

- Basic route creation functionality
- Four route types: page, resource, layout, and error boundary
- Route name validation
- Context menu integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

Adedamola Adeyemo

