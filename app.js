// Template Manager Application
class TemplateManager {
    constructor() {
        this.templates = [];
        this.filteredTemplates = [];
        this.initialize();
    }

    async initialize() {
        await this.loadTemplates();
        this.setupEventListeners();
        this.renderTemplates();
    }

    async loadTemplates() {
        try {
            // This would be replaced with actual API calls in a real application
            // For now, we'll use a mock implementation
            this.templates = await this.scanTemplatesDirectory();
            this.filteredTemplates = [...this.templates];
        } catch (error) {
            console.error('Error loading templates:', error);
            this.showError('Failed to load templates. Please check the console for details.');
        }
    }

    async scanTemplatesDirectory() {
        const templates = [];
        
        // Digital India templates (Sameer's)
        const digitalIndiaFiles = [
            'card.html',
            'cardContainer.html',
            'footer.html',
            'hero.html',
            'leaderCard.html',
            'smallCard.html'
        ];

        // Add digital india templates
        for (const file of digitalIndiaFiles) {
            try {
                const content = await this.readTemplateFile(`digital india/${file}`);
                if (content) {
                    let name = file.replace(/\.html$/, '').replace(/([A-Z])/g, ' ').replace(/^./, str => str.toUpperCase());
                    // Special case for card.html in digital india
                    if (file === 'card.html') {
                        name = 'Card Initiatives';
                    }
                    templates.push({
                        id: `digital-india-${file}`,
                        name: name,
                        category: 'digital india',
                        content: content,
                        user: 'sameer'  // Mark as Sameer's template
                    });
                }
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }

        // Hiroshima templates
        const hiroshimaFiles = [
            'aboveText.html',
            'animation.html',
            'card.html',
            'cardContainer.html',
            'heroSectionFullImg.html',
            'links.html',
            'simpleFooter.html',
            'story.html',
            'vid.html',
            'vidContainer.html'
        ];

        // Add hiroshima templates
        for (const file of hiroshimaFiles) {
            try {
                const content = await this.readTemplateFile(`hiroshima/${file}`);
                if (content) {
                    let name = file.replace(/\.html$/, '')
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase())
                                .replace('Hero Section Img', 'Hero Section with Image')
                                .replace('Hero Section Full Img', 'Full Hero Section with Image')
                                .replace('Vid', 'Video')
                                .replace('Vid Container', 'Video Container');
                    
                    // Special cases for hiroshima templates
                    if (file === 'card.html') {
                        name = 'card master minds';
                    } else if (file === 'cardContainer.html') {
                        name = 'card container masterminds';
                    }
                    
                    templates.push({
                        id: `hiroshima-${file}`,
                        name: name,
                        category: 'hiroshima',
                        content: content,
                        user: 'sameer'  // Mark as Sameer's template
                    });
                }
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }

        // Add root files as templates
        const rootFiles = [
            'link.txt',
            'notes.md',
            'topics.md'
        ];

        for (const file of rootFiles) {
            try {
                const content = await this.readTemplateFile(file);
                if (content) {
                    const name = file.replace(/\.[^/.]+$/, '')
                                   .replace(/([A-Z])/g, ' $1')
                                   .replace(/^./, str => str.toUpperCase())
                                   .replace('Md', '')
                                   .replace('Txt', '')
                                   .trim();
                    
                    templates.push({
                        id: `root-${file}`,
                        name: name,
                        category: 'other',
                        content: content,
                        user: 'sameer'  // Mark as Sameer's template
                    });
                }
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }

        // Add Utk's templates
        const utkTemplateFiles = [
            'animations.html',
            'card.html',
            'footer.html',
            'hero section half image.html',
            'nav with bg image.html',
            'navbar.html'
        ];

        // Add Utk's templates
        for (const file of utkTemplateFiles) {
            try {
                const content = await this.readTemplateFile(`template/template/${file}`);
                if (content) {
                    const name = file.replace(/\.html$/, '')
                                   .replace(/([A-Z])/g, ' $1')
                                   .replace(/-/g, ' ')
                                   .replace(/\./g, ' ')
                                   .replace(/\b\w/g, str => str.toUpperCase())
                                   .replace(/\s+/g, ' ')
                                   .trim();
                    
                    templates.push({
                        id: `utk-${file.replace(/\s+/g, '-')}`,
                        name: name,
                        category: 'utk templates',
                        content: content,
                        user: 'utk'  // Mark as Utk's template
                    });
                }
            } catch (error) {
                console.error(`Error processing Utk's template ${file}:`, error);
            }
        }

        return templates;
    }

    async readTemplateFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let content = await response.text();
            
            // Remove VS Code Live Preview injected script if present
            content = content.replace(/<script type="text\/javascript" src="\/___vscode_livepreview_injected_script"><\/script>\s*/g, '');
            
            return content;
        } catch (error) {
            console.error(`Error reading file ${path}:`, error);
            return `Error loading template: ${path} - ${error.message}`;
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.filterTemplates(e.target.value);
        });

