import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'
import './Galaxy.css'

const vertexShader = `#version 300 es
precision highp float;

in vec2 uv;
in vec2 position;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

in vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mousePx = uMouse * uResolution.xy;
  vec2 mouseUV = (mousePx - focalPx) / uResolution.y;

  vec2 rot = uRotation;
  float cosR = cos(rot.x);
  float sinR = sin(rot.x);
  mat2 rotMat = mat2(cosR, -sinR, sinR, cosR);

  vec2 transformedUV = rotMat * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < NUM_LAYER; i++) {
    float layerIndex = i;
    float scale = 1.0 + layerIndex * 0.5;
    vec2 layerUV = transformedUV * scale * uDensity;

    vec2 gv = fract(layerUV) - 0.5;
    vec2 id = floor(layerUV);
    float seed = Hash21(id + layerIndex);

    vec2 cellCenter = (fract(layerUV) - 0.5);
    float distFromCenter = length(cellCenter * uResolution.y);

    float mouseDist = length((layerUV - mouseUV * scale) * uResolution.y);
    float repulsion = 0.0;
    if (uMouseRepulsion) {
      repulsion = smoothstep(0.0, 150.0 * uRepulsionStrength, mouseDist) * (1.0 - smoothstep(50.0 * uRepulsionStrength, 150.0 * uRepulsionStrength, mouseDist));
      repulsion *= uMouseActiveFactor;
    }

    float centerDist = length(uv * uResolution.y);
    float autoRepulse = 0.0;
    if (uAutoCenterRepulsion > 0.0) {
      autoRepulse = smoothstep(0.0, 200.0 * uAutoCenterRepulsion, centerDist) * (1.0 - smoothstep(50.0 * uAutoCenterRepulsion, 200.0 * uAutoCenterRepulsion, centerDist));
    }

    vec2 displacedUV = layerUV;
    if (repulsion > 0.0) {
      vec2 dir = layerUV - mouseUV * scale;
      float d = length(dir) + 0.001;
      displacedUV += (dir / d) * repulsion * 0.05;
    }
    if (autoRepulse > 0.0) {
      vec2 dir = layerUV;
      float d = length(dir) + 0.001;
      displacedUV += (dir / d) * autoRepulse * 0.03;
    }

    vec3 layerCol = StarLayer(displacedUV + vec2(layerIndex * 10.0));

    float brightness = 1.0 / (1.0 + layerIndex * 0.3);
    col += layerCol * brightness;
  }

  vec2 finalMousePx = uMouse * uResolution.xy;
  float glowDist = length((vUv * uResolution.xy - finalMousePx) / uResolution.y);
  float mouseGlow = smoothstep(1.5, 0.0, glowDist) * uGlowIntensity * 0.3;
  col += vec3(0.3, 0.4, 0.6) * mouseGlow * uMouseActiveFactor;

  float vignette = 1.0 - smoothstep(0.5, 1.2, length(uv * vec2(1.5, 1.0)));
  col *= mix(0.6, 1.0, vignette);

  col = pow(col, vec3(1.1));

  if (uTransparent) {
    float alpha = smoothstep(0.02, 0.3, max(max(col.r, col.g), col.b));
    fragColor = vec4(col, alpha);
  } else {
    fragColor = vec4(col, 1.0);
  }
}
`

const Galaxy = ({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  repulsionStrength = 2,
  autoCenterRepulsion = 0,
  transparent = true,
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let renderer, gl, program, mesh, raf
    let cleanupFired = false
    let resizeHandler, mouseMoveHandler
    let contextLostHandler

    try {
      renderer = new Renderer({
        canvas: container.querySelector('canvas') || undefined,
        alpha: transparent,
        antialias: true,
        powerPreference: 'high-performance',
      })

      gl = renderer.gl
      if (!gl) return

      gl.clearColor(0, 0, 0, transparent ? 0 : 1)

      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Color(gl.drawingBufferWidth, gl.drawingBufferHeight, gl.drawingBufferHeight) },
          uFocal: { value: focal },
          uRotation: { value: rotation },
          uStarSpeed: { value: starSpeed },
          uDensity: { value: density },
          uHueShift: { value: hueShift },
          uSpeed: { value: speed },
          uMouse: { value: [0.5, 0.5] },
          uGlowIntensity: { value: glowIntensity },
          uSaturation: { value: saturation },
          uMouseRepulsion: { value: mouseRepulsion },
          uTwinkleIntensity: { value: twinkleIntensity },
          uRotationSpeed: { value: rotationSpeed },
          uRepulsionStrength: { value: repulsionStrength },
          uMouseActiveFactor: { value: 0 },
          uAutoCenterRepulsion: { value: autoCenterRepulsion },
          uTransparent: { value: transparent },
        },
      })

      const geometry = new Triangle(gl)
      mesh = new Mesh(gl, { geometry, program })

      resizeHandler = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        renderer.setSize(w, h, false)
        program.uniforms.uResolution.value.set(w, h, h)
      }

      resizeHandler()
      window.addEventListener('resize', resizeHandler)

      let mouseActiveFactor = 0
      let mouseTimeout

      mouseMoveHandler = (e) => {
        const rect = container.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = 1.0 - (e.clientY - rect.top) / rect.height
        program.uniforms.uMouse.value = [x, y]
        mouseActiveFactor = 1
        clearTimeout(mouseTimeout)
        mouseTimeout = setTimeout(() => {
          mouseActiveFactor = 0
        }, 100)
      }

      if (mouseInteraction) {
        window.addEventListener('mousemove', mouseMoveHandler)
      }

      const canvas = gl.canvas
      contextLostHandler = (e) => {
        e.preventDefault()
        cleanupFired = true
        if (raf) cancelAnimationFrame(raf)
      }
      canvas.addEventListener('webglcontextlost', contextLostHandler, false)

      const startTime = performance.now()

      const render = () => {
        if (cleanupFired) return
        raf = requestAnimationFrame(render)
        const elapsed = (performance.now() - startTime) / 1000

        try {
          if (!disableAnimation) {
            program.uniforms.uTime.value = elapsed
            program.uniforms.uRotation.value[0] = rotation[0] + elapsed * rotationSpeed
          }

          program.uniforms.uMouseActiveFactor.value += (mouseActiveFactor - program.uniforms.uMouseActiveFactor.value) * 0.05

          renderer.render({ scene: mesh })
        } catch (renderErr) {
          console.warn('[Galaxy] Render failed:', renderErr.message)
          cleanupFired = true
          cancelAnimationFrame(raf)
        }
      }

      raf = requestAnimationFrame(render)
    } catch (err) {
      console.warn('[Galaxy] WebGL init failed:', err.message)
    }

    return () => {
      cleanupFired = true
      if (raf) cancelAnimationFrame(raf)
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler)
      if (gl && gl.canvas && contextLostHandler) {
        gl.canvas.removeEventListener('webglcontextlost', contextLostHandler, false)
      }
      if (gl) {
        try { gl.getExtension('WEBGL_lose_context')?.loseContext() } catch (e) {}
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="galaxy-container">
      <canvas style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

export default Galaxy
