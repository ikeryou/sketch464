import { MyObject3D } from "../webgl/myObject3D";
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Color } from 'three/src/math/Color';
import { DoubleSide } from 'three/src/constants';
import { Block } from "./block";
import { Func } from '../core/func';
import { Util } from '../libs/util';
import { BlockShader } from "../glsl/blockShader";
import { MousePointer } from "../core/mousePointer";
import { BoxGeometry, SphereGeometry } from "three";

export class BlockList extends MyObject3D {

  private _item: Array<Block> = [];
  private _mat: Array<ShaderMaterial> = [];
  private _scroll: number = 0;

  constructor(opt: {num:number}) {
    super();

    // 必要なマテリアル作っておく
    for(let i = 0; i < 4; i++) {
      this._mat.push(new ShaderMaterial({
        vertexShader:BlockShader.vertexShader,
        fragmentShader:BlockShader.fragmentShader,
        transparent:true,
        depthTest:false,
        side: DoubleSide,
        uniforms:{
          color:{value:new Color(0xffffff)},
          alpha:{value:1},
          time:{value:Util.randomInt(0, 1000)},
        }
      }));
    }

    // const geoFillA = new ConeGeometry(0.5, 2, 28, 8);
    // const geoFillA = new SphereGeometry(0.5, 64, 64);
    const geoFillA = new BoxGeometry(1,1,1);
    const geoFillB = new SphereGeometry(0.5, 12, 12);

    // アイテム
    for(let i = 0; i < opt.num; i++) {
      const item = new Block({
        id: 0,
        matFill: this._mat,
        geoFill: [geoFillA, geoFillB][opt.num == 10 ? 0 : 1],
      });
      this.add(item);
      this._item.push(item);
    }
  }


  protected _update():void {
    super._update();

    // const sw = Func.sw();
    const sh = Func.sh();

    let scroll = Util.map(MousePointer.instance.normal.x, 0, sh * 4, -1, 1)
    this._scroll += (scroll - this._scroll) * 0.1;
    const scrollHeight = sh * 8;
    const num = this._item.length;

    this._item.forEach((val,i) => {
      const rad = Util.radian((360 / this._item.length) * i);
      let radius = Func.val(sh * 0.15, sh * 0.15);

      if(num <= 10) {
        radius *= Util.map(this._scroll, 1, 1.75, 0, scrollHeight - sh);
      } else {
        radius *= Util.map(this._scroll, 0, 2.5, 0, scrollHeight - sh);
      }

      const x = Math.sin(rad) * radius;
      const y = Math.cos(rad) * radius;

      const rad2 = Util.radian((360 / this._item.length) * (i + 1));
      const x2 = Math.sin(rad2) * radius;
      const y2 = Math.cos(rad2) * radius;

      const dx = x - x2;
      const dy = y - y2;
      const d = Math.sqrt(dx * dx + dy * dy);

      let scroll2 = Math.sin(i * 0.1 + this._c * 0.015) * sh
      let ang = scroll2 * 0.1;
      // ang = Math.max(0, ang);

      val.update({
        size: d,
        ang: ang * (num <= 10 ? -1 : -0.5),
      });

      val.position.x = x;
      val.position.y = y;

      const move = 1;
      if(num > 10) val.position.z = Util.map(this._scroll, sh * move, sh * -move, 0, scrollHeight - sh);
      if(num <= 10) val.position.z = Util.map(this._scroll, sh * -move, sh * move, 0, scrollHeight - sh);

      val.rotation.z = Math.atan2(dy, dx);
      if(num > 10) val.rotation.z += Util.radian(Util.map(this._scroll, 0, 720, 0, scrollHeight - sh));
    })

    this._mat.forEach((val) => {
      const uni = val.uniforms;
      uni.time.value += 1;
      // uni.alpha.value = Util.map(this._scroll, 1, 0, 0, scrollHeight - sh);
    })
  }
}