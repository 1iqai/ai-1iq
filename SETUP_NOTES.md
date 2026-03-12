# Setup Notes - Tailwind CSS v4 Configuration

## Important Changes Made

This project uses **Tailwind CSS v4**, which has a different configuration than v3.

### Key Differences from Tailwind v3:

1. **CSS Import Syntax**
   - Old (v3): `@tailwind base; @tailwind components; @tailwind utilities;`
   - New (v4): `@import 'tailwindcss';`

2. **PostCSS Plugin**
   - Old (v3): `tailwindcss: {}`
   - New (v4): `'@tailwindcss/postcss': {}`

3. **No @apply in @layer**
   - Tailwind v4 doesn't support `@apply` in CSS files the same way
   - Use regular CSS instead

### Files Configured for Tailwind v4:

**[src/index.css](src/index.css)**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import 'tailwindcss';

/* Regular CSS instead of @apply directives */
```

**[postcss.config.js](postcss.config.js)**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**[tailwind.config.js](tailwind.config.js)**
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme configuration
    },
  },
  plugins: [],
}
```

## Development Server

```bash
npm run dev
```

Server runs on: http://localhost:5173 (or next available port)

## Production Build

```bash
npm run build
```

Output: `dist/` folder

### Build Output Notes:

- Total bundle size: ~1.28 MB (378 KB gzipped)
- Large bundle is expected due to Three.js library
- Warning about chunk size is normal for 3D applications

## If You See Errors:

### Error: "Cannot apply unknown utility class"
**Solution**: Make sure [src/index.css](src/index.css) uses `@import 'tailwindcss';` instead of `@tailwind` directives

### Error: "PostCSS plugin has moved to a separate package"
**Solution**: Install `@tailwindcss/postcss` and update [postcss.config.js](postcss.config.js)

```bash
npm install -D @tailwindcss/postcss
```

### Port already in use
Vite will automatically try the next available port (5174, 5175, etc.)

## Installed Dependencies

```json
{
  "dependencies": {
    "gsap": "Latest - Animation library",
    "@react-three/fiber": "Latest - React renderer for Three.js",
    "@react-three/drei": "Latest - Three.js helpers",
    "three": "Latest - 3D graphics library",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "Latest - Tailwind v4 PostCSS plugin",
    "tailwindcss": "Latest - Tailwind CSS framework",
    "postcss": "Latest - CSS processing",
    "autoprefixer": "Latest - CSS vendor prefixes",
    "@vitejs/plugin-react": "Latest - Vite React plugin"
  }
}
```

## Browser Requirements

- Modern browsers with ES6+ support
- WebGL support (for 3D section)
- HTML5 video support (for hero section)

## Project Status

✅ All dependencies installed
✅ Tailwind CSS v4 configured correctly
✅ Development server running
✅ Production build working
✅ All sections implemented
✅ GSAP animations configured
✅ React Three Fiber scene set up

## Next Steps

1. Visit http://localhost:5174 to see the landing page
2. Customize content (see [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md))
3. Replace placeholder video and 3D model
4. Update branding and colors
5. Deploy to production

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Support Resources

- Tailwind CSS v4 docs: https://tailwindcss.com/docs
- GSAP docs: https://greensock.com/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Vite docs: https://vitejs.dev/

## Troubleshooting Tips

1. **Clear browser cache** if styles don't update
2. **Restart dev server** after config changes
3. **Check console** for runtime errors
4. **Verify all files** are saved
5. **npm install** if dependencies are missing
