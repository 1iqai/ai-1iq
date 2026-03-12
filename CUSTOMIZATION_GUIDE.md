# Customization Guide

Quick reference for common customization tasks.

## Quick Customizations

### Change Video Background

**File**: [src/components/HeroSection.jsx:56](src/components/HeroSection.jsx#L56)

```jsx
<source
  src="YOUR_VIDEO_URL_HERE.mp4"
  type="video/mp4"
/>
```

For local videos, place in `public/` folder and reference as `/video.mp4`

### Update Hero Text

**File**: [src/components/HeroSection.jsx:73-83](src/components/HeroSection.jsx#L73-L83)

```jsx
<h1 className="...">
  Your Main Heading
  <span className="...">
    Your Highlighted Text
  </span>
</h1>
<p className="...">
  Your subheading text here.
</p>
```

### Add/Edit Testimonials

**File**: [src/components/FeedbackSection.jsx:47-68](src/components/FeedbackSection.jsx#L47-L68)

```jsx
const testimonials = [
  {
    quote: "Your testimonial text",
    author: "Customer Name",
    role: "Job Title",
    company: "Company Name"
  },
  // Add more...
];
```

### Replace 3D Model

**File**: [src/components/ThreeDSection.jsx:18-67](src/components/ThreeDSection.jsx#L18-L67)

1. Install useGLTF if needed (already included in @react-three/drei)
2. Place your .glb or .gltf file in `public/models/`
3. Replace the ConstructionModel component:

```jsx
import { useGLTF } from '@react-three/drei';

const ConstructionModel = () => {
  const { scene } = useGLTF('/models/your-model.glb');
  return <primitive object={scene} scale={1} />;
};
```

### Update Features

**File**: [src/components/FeaturesSection.jsx:42-73](src/components/FeaturesSection.jsx#L42-L73)

```jsx
const features = [
  {
    icon: '🚀', // Emoji or replace with <YourIcon />
    title: 'Feature Title',
    description: 'Feature description text.',
  },
  // Add more features...
];
```

### Change Primary Colors

**File**: [tailwind.config.js:11-18](tailwind.config.js#L11-L18)

```js
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',  // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    900: '#0c4a6e',
  },
},
```

### Update Company Info

**File**: [src/components/Footer.jsx:11-25](src/components/Footer.jsx#L11-L25)

```jsx
<h3 className="...">
  Your Company Name
</h3>
<p className="...">
  Your company description
</p>
```

### Change Font Family

**File**: [tailwind.config.js:7-9](tailwind.config.js#L7-L9)

```js
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
},
```

Also update the Google Fonts import in [src/index.css:1](src/index.css#L1)

### Adjust Animation Speed

In any component file, modify GSAP duration values:

```jsx
gsap.from(element, {
  duration: 0.8, // Change this value (in seconds)
  // ... other properties
});
```

### Change Scroll Animation Trigger Points

Modify ScrollTrigger start/end values:

```jsx
scrollTrigger: {
  trigger: element,
  start: 'top 80%',  // When animation starts
  end: 'bottom top',  // When animation ends
}
```

Common start values:
- `'top 80%'` - Starts when element top hits 80% down viewport
- `'top center'` - Starts when element top hits viewport center
- `'top top'` - Starts when element top hits viewport top

## Color Scheme Quick Reference

Current palette (inspired by hut8.com):

- Primary Blue: `#0ea5e9`
- Cyan Accent: `#06b6d4`
- Dark Gray: `#1f2937`
- Light Gray: `#f9fafb`

Update these throughout components or in Tailwind config.

## Performance Tips

### Optimize 3D Scene

In [src/components/ThreeDSection.jsx](src/components/ThreeDSection.jsx):

```jsx
<Canvas
  frameloop="demand"  // Only render when needed
  dpr={[1, 1.5]}      // Lower for better performance
>
```

### Lazy Load Sections

In [src/App.jsx](src/App.jsx):

```jsx
import { lazy, Suspense } from 'react';

const ThreeDSection = lazy(() => import('./components/ThreeDSection'));

// In render:
<Suspense fallback={<div>Loading...</div>}>
  <ThreeDSection />
</Suspense>
```

### Reduce GSAP Animation Complexity

Remove or simplify animations in components if experiencing performance issues.

## Common Issues

### Video not playing on mobile
- Ensure video has `playsInline` attribute (already added)
- Keep video file size small (<10MB)
- Consider using a poster image as fallback

### 3D scene blank/not visible
- Check browser console for WebGL errors
- Verify camera position in ThreeDSection
- Ensure proper lighting is set up

### Animations jerky/stuttering
- Reduce number of simultaneous animations
- Use `will-change: transform` CSS property sparingly
- Check browser performance in DevTools

## Deployment Checklist

Before deploying:

1. ✓ Replace placeholder video URL
2. ✓ Add real 3D model (optional)
3. ✓ Update all testimonials
4. ✓ Change company name and branding
5. ✓ Update meta tags in index.html
6. ✓ Add real contact information
7. ✓ Test on mobile devices
8. ✓ Optimize images and videos
9. ✓ Run `npm run build` to test production build
10. ✓ Add analytics tracking (Google Analytics, etc.)

## Need Help?

Check the main [README.md](README.md) for detailed documentation.