        // User tab switching
        document.querySelectorAll('.user-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Update active tab
                document.querySelectorAll('.user-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show/hide templates based on user
                const selectedUser = e.target.dataset.user;
                this.filterTemplates(searchInput.value, selectedUser);
            });
        });

        // Click outside to reset copy buttons
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-copy')) {
                this.resetCopyButtons();
            }
        });
    }

    filterTemplates(searchTerm, user = 'sameer') {
        // First filter by user
        let filtered = this.templates.filter(template => {
            const templateUser = template.user || 'sameer'; // Default to 'sameer' for backward compatibility
            return templateUser === user;
        });

        // Then apply search filter if there's a search term
        if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(template => 
                template.name.toLowerCase().includes(term) || 
                template.category.toLowerCase().includes(term) ||
                template.content.toLowerCase().includes(term)
            );
        }

        this.filteredTemplates = filtered;
        this.renderTemplates(user);
    }

    renderTemplates(user = 'sameer') {
        const container = document.getElementById('templatesContainer');
        
        if (this.filteredTemplates.length === 0) {
            container.innerHTML = `
                <div class="no-templates">
                    <h3>No templates found</h3>
                    <p>Try adjusting your search or add a new template.</p>
                </div>
            `;
            return;
        }
        
        // Set data-user attribute for all templates
        document.querySelectorAll('.template-card').forEach(card => {
            card.style.display = 'none';
        });

        container.innerHTML = this.filteredTemplates.map(template => `
            <div class="template-card" data-id="${template.id}">
                <div class="template-header">
                    <h3>${template.name}</h3>
                    <span class="template-category">${template.category}</span>
                </div>
                <div class="template-content">${this.escapeHtml(template.content)}</div>
                <div class="template-actions">
                    <button class="btn btn-copy" data-content="${this.escapeHtml(template.content)}">
                        <i class="far fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the new copy buttons
        document.querySelectorAll('.btn-copy').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(button.getAttribute('data-content'), button);
            });
        });
    }

    async copyToClipboard(content, button) {
        try {
            await navigator.clipboard.writeText(content);
            this.showCopiedFeedback(button);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.showError('Failed to copy to clipboard');
        }
    }

    showCopiedFeedback(button) {
        // Reset all buttons first
        this.resetCopyButtons();
        
        // Update the clicked button
        const icon = button.querySelector('i');
        const originalText = button.textContent.trim();
        
        button.classList.add('btn-copied');
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        // Revert after 2 seconds
        setTimeout(() => {
            button.classList.remove('btn-copied');
            button.innerHTML = originalText;
            if (icon) button.prepend(icon);
        }, 2000);
    }

    resetCopyButtons() {
        document.querySelectorAll('.btn-copy').forEach(btn => {
            if (btn.textContent.includes('Copied')) {
                btn.classList.remove('btn-copied');
                btn.innerHTML = '<i class="far fa-copy"></i> Copy';
            }
        });
    }

    showError(message) {
        // In a real app, you might show this in a nice toast or alert
        console.error('Error:', message);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TemplateManager();
});
