import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import gui from "lil-gui"; // Importing a GUI library
import gsap from "gsap";
import cursor from "./cursor";
// Importing the GreenSock Animation Platform

const colors = require("nice-color-palettes");
const idx = Math.floor(Math.random() * colors.length);
// idx = 19;
let palette = colors[idx];

palette = palette.map((color) => new THREE.Color(color));

// Change the colors as required, must have 5 or it breaks.
// const colorArray = ["#BEEF9E", "#6E8898", "#A6C36F", "#1E352F", "#5A2328"];

// Creating a palette of THREE.Color instances from the hex values
// const palette = colorArray.map((color) => new THREE.Color(color));

export default class Sketch {
  constructor(options) {
    // Setting up the Three.js scene, renderer, camera, and other components
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 0.52);

    // Setting up OrbitControls for easy camera manipulation
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    // Setting up loaders for GLTF models and Draco geometry compression
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/s"
    );
    this.gltf = new GLTFLoader();
    this.gltf.setDRACOLoader(this.dracoLoader);

    this.isPlaying = true;

    // Adding objects, lights, and setting up the scene
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  // Optional settings function for GUI controls (commented out in this case)
  // settings() {
  //   this.settings = {
  //     progress: 0,
  //   };
  //   this.gui = new dat.GUI();
  //   this.gui.add(this.settings, "progress", 0, 1, 0.01);
  // }

  // Handling window resize events
  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  // Adjusting dimensions on window resize
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  // Adding the shader material and plane geometry to the scene
  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        uColor: { value: palette },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1.5, 1.5, 300, 300);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  // Adding ambient and directional lights to the scene
  addLights() {
    const light1 = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(0.5, 0, 0.866);
    this.scene.add(light2);
  }

  // Stopping the animation loop
  stop() {
    this.isPlaying = false;
  }

  // Starting or resuming the animation loop
  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  // Animation loop for rendering frames
  render() {
    if (!this.isPlaying) return;
    this.time += 0.00009;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// Creating an instance of the Sketch class and initializing it
new Sketch({
  dom: document.getElementById("container"),
});
