# 1IQ - Construction AI Platform Landing Page

A modern, animated landing page built with React, GSAP, and React Three Fiber, featuring smooth scroll animations, 3D visualizations, and a professional design inspired by hut8.com.

## Tech Stack

- **Vite** - Fast build tool and development server
- **React** - UI component library
- **GSAP** (GreenSock Animation Platform) - Professional-grade animations
- **ScrollTrigger** - Scroll-based animations
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Three.js** - 3D graphics library
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── HeroSection.jsx       # Video background with veil animation
│   ├── FeedbackSection.jsx   # Customer testimonials with cards
│   ├── ThreeDSection.jsx     # React Three Fiber 3D scene
│   ├── FeaturesSection.jsx   # Feature cards with grid layout
│   └── Footer.jsx            # Footer with links and contact info
├── App.jsx                   # Main app component
├── main.jsx                  # App entry point
└── index.css                 # Global styles with Tailwind
```

## Section Details

### 1. Hero Section

- **File**: [src/components/HeroSection.jsx](src/components/HeroSection.jsx)
- **Features**:
  - Full viewport video background
  - Dark overlay for text readability
  - "Veil lifting" scroll animation using GSAP ScrollTrigger
  - Fade-out effect on scroll
  - Animated scroll indicator

**Customization**:
- Replace video URL on line 56 with your own construction video
- Update heading and subheading text (lines 73-83)
- Modify gradient colors in Tailwind classes

### 2. Feedback Section

- **File**: [src/components/FeedbackSection.jsx](src/components/FeedbackSection.jsx)
- **Features**:
  - Reusable `FeedbackCard` component
  - Grid layout responsive design
  - Stagger animations on scroll
  - Quote icons and styled cards

**Customization**:
- Edit testimonials array (lines 47-68)
- Add more testimonials by adding objects to the array
- Customize card styling in `FeedbackCard` component

### 3. 3D Section

- **File**: [src/components/ThreeDSection.jsx](src/components/ThreeDSection.jsx)
- **Features**:
  - React Three Fiber Canvas setup
  - OrbitControls for camera interaction
  - Placeholder 3D construction geometry
  - Proper lighting and shadows
  - Suspense wrapper for model loading

**Customization**:
Replace the `ConstructionModel` component (lines 18-67) with your own 3D model:

```jsx
import { useGLTF } from '@react-three/drei';

const ConstructionModel = () => {
  const { scene } = useGLTF('/path/to/your/model.glb');
  return <primitive object={scene} />;
};
```

### 4. Features Section

- **File**: [src/components/FeaturesSection.jsx](src/components/FeaturesSection.jsx)
- **Features**:
  - Reusable `FeatureCard` component
  - 6 feature cards in responsive grid
  - Hover effects with CSS transitions
  - Stagger animations using GSAP
  - CTA button with gradient

**Customization**:
- Edit features array (lines 42-73)
- Change icons (use emoji or replace with SVG icons)
- Modify grid layout (`grid-cols-*` classes)

### 5. Footer

- **File**: [src/components/Footer.jsx](src/components/Footer.jsx)
- **Features**:
  - 4-column responsive layout
  - Social media icons
  - Company info, links, resources, contact
  - Copyright notice
  - Mobile-friendly (stacks on small screens)

**Customization**:
- Update company name and description (lines 11-14)
- Add/remove social media links (lines 19-45)
- Modify footer links in each column

## GSAP Integration

All GSAP animations follow React best practices:

1. **Context API**: Uses `gsap.context()` for scoping and cleanup
2. **useEffect**: Animations initialized in `useEffect` hooks
3. **Cleanup**: Proper cleanup on component unmount
4. **Refs**: Uses React refs instead of direct DOM queries
5. **ScrollTrigger**: Properly registered and cleaned up

### Example Animation Pattern

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(elementRef.current, {
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  }, elementRef);

  return () => ctx.revert(); // Cleanup
}, []);
```

## React Three Fiber Setup

The 3D section demonstrates proper R3F setup:

- **Canvas**: Configured with shadows and device pixel ratio
- **Lighting**: Multiple light sources (ambient, directional, point, spot)
- **Controls**: OrbitControls with constraints
- **Suspense**: Loading fallback for async model loading
- **Performance**: Optional `frameloop="demand"` for static scenes

## Styling Customization

### Colors

Edit [tailwind.config.js](tailwind.config.js) to customize the color palette:

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9', // Change primary color
        // Add more shades
      },
    },
  },
}
```

### Fonts

The project uses Inter font family. To change:

1. Update Google Fonts import in [src/index.css](src/index.css)
2. Modify `fontFamily` in [tailwind.config.js](tailwind.config.js)

### Animations

All animation timings and easings can be customized in each component file by modifying the GSAP configurations.

## Performance Optimization

- **React.memo**: Consider wrapping static components
- **Lazy Loading**: Images and heavy components
- **GSAP Context**: Ensures proper cleanup and performance
- **R3F**: Use `frameloop="demand"` for static 3D scenes
- **Tailwind Purge**: Unused CSS automatically removed in production

## SEO

Meta tags are configured in [index.html](index.html):
- Primary meta tags (title, description, keywords)
- Open Graph tags (Facebook)
- Twitter Card tags
- Theme color

Update these to match your brand and content.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebGL support required for 3D section
- Video tag support for hero section

## Troubleshooting

### Video not loading
- Ensure video URL is accessible
- Check video format (MP4 recommended)
- Add multiple source formats for fallback

### 3D scene not rendering
- Check browser WebGL support
- Verify Three.js and R3F installation
- Check browser console for errors

### Animations not smooth
- Reduce complexity of GSAP animations
- Use `will-change` CSS property sparingly
- Check for console warnings from ScrollTrigger

## Next Steps

1. Replace placeholder video with actual construction footage
2. Add your 3D construction model to ThreeDSection
3. Update testimonials with real customer feedback
4. Customize colors and branding
5. Add analytics tracking
6. Optimize images and assets
7. Set up CI/CD pipeline

## License

MIT

## Credits

Design inspired by [hut8.com](https://hut8.com)
Built with React, GSAP, and React Three Fiber
