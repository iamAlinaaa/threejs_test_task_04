import * as THREE from "three";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.audio = new Audio("sounds/sea_breeze.mp3");
    this.audio.loop = true;

    this.gamePause = document.getElementById("game-pause");
    this.gameInfo = document.getElementById("game-info");

    window.addEventListener("click", () => {
      this.camera.controls.lock();
    });

    this.camera.controls.addEventListener("lock", () => {
      this.gameInfo.style.display = "none";
      this.gamePause.style.display = "none";
      this.audio.play();
    });

    this.camera.controls.addEventListener("unlock", () => {
      this.gamePause.style.display = "block";
      this.gameInfo.style.display = "";
      this.audio.pause();
    });

    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.controls.isLocked && this.world.update();
    this.renderer.update();
  }
}
