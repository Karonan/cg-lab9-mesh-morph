# Mesh Morph: Sphere to Cube

This project demonstrates 3D mesh morphing between a sphere and a cube using Three.js.

## Morphing Algorithm

The problem with using the built-in Three.js sphere geometry for raycasting onto a cube is that its vertices do not map to the cube's edges. Every vertex is raycast onto the cube's faces, but typically misses the edges. This misalignment results in a distorted cube.

To solve this, a sphere with a different vertex orientation is required. First, the sphere mesh is constructed by normalizing the cube's vertex position vectors and then multiplying them by the sphere's radius. Next, we use Three.js morph targets to morph the cube to this custom sphere. This process ensures a sphere where each vertex is correctly mapped to the cube's. In the morphing animation, the influence of the morph target is adjusted over time to smoothly transition from the sphere shape to the cube shape.

## Getting Started

1. Clone the repository:
   ```pwsh
   git clone https://github.com/Karonan/cg-lab9-mesh-morph.git
   ```
2. Initialize project

```pwsh
npm install
npm run build
npm run preview
```

3. Open in browser
