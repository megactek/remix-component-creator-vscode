import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

type RouteType = "page" | "resource" | "layout" | "error";

interface RouteTemplate {
  name: string;
  description: string;
  generate: (routeName: string) => string;
}

const routeTemplates: Record<RouteType, RouteTemplate> = {
  page: {
    name: "Page Route",
    description: "A standard page route with meta and default export",
    generate: (routeName: string) => {
      const componentName = getComponentName(routeName);
      return `import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "${componentName}" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
    </div>
  );
}
`;
    },
  },
  resource: {
    name: "Resource Route",
    description: "An API route with loader and action functions",
    generate: (routeName: string) => {
      return `import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ message: "Hello from ${routeName}" });
}

export async function action({ request }: ActionFunctionArgs) {
  // Handle POST, PUT, DELETE requests
  return json({ success: true });
}
`;
    },
  },
  layout: {
    name: "Layout Route",
    description: "A route that provides layout for child routes",
    generate: (routeName: string) => {
      const componentName = getComponentName(routeName);
      return `import { Outlet } from "@remix-run/react";

export default function ${componentName}() {
  return (
    <div>
      <header>
        <h1>${componentName} Layout</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
`;
    },
  },
  error: {
    name: "Error Boundary",
    description: "A route with error handling",
    generate: (routeName: string) => {
      const componentName = getComponentName(routeName);
      return `import { useRouteError } from "@remix-run/react";

export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
`;
    },
  },
};

function getComponentName(routeName: string): string {
  return routeName
    .split(".")
    .map((part) => {
      const newPart = part.replace(/[^a-zA-Z]/gi, "");
      return newPart.charAt(0).toUpperCase() + newPart.slice(1);
    })
    .join("");
}

function validateRouteName(routeName: string): string | null {
  if (!routeName) {
    return "Route name cannot be empty";
  }

  // if (!/^[a-zA-Z0-9._-]+$/.test(routeName)) {
  //   return "Route name can only contain letters, numbers, dots, hyphens and underscores";
  // }

  // Check for valid Remix route naming conventions
  if (routeName.startsWith(".") || routeName.endsWith(".")) {
    return "Route name cannot start or end with a dot";
  }

  if (routeName.includes("..")) {
    return "Route name cannot contain consecutive dots";
  }

  return null;
}

async function selectRouteType(): Promise<RouteType | undefined> {
  const items = Object.entries(routeTemplates).map(([type, template]) => ({
    label: template.name,
    description: template.description,
    value: type as RouteType,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "Select the type of route to create",
  });

  return selected?.value;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("remix-route-creator.createRoute", async (uri: vscode.Uri) => {
    if (!uri) {
      vscode.window.showErrorMessage("Please right-click on a folder in the routes directory.");
      return;
    }

    const routesDir = uri.fsPath;
    if (!routesDir.includes("routes")) {
      vscode.window.showErrorMessage("This command can only be used within a Remix routes directory.");
      return;
    }

    const routeType = await selectRouteType();
    if (!routeType) {
      return;
    }

    const routeName = await vscode.window.showInputBox({
      prompt: "Enter the route name (e.g., 'items.new' or 'edit')",
      placeHolder: "route.name",
      validateInput: validateRouteName,
    });

    if (!routeName) {
      return;
    }

    const newRoutePath = path.join(routesDir, `${routeName}.tsx`);

    if (fs.existsSync(newRoutePath)) {
      vscode.window.showErrorMessage(`Route ${routeName} already exists!`);
      return;
    }

    try {
      const routeContent = routeTemplates[routeType].generate(routeName);
      fs.mkdirSync(path.dirname(newRoutePath), { recursive: true });
      fs.writeFileSync(newRoutePath, routeContent);

      const document = await vscode.workspace.openTextDocument(newRoutePath);
      await vscode.window.showTextDocument(document);

      vscode.window.showInformationMessage(`Route ${routeName} created successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`Failed to create route: ${errorMessage}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
