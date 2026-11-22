const BASE = '/news/iride';
const DWELL = 80;
const TOGETHER = 6;
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const library = fetch(`${BASE}/libiride.wasm`).then((r) => r.arrayBuffer()).then((b) => WebAssembly.compile(b));
const align = (n) => (n + 15) & ~15;
const deviceSize = (css) => Math.round(css * Math.max(1, devicePixelRatio || 1));

async function get(path) {
  const response = await fetch(`${BASE}/${path}`);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

function straight(src, out) {
  for (let i = 0; i < src.length; i += 4) {
    const a = src[i + 3];
    const f = a ? 255 / a : 0;
    out[i] = src[i + 2] * f;
    out[i + 1] = src[i + 1] * f;
    out[i + 2] = src[i] * f;
    out[i + 3] = a;
  }
}

class Iride {
  constructor(data, instance) {
    this.api = instance.exports;
    this.len = data.length;
    this.at = this.api.memory.buffer.byteLength;
    this.info = align(this.at + this.len);
    this.reserve(this.info + 64);
    new Uint8Array(this.api.memory.buffer).set(data, this.at);
    if (this.api.iride_check(this.at, this.len) < 0) throw new Error('Not an Iride file');
  }

  reserve(end) {
    const short = end - this.api.memory.buffer.byteLength;
    if (short > 0) this.api.memory.grow(Math.ceil(short / 65536));
  }

  word(offset) {
    return new DataView(this.api.memory.buffer).getUint32(this.info + offset, true);
  }

  still(pixels) {
    const i = this.info;
    if (this.api.iride_pick(this.at, this.len, pixels, i, i + 4, i + 8) < 0) return null;
    const png = new Uint8Array(this.api.memory.buffer, this.word(0), this.word(4)).slice();
    return createImageBitmap(new Blob([png], { type: 'image/png' }));
  }

  motion(pixels) {
    const i = this.info;
    if (this.api.iride_motion(this.at, this.len, pixels, i + 12, i + 16, i + 20) < 0) return null;
    const duration = this.word(12);
    const side = this.word(16);
    const length = this.word(20);
    const work = i + 64;
    const out = align(work + length);
    const size = side * side * 4;
    this.reserve(out + size);
    if (this.api.iride_prepare(this.at, this.len, pixels, work, length) < 0) return null;
    const image = new ImageData(side, side);
    const frame = (msec) => {
      if (this.api.iride_frame(this.at, this.len, pixels, msec, work, length, out, size) !== 0) return null;
      straight(new Uint8Array(this.api.memory.buffer, out, size), image.data);
      return image;
    };
    return { duration, frame };
  }
}

async function openIcon(id, folder = 'icons') {
  return new Iride(await get(`${folder}/${id}.iride`), await WebAssembly.instantiate(await library, {}));
}

function paint(canvas, image) {
  if (canvas.width !== image.width || canvas.height !== image.height) {
    canvas.width = image.width;
    canvas.height = image.height;
  }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (image instanceof ImageData) ctx.putImageData(image, 0, 0);
  else ctx.drawImage(image, 0, 0);
}

let running = 0;
const queue = [];

function schedule(job) {
  queue.push(job);
  pump();
}

async function pump() {
  if (running >= TOGETHER || !queue.length) return;
  running++;
  try {
    await queue.shift()();
  } finally {
    running--;
    pump();
  }
}

class Icon {
  constructor(canvas) {
    this.canvas = canvas;
    this.id = canvas.dataset.iride;
    this.folder = canvas.closest('[data-family]') ? 'family' : 'hero';
    this.largest = this.folder === 'family' ? 192 : 384;
    this.visible = false;
    this.busy = false;
    this.shown = false;
  }

  pixels() {
    return Math.min(this.largest, deviceSize(this.canvas.clientWidth));
  }

  async play() {
    if (this.busy) return;
    this.busy = true;
    try {
      const file = await openIcon(this.id, this.folder);
      const pixels = this.pixels();
      const still = await file.still(pixels);
      const motion = calm.matches ? null : file.motion(Math.min(256, pixels));
      if (motion && this.visible) await this.run(motion);
      paint(this.canvas, still);
      still.close();
      this.shown = true;
      this.canvas.dataset.ready = '';
    } catch (error) {
      this.canvas.dataset.failed = '';
      console.error(this.id, error);
    } finally {
      this.busy = false;
    }
  }

  run(motion) {
    return new Promise((done) => {
      let start;
      const step = (now) => {
        start ??= now;
        const image = this.visible ? motion.frame(now - start) : null;
        if (!image) return done();
        paint(this.canvas, image);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
}

function setupIcons() {
  const icons = new Map([...document.querySelectorAll('canvas[data-iride]')].map((c) => [c, new Icon(c)]));
  const seen = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const icon = icons.get(target);
      icon.visible = isIntersecting;
      if (!isIntersecting || icon.shown) continue;
      schedule(() => (icon.visible && !icon.shown ? icon.play() : undefined));
    }
  });
  for (const [canvas, icon] of icons) {
    seen.observe(canvas);
    const button = canvas.closest('button');
    if (!button) continue;
    let dwell;
    button.addEventListener('click', () => icon.play());
    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') dwell = setTimeout(() => icon.play(), DWELL);
    });
    button.addEventListener('pointerleave', () => clearTimeout(dwell));
  }
  document.querySelector('[data-play-visible]').addEventListener('click', () => {
    for (const [canvas, icon] of icons) {
      if (icon.visible && canvas.closest('[data-family]')) schedule(() => icon.play());
    }
  });
}

