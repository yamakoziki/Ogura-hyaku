# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code development template for GitHub Codespaces, designed specifically for non-engineers to quickly start web and Python development. The project name "Ogura-hyaku" suggests it may be related to the classical Japanese poetry collection "Ogura Hyakunin Isshu" (小倉百人一首).

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (static web development)
- **Backend**: Python with Flask for web applications
- **Package Manager**: npm for Node.js dependencies
- **Development Server**: Live Server for frontend development
- **Python Libraries**: requests, flask

## Development Commands

### Web Development
```bash
# Start development server with live reload
npm run dev

# Alternative development server (port 8000)
npm start

# Static file server (port 3000)
npm run serve
```

### Python Development
```bash
# Run Python scripts directly
python script_name.py

# Start Flask applications
python app.py
```

## Architecture

This is a template repository optimized for GitHub Codespaces using the default image to maximize free tier usage. The structure is intentionally minimal:

- Root contains basic configuration files (package.json, README.md)
- No complex build system or framework - focuses on simplicity for beginners
- Uses live-server for immediate feedback during web development
- Supports both static web pages and Python Flask applications

## Development Environment

The environment is configured for:
1. **GitHub Codespaces** - uses default image to avoid storage quota usage
2. **Bilingual support** - documentation in Japanese, suitable for Japanese developers
3. **Beginner-friendly** - minimal setup, immediate start capability
4. **Cost-conscious** - optimized for GitHub's free tier and Claude Pro plan usage

## Key Features

- No custom Docker image (uses Codespaces default)
- Lightweight package installations
- Ready-to-use web development environment
- Python Flask support for backend development
- Live preview capabilities for immediate feedback