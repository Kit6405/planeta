(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
const getPlatformId = (win) => {
  var _a, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return "android";
  } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win) => {
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const getPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const isNativePlatform = () => getPlatform() !== "web";
  const isPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const getPluginHeader = (pluginName) => {
    var _a;
    return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
  };
  const handleError = (err) => win.console.error(err);
  const registeredPlugins = /* @__PURE__ */ new Map();
  const registerPlugin2 = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a, _b;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
        }
      } else if (impl) {
        return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove;
      const wrapper = (...args) => {
        const p = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p2 = fn(...args);
            remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
            return p2;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p.remove = async () => remove();
        }
        return p;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p = new Promise((resolve) => call.then(() => resolve({ remove })));
      p.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          // https://github.com/facebook/react/issues/20030
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
    });
    return proxy;
  };
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  return cap;
};
const initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
const Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor.registerPlugin;
class WebPlugin {
  constructor() {
    this.listeners = {};
    this.retainedEventArguments = {};
    this.windowListeners = {};
  }
  addListener(eventName, listenerFunc) {
    let firstListener = false;
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
      firstListener = true;
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    if (firstListener) {
      this.sendRetainedArgumentsForEvent(eventName);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p = Promise.resolve({ remove });
    return p;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data, retainUntilConsumed) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      if (retainUntilConsumed) {
        let args = this.retainedEventArguments[eventName];
        if (!args) {
          args = [];
        }
        args.push(data);
        this.retainedEventArguments[eventName] = args;
      }
      return;
    }
    listeners.forEach((listener) => listener(data));
  }
  hasListeners(eventName) {
    var _a;
    return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
  sendRetainedArgumentsForEvent(eventName) {
    const args = this.retainedEventArguments[eventName];
    if (!args) {
      return;
    }
    delete this.retainedEventArguments[eventName];
    args.forEach((arg) => {
      this.notifyListeners(eventName, arg);
    });
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(";").forEach((cookie) => {
      if (cookie.length <= 0)
        return;
      let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
      const path = (options.path || "/").replace("path=", "");
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case "json":
        data = await response.json();
        break;
      case "document":
      case "text":
      default:
        data = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  /**
   * Perform an Http GET request given a set of options
   * @param options Options to build the HTTP request
   */
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
  }
  /**
   * Perform an Http POST request given a set of options
   * @param options Options to build the HTTP request
   */
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
  }
  /**
   * Perform an Http PUT request given a set of options
   * @param options Options to build the HTTP request
   */
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
  }
  /**
   * Perform an Http PATCH request given a set of options
   * @param options Options to build the HTTP request
   */
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
  }
  /**
   * Perform an Http DELETE request given a set of options
   * @param options Options to build the HTTP request
   */
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
  }
}
const CapacitorHttp = registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
var SystemBarsStyle;
(function(SystemBarsStyle2) {
  SystemBarsStyle2["Dark"] = "DARK";
  SystemBarsStyle2["Light"] = "LIGHT";
  SystemBarsStyle2["Default"] = "DEFAULT";
})(SystemBarsStyle || (SystemBarsStyle = {}));
var SystemBarType;
(function(SystemBarType2) {
  SystemBarType2["StatusBar"] = "StatusBar";
  SystemBarType2["NavigationBar"] = "NavigationBar";
})(SystemBarType || (SystemBarType = {}));
class SystemBarsPluginWeb extends WebPlugin {
  async setStyle() {
    this.unavailable("not available for web");
  }
  async setAnimation() {
    this.unavailable("not available for web");
  }
  async show() {
    this.unavailable("not available for web");
  }
  async hide() {
    this.unavailable("not available for web");
  }
}
registerPlugin("SystemBars", {
  web: () => new SystemBarsPluginWeb()
});
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const Preferences = registerPlugin("Preferences", {
  web: () => __vitePreload(() => import("./web-COQi6cq6.js"), true ? [] : void 0).then((m) => new m.PreferencesWeb())
});
async function getStore(key, fallback) {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : fallback;
  }
  return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
}
async function setStore(key, value) {
  const str = JSON.stringify(value);
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key, value: str });
  } else {
    localStorage.setItem(key, str);
  }
}
window.store = {
  get: (key, fallback) => getStore(key, fallback),
  set: (key, value) => setStore(key, value)
};
window.dispatchPlanetsUpdated = () => {
  window.dispatchEvent(new CustomEvent("planets:updated"));
};
async function httpGetJson(url) {
  if (Capacitor.isNativePlatform()) {
    const r = await CapacitorHttp.get({ url });
    return r.data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function currentRoutePath() {
  const h = window.location.hash || "#/";
  return h.startsWith("#") ? h.slice(1) : h;
}
class HomePage extends HTMLElement {
  constructor() {
    super();
    this.planetsApi = [];
    this.sortMode = "az";
  }
  mapApiPlanet(p) {
    var _a, _b, _c;
    return {
      name: p.name,
      image: ((_a = p.imgSrc) == null ? void 0 : _a.img) || "",
      description: p.description || "",
      details: {
        mass: ((_b = p.basicDetails) == null ? void 0 : _b.mass) || "",
        volume: ((_c = p.basicDetails) == null ? void 0 : _c.volume) || "",
        wikiLink: p.wikiLink || ""
      },
      __local: false
    };
  }
  async fetchPlanetsData() {
    const loader = document.querySelector("ion-loading");
    await (loader == null ? void 0 : loader.present());
    try {
      const url = Capacitor.isNativePlatform() ? "https://university-api-alpha.vercel.app/api/planets" : "https://corsproxy.io/?https://university-api-alpha.vercel.app/api/planets";
      const data = await httpGetJson(url);
      this.planetsApi = Array.isArray(data) ? data.map((x) => this.mapApiPlanet(x)) : [];
      await setStore("cachedPlanets", this.planetsApi);
    } catch (e) {
      console.error(e);
      this.planetsApi = await getStore("cachedPlanets", []);
      if (!this.planetsApi.length) alert("Не вдалося завантажити дані");
    } finally {
      await (loader == null ? void 0 : loader.dismiss());
    }
  }
  async getAllPlanets() {
    const saved = await getStore("planets", []);
    return this.planetsApi.concat(saved);
  }
  sortPlanets(list) {
    const arr = [...list];
    if (this.sortMode === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortMode === "za") arr.sort((a, b) => b.name.localeCompare(a.name));
    if (this.sortMode === "mass") {
      const num = (v) => {
        const m = String(v ?? "").match(/-?\d+(\.\d+)?/);
        return m ? parseFloat(m[0]) : 0;
      };
      arr.sort((a, b) => {
        var _a, _b;
        return num((_a = b.details) == null ? void 0 : _a.mass) - num((_b = a.details) == null ? void 0 : _b.mass);
      });
    }
    return arr;
  }
  async connectedCallback() {
    await this.fetchPlanetsData();
    await this.render();
    window.addEventListener("planets:updated", () => this.render());
  }
  async render() {
    const all = this.sortPlanets(await this.getAllPlanets());
    const cards = all.map((p) => `
      <ion-col size="12" size-md="6" size-lg="4">
        <a href="#/planet/${encodeURIComponent(p.name)}" style="text-decoration:none;">
          <ion-card>
            ${p.image ? `<ion-img class="planet-img" src="${p.image}" alt="${p.name}"></ion-img>` : ""}
            <ion-card-header><ion-card-title>${p.name}</ion-card-title></ion-card-header>
            <ion-card-content class="muted">${p.description || ""}</ion-card-content>
          </ion-card>
        </a>
      </ion-col>
    `).join("");
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Планети Сонячної системи</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div class="page-wrap">
          <p class="muted">Обери планету або додай власну.</p>

          <ion-segment id="sortSegment" value="${this.sortMode}">
            <ion-segment-button value="az">А → Я</ion-segment-button>
            <ion-segment-button value="za">Я → А</ion-segment-button>
            <ion-segment-button value="mass">За масою</ion-segment-button>
          </ion-segment>

          <ion-grid><ion-row>${cards}</ion-row></ion-grid>
        </div>
      </ion-content>
    `;
    const seg = this.querySelector("#sortSegment");
    seg == null ? void 0 : seg.addEventListener("ionChange", async (e) => {
      this.sortMode = e.detail.value;
      await this.render();
    });
  }
}
class PlanetPage extends HTMLElement {
  connectedCallback() {
    this.renderFromUrl();
    window.addEventListener("hashchange", () => this.renderFromUrl());
  }
  async renderFromUrl() {
    var _a, _b, _c;
    const loader = document.querySelector("ion-loading");
    await (loader == null ? void 0 : loader.present());
    try {
      const path = window.location.hash.slice(1) || "/";
      const parts = path.split("/").filter(Boolean);
      const raw = parts[1] || "";
      const name = decodeURIComponent(raw);
      const saved = await getStore("planets", []);
      const localPlanet = saved.find((p) => (p.name || "").toLowerCase() === name.toLowerCase());
      if (localPlanet) {
        this.renderPlanet(localPlanet);
        return;
      }
      const url = Capacitor.isNativePlatform() ? `https://university-api-alpha.vercel.app/api/planets/${encodeURIComponent(name)}` : `https://corsproxy.io/?https://university-api-alpha.vercel.app/api/planets/${encodeURIComponent(name)}`;
      const planet = await httpGetJson(url);
      const mapped = {
        name: planet.name || name,
        image: ((_a = planet.imgSrc) == null ? void 0 : _a.img) || "",
        description: planet.description || "",
        details: {
          mass: ((_b = planet.basicDetails) == null ? void 0 : _b.mass) || "",
          volume: ((_c = planet.basicDetails) == null ? void 0 : _c.volume) || "",
          wikiLink: planet.wikiLink || ""
        }
      };
      this.renderPlanet(mapped);
    } catch (e) {
      console.error(e);
      this.innerHTML = `
      <ion-header><ion-toolbar><ion-title>Помилка</ion-title></ion-toolbar></ion-header>
      <ion-content class="ion-padding">
        <p>Не вдалося завантажити дані планети.</p>
        <ion-button onclick="window.location.hash='#/';">На головну</ion-button>
      </ion-content>
    `;
    } finally {
      await (loader == null ? void 0 : loader.dismiss());
    }
  }
  renderPlanet(planet) {
    const d = planet.details || {};
    this.innerHTML = `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button onclick="window.location.hash='#/';">
            <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
            Назад
          </ion-button>
        </ion-buttons>
        <ion-title>${planet.name}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="page-wrap">
        <ion-breadcrumbs>
          <ion-breadcrumb href="#/">Головна</ion-breadcrumb>
          <ion-breadcrumb>${planet.name}</ion-breadcrumb>
        </ion-breadcrumbs>

        <ion-card>
          ${planet.image ? `<ion-img src="${planet.image}"></ion-img>` : ""}
          <ion-card-header><ion-card-title>${planet.name}</ion-card-title></ion-card-header>
          <ion-card-content>
            ${planet.description ? `<p class="muted">${planet.description}</p>` : ""}

            <div class="chips">
              ${d.mass ? `<ion-chip><ion-label><b>Маса:</b> ${d.mass}</ion-label></ion-chip>` : ""}
              ${d.volume ? `<ion-chip><ion-label><b>Обʼєм:</b> ${d.volume}</ion-label></ion-chip>` : ""}
            </div>

            ${d.wikiLink ? `<p><a href="${d.wikiLink}" target="_blank">Джерело</a></p>` : ""}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `;
  }
}
class NotFoundPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `“
      <ion-header>
        <ion-toolbar>
          <ion-title>Сторінку не знайдено</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="page-wrap">
          <p>Перейди на головну сторінку.</p>
          <ion-button onclick="document.querySelector('ion-router').push('/');">На головну</ion-button>
        </div>
      </ion-content>
    `;
  }
}
class AboutPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Про застосунок</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div class="page-wrap">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Лабораторна — Ionic</ion-card-title>
            </ion-card-header>
            <ion-card-content class="muted">
              <p>
  Цей застосунок демонструє роботу з бібліотекою компонентів <b>Ionic Core</b> у статичній HTML-сторінці.
