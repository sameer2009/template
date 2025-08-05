# Template Manager

A simple web application to manage and quickly copy HTML templates.

## Features

- View all your templates in a clean, card-based interface
- Search and filter templates by name or content
- One-click copy template content to clipboard
- Responsive design that works on all devices

## Getting Started

1. **Start the local server**:
   ```bash
   python -m http.server 8000
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

## Adding New Templates

1. Place your template files in the appropriate directory (e.g., `digital india/`, `hiroshima/`)
2. The application will automatically scan and include them in the interface

## Usage

- **Search**: Type in the search bar to filter templates
- **Copy**: Click the "Copy" button to copy a template's content to your clipboard
- **View**: Click on a template to view its full content

## Customization

You can customize the look and feel by modifying the CSS in `index.html`.

## Future Enhancements

- Add template categories
- Support for more template types (CSS, JS, etc.)
- Template preview functionality
- User authentication for private templates
