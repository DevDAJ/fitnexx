import { Asset } from "expo-asset";
import { type ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { type FoodInfo, foodInfoAt } from "./foodDb";

const SIZE = 224;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
const CONF_THRESHOLD = 0.2;
const CLASSES = 101;

export interface ScanResult {
  info: FoodInfo;
  confidence: number;
}

let modelPromise: Promise<InferenceSession> | null = null;

function getModel(): Promise<InferenceSession> {
  if (!modelPromise) {
    modelPromise = (async () => {
      const asset = Asset.fromModule(require("../assets/models/food101.onnx"));
      await asset.downloadAsync();
      if (!asset.localUri) {
        throw new Error("Model asset is not readable from disk");
      }
      return InferenceSession.create(asset.localUri, {
        graphOptimizationLevel: "all",
      });
    })();
  }
  return modelPromise;
}

function compileShader(
  gl: ExpoWebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "unknown";
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv;
uniform vec2 uOffset;
uniform vec2 uWindow;
void main() {
  vUv = uOffset + (aPos + 1.0) * 0.5 * uWindow;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `#version 300 es
precision mediump float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTex;
void main() {
  outColor = texture(uTex, vUv);
}`;

// Resize-to-cover then center-crop 224x224, decode pixels via GL, return
// NCHW floats normalized with ImageNet mean/std. Pixels come out top-down.
function decodeToNchw(
  gl: ExpoWebGLRenderingContext,
  uri: string,
  width: number,
  height: number,
): Float32Array {
  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

  const tex = gl.createTexture();
  if (!tex) throw new Error("Failed to create texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, {
    localUri: uri,
  } as unknown as TexImageSource);

  const fbo = gl.createFramebuffer();
  if (!fbo) throw new Error("Failed to create framebuffer");
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  const target = gl.createTexture();
  if (!target) throw new Error("Failed to create target texture");
  gl.bindTexture(gl.TEXTURE_2D, target);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    SIZE,
    SIZE,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    target,
    0,
  );
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`Framebuffer incomplete: ${status}`);
  }

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
  }

  const cover = Math.max(SIZE / width, SIZE / height);
  const wScale = width * cover;
  const hScale = height * cover;

  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
  gl.useProgram(program);
  gl.uniform2f(
    gl.getUniformLocation(program, "uOffset"),
    (wScale - SIZE) / (2 * wScale),
    (hScale - SIZE) / (2 * hScale),
  );
  gl.uniform2f(
    gl.getUniformLocation(program, "uWindow"),
    SIZE / wScale,
    SIZE / hScale,
  );
  gl.uniform1i(gl.getUniformLocation(program, "uTex"), 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.viewport(0, 0, SIZE, SIZE);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.flush();

  const pixels = new Uint8Array(SIZE * SIZE * 4);
  gl.readPixels(0, 0, SIZE, SIZE, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  const count = SIZE * SIZE;
  const input = new Float32Array(3 * count);
  for (let i = 0, p = 0; i < count; i++) {
    const r = pixels[p++] / 255;
    const g = pixels[p++] / 255;
    const b = pixels[p++] / 255;
    p++;
    input[i] = (r - MEAN[0]) / STD[0];
    input[count + i] = (g - MEAN[1]) / STD[1];
    input[2 * count + i] = (b - MEAN[2]) / STD[2];
  }
  return input;
}

/**
 * @returns {ScanResult | null} null when the model was not confident enough.
 */
export async function classifyFood(
  uri: string,
  width: number,
  height: number,
): Promise<ScanResult | null> {
  const gl = await GLView.createContextAsync();
  try {
    const input = decodeToNchw(gl, uri, width, height);
    const session = await getModel();
    const results = await session.run({
      input: new Tensor("float32", input, [1, 3, SIZE, SIZE]),
    });
    const logits = results.output1.data as Float32Array;

    let max = -Infinity;
    for (let i = 0; i < CLASSES; i++) if (logits[i] > max) max = logits[i];
    let sum = 0;
    const probs = new Float32Array(CLASSES);
    for (let i = 0; i < CLASSES; i++) {
      probs[i] = Math.exp(logits[i] - max);
      sum += probs[i];
    }
    let best = 0;
    for (let i = 1; i < CLASSES; i++) if (probs[i] > probs[best]) best = i;
    const confidence = probs[best] / sum;
    if (confidence < CONF_THRESHOLD) return null;

    const info = foodInfoAt(best);
    return info ? { info, confidence } : null;
  } finally {
    await GLView.destroyContextAsync(gl);
  }
}