</p>
<p>
  На головній сторінці відображається список планет у вигляді карток, реалізований через
  <b>ion-grid / ion-row / ion-col</b> та <b>ion-card</b>.
</p>
<p>
  Для кожної планети доступна детальна сторінка з навігацією та інтерактивними елементами:
  <b>ion-breadcrumbs</b>, <b>ion-chip</b>, <b>ion-accordion</b>.
</p>
<p>
  Додатково реалізовано інтерактивність: додавання нових планет через модальне вікно
  (<b>ion-modal</b>), збереження даних у <b>localStorage</b> та сортування списку.
</p>
<p class="muted">
  Проєкт виконано як один безперервний застосунок, де кожне наступне завдання розширює попередній функціонал.
</p>

            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    `;
  }
}
customElements.define("page-home", HomePage);
customElements.define("page-planet", PlanetPage);
customElements.define("page-not-found", NotFoundPage);
customElements.define("page-about", AboutPage);
window.addEventListener("DOMContentLoaded", () => {
  const router = document.querySelector("#router").push("/");
  if (router && typeof router.push === "function") {
    router.push(currentRoutePath() || "/");
  }
});
const addPlanetModal = document.querySelector('ion-modal[trigger="add-planet-modal"]');
const closeBtn = addPlanetModal.querySelector("#close-add-planet-modal");
const confirmBtn = addPlanetModal.querySelector("#confirm-add-planet");
closeBtn.addEventListener("click", async () => {
  await addPlanetModal.dismiss();
});
confirmBtn.addEventListener("click", async () => {
  const name = addPlanetModal.querySelector("#planetName").value.trim();
  const image = addPlanetModal.querySelector("#planetImage").value.trim();
  const description = addPlanetModal.querySelector("#planetDescription").value.trim();
  if (!name || !image || !description) {
    alert("Заповніть обовʼязкові поля");
    return;
  }
  const newPlanet = {
    name,
    image,
    description,
    details: {
      temperature: addPlanetModal.querySelector("#planetTemperature").value.trim(),
      mass: addPlanetModal.querySelector("#planetMass").value.trim(),
      atmosphere: addPlanetModal.querySelector("#planetAtmosphere").value.trim(),
      satellites: addPlanetModal.querySelector("#planetSatellites").value.split(",").map((s) => s.trim()),
      missions: addPlanetModal.querySelector("#planetMissions").value.split(",").map((m) => m.trim())
    }
  };
  const saved = JSON.parse(localStorage.getItem("planets")) || [];
  saved.push(newPlanet);
  localStorage.setItem("planets", JSON.stringify(saved));
  await addPlanetModal.dismiss();
  const home = document.querySelector("page-home");
  if (home) home.connectedCallback();
});
export {
  WebPlugin as W
};
