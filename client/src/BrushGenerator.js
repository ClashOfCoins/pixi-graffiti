import * as PIXI from 'pixi.js';

const fragment = `
uniform float size;
uniform float erase;
uniform vec3 color;
uniform float smoothing;

void main(){
	vec2 uv = vec2(gl_FragCoord.xy) / size;
	float dst = distance(uv, vec2(0.5, 0.5)) * 2.;
	float alpha = max(0., 1. - dst);
	alpha = pow(alpha, smoothing);
	if(erase == 0.)
		gl_FragColor = vec4(color, 1) * alpha;
	else
		gl_FragColor = vec4(alpha);
}
`;

export default class BrushGenerator {
	constructor(renderer) {
		this.renderer = renderer;

		this.filter = new PIXI.Filter(null, fragment, {
			color: [1, 1, 1],
			size: 10,
			erase: 0,
			smoothing: 1
		});
	}

	get(size, color, smoothing, isEraser) {
		this.filter.uniforms.size = size;
		this.filter.uniforms.color = this.hexToArray(color);
		this.filter.uniforms.erase = +isEraser;
		this.filter.uniforms.smoothing = smoothing;

		const texture = PIXI.RenderTexture.create({width: size, height: size});
		texture.baseTexture.premultipliedAlpha = true;
		const sprite = new PIXI.Sprite();
		sprite.width = size;
		sprite.height = size;

		sprite.filters = [this.filter];

		this.renderer.render(sprite, texture, false);

		return texture;
	}

	hexToArray(color) {
		const r = color >> 16;
		const g = (color & 0x00ffff) >> 8;
		const b = color & 0x0000ff;

		return [r / 255, g / 255, b / 255];
	}
}
