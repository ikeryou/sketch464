const ImgEffectShader = {
  uniforms: {},

  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,

  fragmentShader: /* glsl */ `
    uniform sampler2D tex;
    uniform vec2 range;

    varying vec2 vUv;

    void main(void) {
      float dist = distance(vUv, vec2(0.0, 0.0));
      float dist2 = distance(vUv, vec2(1.0, 1.0));
      // if((vUv.y < range.x || vUv.y > range.y) && (dist < range.x || dist > range.y)) {
      if((dist2 < range.x || dist2 > range.y) && (dist < range.x || dist > range.y)) {
        discard;
      }

      vec4 dest = texture2D(tex, vUv);
      gl_FragColor = dest;
    }`,
}

export { ImgEffectShader }
