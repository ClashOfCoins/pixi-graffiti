import * as PIXI from 'pixi.js';

export default class SpritePool {
	constructor() {
		this.sprites = [];
		this.index = 0;
	}

	get() {
		if(this.index < this.sprites.length) {
			return this.sprites[this.index++];
		}

		const sprite = new PIXI.Sprite();
		sprite.anchor.set(0.5);
		this.sprites.push(sprite);

		return sprite;
	}

	reset() {
		this.index = 0;
	}

	destroy() {
		for(let i = 0; i < this.sprites.length; i++)
			this.sprites[i].destroy();
	}
}