async function setupLab() {
  const lab = document.querySelector('[data-lab]');
  const big = lab.querySelector('[data-stage]');
  const time = lab.querySelector('input[type=range]');
  const readout = lab.querySelector('output');
  const sizes = [...lab.querySelectorAll('canvas[data-size]')];
  let still, motion, turn = 0, raf = 0;

  const show = () => {
    if (!still) return;
    const image = motion && +time.value < motion.duration ? motion.frame(+time.value) : null;
    paint(big, image ?? still);
    readout.value = `${Math.round(+time.value)} ms`;
  };
  const play = () => {
    cancelAnimationFrame(raf);
    if (!motion) return;
    if (calm.matches) {
      time.value = motion.duration;
      return show();
    }
    let start;
    const step = (now) => {
      start ??= now;
      time.value = Math.min(motion.duration, now - start);
      show();
      if (now - start < motion.duration) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  const choose = async (button) => {
    const mine = ++turn;
    for (const b of lab.querySelectorAll('[data-pick]')) b.setAttribute('aria-pressed', String(b === button));
    const file = await openIcon(button.dataset.pick);
    const pixels = Math.min(256, deviceSize(big.clientWidth));
    const image = await file.still(pixels);
    if (mine !== turn) return;
    still = image;
    motion = file.motion(pixels);
    time.max = motion.duration;
    time.value = motion.duration;
    show();
    for (const canvas of sizes) {
      const side = +canvas.dataset.size;
      const bitmap = await file.still(side);
      if (mine !== turn) return;
      paint(canvas, bitmap);
      canvas.style.width = canvas.style.height = `${side / Math.max(1, devicePixelRatio)}px`;
    }
    lab.dataset.ready = '';
    play();
  };
  time.addEventListener('input', () => {
    cancelAnimationFrame(raf);
    show();
  });
  lab.querySelector('[data-replay]').addEventListener('click', play);
  for (const button of lab.querySelectorAll('[data-pick]')) button.addEventListener('click', () => choose(button));
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    choose(lab.querySelector('[data-pick]'));
  }, { threshold: 0.2 }).observe(lab);
}

async function cursorFrames(name, pixels) {
  let bytes = await get(`cursors/${name}.gz`);
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    const unpacked = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    bytes = new Uint8Array(await new Response(unpacked).arrayBuffer());
  }
  const view = new DataView(bytes.buffer);
  if (view.getUint32(0, true) !== 0x72756358) throw new Error(`${name} is not an XCursor file`);
  const header = view.getUint32(4, true);
  const images = [];
  for (let i = 0; i < view.getUint32(12, true); i++) {
    const entry = header + i * 12;
    if (view.getUint32(entry, true) === 0xfffd0002) images.push({ size: view.getUint32(entry + 4, true), at: view.getUint32(entry + 8, true) });
  }
  const sizes = [...new Set(images.map((i) => i.size))].sort((a, b) => a - b);
  const size = sizes.find((s) => s >= pixels) ?? sizes.at(-1);
  return images.filter((i) => i.size === size).map(({ at }) => {
    const width = view.getUint32(at + 16, true);
    const height = view.getUint32(at + 20, true);
    const image = new ImageData(width, height);
    straight(bytes.subarray(at + 36, at + 36 + width * height * 4), image.data);
    return { image, delay: view.getUint32(at + 32, true) };
  });
}

function setupCursor(button) {
  const canvas = button.querySelector('canvas');
  const { cursor: id } = button.dataset;
  const files = new Map();
  let visible = false, turn = 0, still;
  const load = (name) => {
    if (!files.has(name)) files.set(name, cursorFrames(name, Math.min(96, deviceSize(canvas.clientWidth))));
    return files.get(name);
  };
  const run = async (frames, mine) => {
    for (const { image, delay } of frames) {
      if (mine !== turn || !visible) return;
      paint(canvas, image);
      await new Promise((done) => setTimeout(done, delay));
    }
  };
  const play = async (gesture) => {
    const mine = ++turn;
    try {
      still ??= await load(id);
      button.dataset.ready = '';
      if (!calm.matches) await run(await load(`${id}-${gesture}`), mine);
      while (!calm.matches && visible && mine === turn && 'loop' in button.dataset) await run(still, mine);
      if (mine === turn) paint(canvas, still[0].image);
    } catch (error) {
      button.dataset.failed = '';
      console.error(id, error);
    }
  };
  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') play('enter');
  });
  button.addEventListener('click', () => play('press' in button.dataset ? 'press' : 'enter'));
  new IntersectionObserver(([entry]) => {
    const entered = entry.isIntersecting && !visible;
    visible = entry.isIntersecting;
    if (entered && (!still || 'loop' in button.dataset)) play('enter');
  }).observe(button);
}

async function setupNeon() {
  const title = document.querySelector('[data-neon]');
  try {
    const letters = await Promise.all([...title.querySelectorAll('canvas')].map(async (canvas) => {
      const file = await openIcon(canvas.dataset.letter, 'title');
      const pixels = Math.min(512, deviceSize(canvas.clientWidth));
      return { canvas, at: +canvas.dataset.at, still: await file.still(pixels), motion: file.motion(Math.min(256, pixels)) };
    }));
    let raf = 0;
    const play = () => {
      cancelAnimationFrame(raf);
      if (calm.matches) {
        for (const { canvas, still } of letters) paint(canvas, still);
        return;
      }
      let start;
      const step = (now) => {
        start ??= now;
        let moving = false;
        for (const { canvas, at, still, motion } of letters) {
          const image = motion?.frame(Math.max(0, now - start - at));
          paint(canvas, image ?? still);
          moving ||= !!image;
        }
        if (moving) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    title.addEventListener('click', play);
    title.dataset.ready = '';
    play();
  } catch (error) {
    title.dataset.failed = '';
    console.error('title', error);
  }
}

setupNeon();
setupIcons();
setupLab();
document.querySelectorAll('[data-cursor]').forEach(setupCursor);
