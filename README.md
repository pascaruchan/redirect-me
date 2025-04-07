# Redirect Me

A browser extension that allows users to create and manage rules for redirecting HTTP(S) requests based on URL patterns and transformations.

## Features

- Create, edit, and delete redirection rules
- Define complex URL patterns using regular expressions
- Apply multiple transformations to matched URL parts
- Toggle rules on/off easily
- Simple and intuitive user interface

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the extension:
   ```bash
   pnpm build
   ```
4. Load the extension in your browser:
   - Chrome: Go to `chrome://extensions/`, enable "Developer mode", and click "Load unpacked"
   - Firefox: Go to `about:debugging`, click "This Firefox", and click "Load Temporary Add-on"

## Usage

### Creating a Rule

1. Click the extension icon to open the popup
2. Click "Manage Rules" to open the options page
3. Click "Add New Rule"
4. Fill in the rule details:
   - Name: A descriptive name for the rule
   - Description: Optional description of what the rule does
   - Input Pattern: Regular expression to match URLs
   - Output Pattern: Template for the new URL (use $1, $2, etc. for capture groups)
   - Transformation Rules: Optional transformations to apply to matched parts

### Example Rule

To redirect Google Translate URLs to their original source:

```json
{
  "name": "Avoid Google Translate Website",
  "description": "Redirect google translate website to original website",
  "inputPattern": "https://(.*).translate.goog/(.*)",
  "outputPattern": "https://$1/$2",
  "transformationRules": [
    {
      "type": "ReplaceAll",
      "searchValue": "-",
      "replaceValue": ".",
      "target": 1
    },
    {
      "type": "ReplaceAll",
      "searchValue": "..",
      "replaceValue": "-",
      "target": 1
    }
  ]
}
```

This rule will transform:
```
https://docs-coqui-ai.translate.goog/en/latest/
```
into:
```
https://docs.coqui.ai/en/latest/
```

## Development

- `pnpm dev`: Start development server
- `pnpm build`: Build extension for production
- `pnpm package`: Create a package for distribution

## License

MIT
