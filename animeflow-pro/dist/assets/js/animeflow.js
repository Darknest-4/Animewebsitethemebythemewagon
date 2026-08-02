(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/bootstrap/js/dist/dom/data.js
  var require_data = __commonJS({
    "node_modules/bootstrap/js/dist/dom/data.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Data = factory());
      })(exports, (function() {
        "use strict";
        const elementMap = /* @__PURE__ */ new Map();
        const data = {
          set(element, key, instance) {
            if (!elementMap.has(element)) {
              elementMap.set(element, /* @__PURE__ */ new Map());
            }
            const instanceMap = elementMap.get(element);
            if (!instanceMap.has(key) && instanceMap.size !== 0) {
              console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
              return;
            }
            instanceMap.set(key, instance);
          },
          get(element, key) {
            if (elementMap.has(element)) {
              return elementMap.get(element).get(key) || null;
            }
            return null;
          },
          remove(element, key) {
            if (!elementMap.has(element)) {
              return;
            }
            const instanceMap = elementMap.get(element);
            instanceMap.delete(key);
            if (instanceMap.size === 0) {
              elementMap.delete(element);
            }
          }
        };
        return data;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/util/index.js
  var require_util = __commonJS({
    "node_modules/bootstrap/js/dist/util/index.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Index = {}));
      })(exports, (function(exports2) {
        "use strict";
        const MAX_UID = 1e6;
        const MILLISECONDS_MULTIPLIER = 1e3;
        const TRANSITION_END = "transitionend";
        const parseSelector = (selector) => {
          if (selector && window.CSS && window.CSS.escape) {
            selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
          }
          return selector;
        };
        const toType = (object) => {
          if (object === null || object === void 0) {
            return `${object}`;
          }
          return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
        };
        const getUID = (prefix) => {
          do {
            prefix += Math.floor(Math.random() * MAX_UID);
          } while (document.getElementById(prefix));
          return prefix;
        };
        const getTransitionDurationFromElement = (element) => {
          if (!element) {
            return 0;
          }
          let {
            transitionDuration,
            transitionDelay
          } = window.getComputedStyle(element);
          const floatTransitionDuration = Number.parseFloat(transitionDuration);
          const floatTransitionDelay = Number.parseFloat(transitionDelay);
          if (!floatTransitionDuration && !floatTransitionDelay) {
            return 0;
          }
          transitionDuration = transitionDuration.split(",")[0];
          transitionDelay = transitionDelay.split(",")[0];
          return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
        };
        const triggerTransitionEnd = (element) => {
          element.dispatchEvent(new Event(TRANSITION_END));
        };
        const isElement = (object) => {
          if (!object || typeof object !== "object") {
            return false;
          }
          if (typeof object.jquery !== "undefined") {
            object = object[0];
          }
          return typeof object.nodeType !== "undefined";
        };
        const getElement = (object) => {
          if (isElement(object)) {
            return object.jquery ? object[0] : object;
          }
          if (typeof object === "string" && object.length > 0) {
            return document.querySelector(parseSelector(object));
          }
          return null;
        };
        const isVisible = (element) => {
          if (!isElement(element) || element.getClientRects().length === 0) {
            return false;
          }
          const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
          const closedDetails = element.closest("details:not([open])");
          if (!closedDetails) {
            return elementIsVisible;
          }
          if (closedDetails !== element) {
            const summary = element.closest("summary");
            if (summary && summary.parentNode !== closedDetails) {
              return false;
            }
            if (summary === null) {
              return false;
            }
          }
          return elementIsVisible;
        };
        const isDisabled = (element) => {
          if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return true;
          }
          if (element.classList.contains("disabled")) {
            return true;
          }
          if (typeof element.disabled !== "undefined") {
            return element.disabled;
          }
          return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
        };
        const findShadowRoot = (element) => {
          if (!document.documentElement.attachShadow) {
            return null;
          }
          if (typeof element.getRootNode === "function") {
            const root = element.getRootNode();
            return root instanceof ShadowRoot ? root : null;
          }
          if (element instanceof ShadowRoot) {
            return element;
          }
          if (!element.parentNode) {
            return null;
          }
          return findShadowRoot(element.parentNode);
        };
        const noop = () => {
        };
        const reflow = (element) => {
          element.offsetHeight;
        };
        const getjQuery = () => {
          if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
            return window.jQuery;
          }
          return null;
        };
        const DOMContentLoadedCallbacks = [];
        const onDOMContentLoaded = (callback) => {
          if (document.readyState === "loading") {
            if (!DOMContentLoadedCallbacks.length) {
              document.addEventListener("DOMContentLoaded", () => {
                for (const callback2 of DOMContentLoadedCallbacks) {
                  callback2();
                }
              });
            }
            DOMContentLoadedCallbacks.push(callback);
          } else {
            callback();
          }
        };
        const isRTL = () => document.documentElement.dir === "rtl";
        const defineJQueryPlugin = (plugin) => {
          onDOMContentLoaded(() => {
            const $2 = getjQuery();
            if ($2) {
              const name = plugin.NAME;
              const JQUERY_NO_CONFLICT = $2.fn[name];
              $2.fn[name] = plugin.jQueryInterface;
              $2.fn[name].Constructor = plugin;
              $2.fn[name].noConflict = () => {
                $2.fn[name] = JQUERY_NO_CONFLICT;
                return plugin.jQueryInterface;
              };
            }
          });
        };
        const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
          return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
        };
        const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
          if (!waitForTransition) {
            execute(callback);
            return;
          }
          const durationPadding = 5;
          const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
          let called = false;
          const handler = ({
            target
          }) => {
            if (target !== transitionElement) {
              return;
            }
            called = true;
            transitionElement.removeEventListener(TRANSITION_END, handler);
            execute(callback);
          };
          transitionElement.addEventListener(TRANSITION_END, handler);
          setTimeout(() => {
            if (!called) {
              triggerTransitionEnd(transitionElement);
            }
          }, emulatedDuration);
        };
        const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
          const listLength = list.length;
          let index = list.indexOf(activeElement);
          if (index === -1) {
            return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
          }
          index += shouldGetNext ? 1 : -1;
          if (isCycleAllowed) {
            index = (index + listLength) % listLength;
          }
          return list[Math.max(0, Math.min(index, listLength - 1))];
        };
        exports2.defineJQueryPlugin = defineJQueryPlugin;
        exports2.execute = execute;
        exports2.executeAfterTransition = executeAfterTransition;
        exports2.findShadowRoot = findShadowRoot;
        exports2.getElement = getElement;
        exports2.getNextActiveElement = getNextActiveElement;
        exports2.getTransitionDurationFromElement = getTransitionDurationFromElement;
        exports2.getUID = getUID;
        exports2.getjQuery = getjQuery;
        exports2.isDisabled = isDisabled;
        exports2.isElement = isElement;
        exports2.isRTL = isRTL;
        exports2.isVisible = isVisible;
        exports2.noop = noop;
        exports2.onDOMContentLoaded = onDOMContentLoaded;
        exports2.parseSelector = parseSelector;
        exports2.reflow = reflow;
        exports2.toType = toType;
        exports2.triggerTransitionEnd = triggerTransitionEnd;
        Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
      }));
    }
  });

  // node_modules/bootstrap/js/dist/dom/event-handler.js
  var require_event_handler = __commonJS({
    "node_modules/bootstrap/js/dist/dom/event-handler.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.EventHandler = factory(global.Index));
      })(exports, (function(index_js) {
        "use strict";
        const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
        const stripNameRegex = /\..*/;
        const stripUidRegex = /::\d+$/;
        const eventRegistry = {};
        let uidEvent = 1;
        const customEvents = {
          mouseenter: "mouseover",
          mouseleave: "mouseout"
        };
        const nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
        function makeEventUid(element, uid) {
          return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
        }
        function getElementEvents(element) {
          const uid = makeEventUid(element);
          element.uidEvent = uid;
          eventRegistry[uid] = eventRegistry[uid] || {};
          return eventRegistry[uid];
        }
        function bootstrapHandler(element, fn) {
          return function handler(event) {
            hydrateObj(event, {
              delegateTarget: element
            });
            if (handler.oneOff) {
              EventHandler.off(element, event.type, fn);
            }
            return fn.apply(element, [event]);
          };
        }
        function bootstrapDelegationHandler(element, selector, fn) {
          return function handler(event) {
            const domElements = element.querySelectorAll(selector);
            for (let {
              target
            } = event; target && target !== this; target = target.parentNode) {
              for (const domElement of domElements) {
                if (domElement !== target) {
                  continue;
                }
                hydrateObj(event, {
                  delegateTarget: target
                });
                if (handler.oneOff) {
                  EventHandler.off(element, event.type, selector, fn);
                }
                return fn.apply(target, [event]);
              }
            }
          };
        }
        function findHandler(events, callable, delegationSelector = null) {
          return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
        }
        function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
          const isDelegated = typeof handler === "string";
          const callable = isDelegated ? delegationFunction : handler || delegationFunction;
          let typeEvent = getTypeEvent(originalTypeEvent);
          if (!nativeEvents.has(typeEvent)) {
            typeEvent = originalTypeEvent;
          }
          return [isDelegated, callable, typeEvent];
        }
        function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
          if (typeof originalTypeEvent !== "string" || !element) {
            return;
          }
          let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
          if (originalTypeEvent in customEvents) {
            const wrapFunction = (fn2) => {
              return function(event) {
                if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
                  return fn2.call(this, event);
                }
              };
            };
            callable = wrapFunction(callable);
          }
          const events = getElementEvents(element);
          const handlers = events[typeEvent] || (events[typeEvent] = {});
          const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
          if (previousFunction) {
            previousFunction.oneOff = previousFunction.oneOff && oneOff;
            return;
          }
          const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
          const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
          fn.delegationSelector = isDelegated ? handler : null;
          fn.callable = callable;
          fn.oneOff = oneOff;
          fn.uidEvent = uid;
          handlers[uid] = fn;
          element.addEventListener(typeEvent, fn, isDelegated);
        }
        function removeHandler(element, events, typeEvent, handler, delegationSelector) {
          const fn = findHandler(events[typeEvent], handler, delegationSelector);
          if (!fn) {
            return;
          }
          element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
          delete events[typeEvent][fn.uidEvent];
        }
        function removeNamespacedHandlers(element, events, typeEvent, namespace) {
          const storeElementEvent = events[typeEvent] || {};
          for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
            if (handlerKey.includes(namespace)) {
              removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
            }
          }
        }
        function getTypeEvent(event) {
          event = event.replace(stripNameRegex, "");
          return customEvents[event] || event;
        }
        const EventHandler = {
          on(element, event, handler, delegationFunction) {
            addHandler(element, event, handler, delegationFunction, false);
          },
          one(element, event, handler, delegationFunction) {
            addHandler(element, event, handler, delegationFunction, true);
          },
          off(element, originalTypeEvent, handler, delegationFunction) {
            if (typeof originalTypeEvent !== "string" || !element) {
              return;
            }
            const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
            const inNamespace = typeEvent !== originalTypeEvent;
            const events = getElementEvents(element);
            const storeElementEvent = events[typeEvent] || {};
            const isNamespace = originalTypeEvent.startsWith(".");
            if (typeof callable !== "undefined") {
              if (!Object.keys(storeElementEvent).length) {
                return;
              }
              removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
              return;
            }
            if (isNamespace) {
              for (const elementEvent of Object.keys(events)) {
                removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
              }
            }
            for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
              const handlerKey = keyHandlers.replace(stripUidRegex, "");
              if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
                removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
              }
            }
          },
          trigger(element, event, args) {
            if (typeof event !== "string" || !element) {
              return null;
            }
            const $2 = index_js.getjQuery();
            const typeEvent = getTypeEvent(event);
            const inNamespace = event !== typeEvent;
            let jQueryEvent = null;
            let bubbles = true;
            let nativeDispatch = true;
            let defaultPrevented = false;
            if (inNamespace && $2) {
              jQueryEvent = $2.Event(event, args);
              $2(element).trigger(jQueryEvent);
              bubbles = !jQueryEvent.isPropagationStopped();
              nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
              defaultPrevented = jQueryEvent.isDefaultPrevented();
            }
            const evt = hydrateObj(new Event(event, {
              bubbles,
              cancelable: true
            }), args);
            if (defaultPrevented) {
              evt.preventDefault();
            }
            if (nativeDispatch) {
              element.dispatchEvent(evt);
            }
            if (evt.defaultPrevented && jQueryEvent) {
              jQueryEvent.preventDefault();
            }
            return evt;
          }
        };
        function hydrateObj(obj, meta = {}) {
          for (const [key, value] of Object.entries(meta)) {
            try {
              obj[key] = value;
            } catch (_unused) {
              Object.defineProperty(obj, key, {
                configurable: true,
                get() {
                  return value;
                }
              });
            }
          }
          return obj;
        }
        return EventHandler;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/dom/manipulator.js
  var require_manipulator = __commonJS({
    "node_modules/bootstrap/js/dist/dom/manipulator.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Manipulator = factory());
      })(exports, (function() {
        "use strict";
        function normalizeData(value) {
          if (value === "true") {
            return true;
          }
          if (value === "false") {
            return false;
          }
          if (value === Number(value).toString()) {
            return Number(value);
          }
          if (value === "" || value === "null") {
            return null;
          }
          if (typeof value !== "string") {
            return value;
          }
          try {
            return JSON.parse(decodeURIComponent(value));
          } catch (_unused) {
            return value;
          }
        }
        function normalizeDataKey(key) {
          return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
        }
        const Manipulator = {
          setDataAttribute(element, key, value) {
            element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
          },
          removeDataAttribute(element, key) {
            element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
          },
          getDataAttributes(element) {
            if (!element) {
              return {};
            }
            const attributes = {};
            const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
            for (const key of bsKeys) {
              let pureKey = key.replace(/^bs/, "");
              pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
              attributes[pureKey] = normalizeData(element.dataset[key]);
            }
            return attributes;
          },
          getDataAttribute(element, key) {
            return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
          }
        };
        return Manipulator;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/util/config.js
  var require_config = __commonJS({
    "node_modules/bootstrap/js/dist/util/config.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/manipulator", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Config = factory(global.Manipulator, global.Index));
      })(exports, (function(Manipulator, index_js) {
        "use strict";
        class Config {
          // Getters
          static get Default() {
            return {};
          }
          static get DefaultType() {
            return {};
          }
          static get NAME() {
            throw new Error('You have to implement the static method "NAME", for each component!');
          }
          _getConfig(config) {
            config = this._mergeConfigObj(config);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
          }
          _configAfterMerge(config) {
            return config;
          }
          _mergeConfigObj(config, element) {
            const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
            return {
              ...this.constructor.Default,
              ...typeof jsonConfig === "object" ? jsonConfig : {},
              ...index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {},
              ...typeof config === "object" ? config : {}
            };
          }
          _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
            for (const [property, expectedTypes] of Object.entries(configTypes)) {
              const value = config[property];
              const valueType = index_js.isElement(value) ? "element" : index_js.toType(value);
              if (!new RegExp(expectedTypes).test(valueType)) {
                throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
              }
            }
          }
        }
        return Config;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/base-component.js
  var require_base_component = __commonJS({
    "node_modules/bootstrap/js/dist/base-component.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_data(), require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define(["./dom/data", "./dom/event-handler", "./util/config", "./util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.BaseComponent = factory(global.Data, global.EventHandler, global.Config, global.Index));
      })(exports, (function(Data, EventHandler, Config, index_js) {
        "use strict";
        const VERSION = "5.3.8";
        class BaseComponent extends Config {
          constructor(element, config) {
            super();
            element = index_js.getElement(element);
            if (!element) {
              return;
            }
            this._element = element;
            this._config = this._getConfig(config);
            Data.set(this._element, this.constructor.DATA_KEY, this);
          }
          // Public
          dispose() {
            Data.remove(this._element, this.constructor.DATA_KEY);
            EventHandler.off(this._element, this.constructor.EVENT_KEY);
            for (const propertyName of Object.getOwnPropertyNames(this)) {
              this[propertyName] = null;
            }
          }
          // Private
          _queueCallback(callback, element, isAnimated = true) {
            index_js.executeAfterTransition(callback, element, isAnimated);
          }
          _getConfig(config) {
            config = this._mergeConfigObj(config, this._element);
            config = this._configAfterMerge(config);
            this._typeCheckConfig(config);
            return config;
          }
          // Static
          static getInstance(element) {
            return Data.get(index_js.getElement(element), this.DATA_KEY);
          }
          static getOrCreateInstance(element, config = {}) {
            return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
          }
          static get VERSION() {
            return VERSION;
          }
          static get DATA_KEY() {
            return `bs.${this.NAME}`;
          }
          static get EVENT_KEY() {
            return `.${this.DATA_KEY}`;
          }
          static eventName(name) {
            return `${name}${this.EVENT_KEY}`;
          }
        }
        return BaseComponent;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/dom/selector-engine.js
  var require_selector_engine = __commonJS({
    "node_modules/bootstrap/js/dist/dom/selector-engine.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SelectorEngine = factory(global.Index));
      })(exports, (function(index_js) {
        "use strict";
        const getSelector = (element) => {
          let selector = element.getAttribute("data-bs-target");
          if (!selector || selector === "#") {
            let hrefAttribute = element.getAttribute("href");
            if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
              return null;
            }
            if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
              hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
            }
            selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
          }
          return selector ? selector.split(",").map((sel) => index_js.parseSelector(sel)).join(",") : null;
        };
        const SelectorEngine = {
          find(selector, element = document.documentElement) {
            return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
          },
          findOne(selector, element = document.documentElement) {
            return Element.prototype.querySelector.call(element, selector);
          },
          children(element, selector) {
            return [].concat(...element.children).filter((child) => child.matches(selector));
          },
          parents(element, selector) {
            const parents = [];
            let ancestor = element.parentNode.closest(selector);
            while (ancestor) {
              parents.push(ancestor);
              ancestor = ancestor.parentNode.closest(selector);
            }
            return parents;
          },
          prev(element, selector) {
            let previous = element.previousElementSibling;
            while (previous) {
              if (previous.matches(selector)) {
                return [previous];
              }
              previous = previous.previousElementSibling;
            }
            return [];
          },
          // TODO: this is now unused; remove later along with prev()
          next(element, selector) {
            let next = element.nextElementSibling;
            while (next) {
              if (next.matches(selector)) {
                return [next];
              }
              next = next.nextElementSibling;
            }
            return [];
          },
          focusableChildren(element) {
            const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
            return this.find(focusables, element).filter((el) => !index_js.isDisabled(el) && index_js.isVisible(el));
          },
          getSelectorFromElement(element) {
            const selector = getSelector(element);
            if (selector) {
              return SelectorEngine.findOne(selector) ? selector : null;
            }
            return null;
          },
          getElementFromSelector(element) {
            const selector = getSelector(element);
            return selector ? SelectorEngine.findOne(selector) : null;
          },
          getMultipleElementsFromSelector(element) {
            const selector = getSelector(element);
            return selector ? SelectorEngine.find(selector) : [];
          }
        };
        return SelectorEngine;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/util/backdrop.js
  var require_backdrop = __commonJS({
    "node_modules/bootstrap/js/dist/util/backdrop.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/event-handler", "./config", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Backdrop = factory(global.EventHandler, global.Config, global.Index));
      })(exports, (function(EventHandler, Config, index_js) {
        "use strict";
        const NAME = "backdrop";
        const CLASS_NAME_FADE = "fade";
        const CLASS_NAME_SHOW = "show";
        const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`;
        const Default = {
          className: "modal-backdrop",
          clickCallback: null,
          isAnimated: false,
          isVisible: true,
          // if false, we use the backdrop helper without adding any element to the dom
          rootElement: "body"
          // give the choice to place backdrop under different elements
        };
        const DefaultType = {
          className: "string",
          clickCallback: "(function|null)",
          isAnimated: "boolean",
          isVisible: "boolean",
          rootElement: "(element|string)"
        };
        class Backdrop extends Config {
          constructor(config) {
            super();
            this._config = this._getConfig(config);
            this._isAppended = false;
            this._element = null;
          }
          // Getters
          static get Default() {
            return Default;
          }
          static get DefaultType() {
            return DefaultType;
          }
          static get NAME() {
            return NAME;
          }
          // Public
          show(callback) {
            if (!this._config.isVisible) {
              index_js.execute(callback);
              return;
            }
            this._append();
            const element = this._getElement();
            if (this._config.isAnimated) {
              index_js.reflow(element);
            }
            element.classList.add(CLASS_NAME_SHOW);
            this._emulateAnimation(() => {
              index_js.execute(callback);
            });
          }
          hide(callback) {
            if (!this._config.isVisible) {
              index_js.execute(callback);
              return;
            }
            this._getElement().classList.remove(CLASS_NAME_SHOW);
            this._emulateAnimation(() => {
              this.dispose();
              index_js.execute(callback);
            });
          }
          dispose() {
            if (!this._isAppended) {
              return;
            }
            EventHandler.off(this._element, EVENT_MOUSEDOWN);
            this._element.remove();
            this._isAppended = false;
          }
          // Private
          _getElement() {
            if (!this._element) {
              const backdrop = document.createElement("div");
              backdrop.className = this._config.className;
              if (this._config.isAnimated) {
                backdrop.classList.add(CLASS_NAME_FADE);
              }
              this._element = backdrop;
            }
            return this._element;
          }
          _configAfterMerge(config) {
            config.rootElement = index_js.getElement(config.rootElement);
            return config;
          }
          _append() {
            if (this._isAppended) {
              return;
            }
            const element = this._getElement();
            this._config.rootElement.append(element);
            EventHandler.on(element, EVENT_MOUSEDOWN, () => {
              index_js.execute(this._config.clickCallback);
            });
            this._isAppended = true;
          }
          _emulateAnimation(callback) {
            index_js.executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
          }
        }
        return Backdrop;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/util/component-functions.js
  var require_component_functions = __commonJS({
    "node_modules/bootstrap/js/dist/util/component-functions.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_event_handler(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define(["exports", "../dom/event-handler", "../dom/selector-engine", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.SelectorEngine, global.Index));
      })(exports, (function(exports2, EventHandler, SelectorEngine, index_js) {
        "use strict";
        const enableDismissTrigger = (component, method = "hide") => {
          const clickEvent = `click.dismiss${component.EVENT_KEY}`;
          const name = component.NAME;
          EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
            if (["A", "AREA"].includes(this.tagName)) {
              event.preventDefault();
            }
            if (index_js.isDisabled(this)) {
              return;
            }
            const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
            const instance = component.getOrCreateInstance(target);
            instance[method]();
          });
        };
        exports2.enableDismissTrigger = enableDismissTrigger;
        Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
      }));
    }
  });

  // node_modules/bootstrap/js/dist/util/focustrap.js
  var require_focustrap = __commonJS({
    "node_modules/bootstrap/js/dist/util/focustrap.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_selector_engine(), require_config()) : typeof define === "function" && define.amd ? define(["../dom/event-handler", "../dom/selector-engine", "./config"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Focustrap = factory(global.EventHandler, global.SelectorEngine, global.Config));
      })(exports, (function(EventHandler, SelectorEngine, Config) {
        "use strict";
        const NAME = "focustrap";
        const DATA_KEY = "bs.focustrap";
        const EVENT_KEY = `.${DATA_KEY}`;
        const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
        const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY}`;
        const TAB_KEY = "Tab";
        const TAB_NAV_FORWARD = "forward";
        const TAB_NAV_BACKWARD = "backward";
        const Default = {
          autofocus: true,
          trapElement: null
          // The element to trap focus inside of
        };
        const DefaultType = {
          autofocus: "boolean",
          trapElement: "element"
        };
        class FocusTrap extends Config {
          constructor(config) {
            super();
            this._config = this._getConfig(config);
            this._isActive = false;
            this._lastTabNavDirection = null;
          }
          // Getters
          static get Default() {
            return Default;
          }
          static get DefaultType() {
            return DefaultType;
          }
          static get NAME() {
            return NAME;
          }
          // Public
          activate() {
            if (this._isActive) {
              return;
            }
            if (this._config.autofocus) {
              this._config.trapElement.focus();
            }
            EventHandler.off(document, EVENT_KEY);
            EventHandler.on(document, EVENT_FOCUSIN, (event) => this._handleFocusin(event));
            EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event));
            this._isActive = true;
          }
          deactivate() {
            if (!this._isActive) {
              return;
            }
            this._isActive = false;
            EventHandler.off(document, EVENT_KEY);
          }
          // Private
          _handleFocusin(event) {
            const {
              trapElement
            } = this._config;
            if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
              return;
            }
            const elements = SelectorEngine.focusableChildren(trapElement);
            if (elements.length === 0) {
              trapElement.focus();
            } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
              elements[elements.length - 1].focus();
            } else {
              elements[0].focus();
            }
          }
          _handleKeydown(event) {
            if (event.key !== TAB_KEY) {
              return;
            }
            this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
          }
        }
        return FocusTrap;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/util/scrollbar.js
  var require_scrollbar = __commonJS({
    "node_modules/bootstrap/js/dist/util/scrollbar.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/manipulator", "../dom/selector-engine", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Scrollbar = factory(global.Manipulator, global.SelectorEngine, global.Index));
      })(exports, (function(Manipulator, SelectorEngine, index_js) {
        "use strict";
        const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
        const SELECTOR_STICKY_CONTENT = ".sticky-top";
        const PROPERTY_PADDING = "padding-right";
        const PROPERTY_MARGIN = "margin-right";
        class ScrollBarHelper {
          constructor() {
            this._element = document.body;
          }
          // Public
          getWidth() {
            const documentWidth = document.documentElement.clientWidth;
            return Math.abs(window.innerWidth - documentWidth);
          }
          hide() {
            const width = this.getWidth();
            this._disableOverFlow();
            this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
            this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
            this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
          }
          reset() {
            this._resetElementAttributes(this._element, "overflow");
            this._resetElementAttributes(this._element, PROPERTY_PADDING);
            this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
            this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
          }
          isOverflowing() {
            return this.getWidth() > 0;
          }
          // Private
          _disableOverFlow() {
            this._saveInitialAttribute(this._element, "overflow");
            this._element.style.overflow = "hidden";
          }
          _setElementAttributes(selector, styleProperty, callback) {
            const scrollbarWidth = this.getWidth();
            const manipulationCallBack = (element) => {
              if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
                return;
              }
              this._saveInitialAttribute(element, styleProperty);
              const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
              element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
            };
            this._applyManipulationCallback(selector, manipulationCallBack);
          }
          _saveInitialAttribute(element, styleProperty) {
            const actualValue = element.style.getPropertyValue(styleProperty);
            if (actualValue) {
              Manipulator.setDataAttribute(element, styleProperty, actualValue);
            }
          }
          _resetElementAttributes(selector, styleProperty) {
            const manipulationCallBack = (element) => {
              const value = Manipulator.getDataAttribute(element, styleProperty);
              if (value === null) {
                element.style.removeProperty(styleProperty);
                return;
              }
              Manipulator.removeDataAttribute(element, styleProperty);
              element.style.setProperty(styleProperty, value);
            };
            this._applyManipulationCallback(selector, manipulationCallBack);
          }
          _applyManipulationCallback(selector, callBack) {
            if (index_js.isElement(selector)) {
              callBack(selector);
              return;
            }
            for (const sel of SelectorEngine.find(selector, this._element)) {
              callBack(sel);
            }
          }
        }
        return ScrollBarHelper;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/offcanvas.js
  var require_offcanvas = __commonJS({
    "node_modules/bootstrap/js/dist/offcanvas.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_selector_engine(), require_backdrop(), require_component_functions(), require_focustrap(), require_util(), require_scrollbar()) : typeof define === "function" && define.amd ? define(["./base-component", "./dom/event-handler", "./dom/selector-engine", "./util/backdrop", "./util/component-functions", "./util/focustrap", "./util/index", "./util/scrollbar"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Offcanvas = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine, global.Backdrop, global.ComponentFunctions, global.Focustrap, global.Index, global.Scrollbar));
      })(exports, (function(BaseComponent, EventHandler, SelectorEngine, Backdrop, componentFunctions_js, FocusTrap, index_js, ScrollBarHelper) {
        "use strict";
        const NAME = "offcanvas";
        const DATA_KEY = "bs.offcanvas";
        const EVENT_KEY = `.${DATA_KEY}`;
        const DATA_API_KEY = ".data-api";
        const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
        const ESCAPE_KEY = "Escape";
        const CLASS_NAME_SHOW = "show";
        const CLASS_NAME_SHOWING = "showing";
        const CLASS_NAME_HIDING = "hiding";
        const CLASS_NAME_BACKDROP = "offcanvas-backdrop";
        const OPEN_SELECTOR = ".offcanvas.show";
        const EVENT_SHOW = `show${EVENT_KEY}`;
        const EVENT_SHOWN = `shown${EVENT_KEY}`;
        const EVENT_HIDE = `hide${EVENT_KEY}`;
        const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
        const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
        const EVENT_RESIZE = `resize${EVENT_KEY}`;
        const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
        const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
        const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]';
        const Default = {
          backdrop: true,
          keyboard: true,
          scroll: false
        };
        const DefaultType = {
          backdrop: "(boolean|string)",
          keyboard: "boolean",
          scroll: "boolean"
        };
        class Offcanvas2 extends BaseComponent {
          constructor(element, config) {
            super(element, config);
            this._isShown = false;
            this._backdrop = this._initializeBackDrop();
            this._focustrap = this._initializeFocusTrap();
            this._addEventListeners();
          }
          // Getters
          static get Default() {
            return Default;
          }
          static get DefaultType() {
            return DefaultType;
          }
          static get NAME() {
            return NAME;
          }
          // Public
          toggle(relatedTarget) {
            return this._isShown ? this.hide() : this.show(relatedTarget);
          }
          show(relatedTarget) {
            if (this._isShown) {
              return;
            }
            const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
              relatedTarget
            });
            if (showEvent.defaultPrevented) {
              return;
            }
            this._isShown = true;
            this._backdrop.show();
            if (!this._config.scroll) {
              new ScrollBarHelper().hide();
            }
            this._element.setAttribute("aria-modal", true);
            this._element.setAttribute("role", "dialog");
            this._element.classList.add(CLASS_NAME_SHOWING);
            const completeCallBack = () => {
              if (!this._config.scroll || this._config.backdrop) {
                this._focustrap.activate();
              }
              this._element.classList.add(CLASS_NAME_SHOW);
              this._element.classList.remove(CLASS_NAME_SHOWING);
              EventHandler.trigger(this._element, EVENT_SHOWN, {
                relatedTarget
              });
            };
            this._queueCallback(completeCallBack, this._element, true);
          }
          hide() {
            if (!this._isShown) {
              return;
            }
            const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
            if (hideEvent.defaultPrevented) {
              return;
            }
            this._focustrap.deactivate();
            this._element.blur();
            this._isShown = false;
            this._element.classList.add(CLASS_NAME_HIDING);
            this._backdrop.hide();
            const completeCallback = () => {
              this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_HIDING);
              this._element.removeAttribute("aria-modal");
              this._element.removeAttribute("role");
              if (!this._config.scroll) {
                new ScrollBarHelper().reset();
              }
              EventHandler.trigger(this._element, EVENT_HIDDEN);
            };
            this._queueCallback(completeCallback, this._element, true);
          }
          dispose() {
            this._backdrop.dispose();
            this._focustrap.deactivate();
            super.dispose();
          }
          // Private
          _initializeBackDrop() {
            const clickCallback = () => {
              if (this._config.backdrop === "static") {
                EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
                return;
              }
              this.hide();
            };
            const isVisible = Boolean(this._config.backdrop);
            return new Backdrop({
              className: CLASS_NAME_BACKDROP,
              isVisible,
              isAnimated: true,
              rootElement: this._element.parentNode,
              clickCallback: isVisible ? clickCallback : null
            });
          }
          _initializeFocusTrap() {
            return new FocusTrap({
              trapElement: this._element
            });
          }
          _addEventListeners() {
            EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
              if (event.key !== ESCAPE_KEY) {
                return;
              }
              if (this._config.keyboard) {
                this.hide();
                return;
              }
              EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
            });
          }
          // Static
          static jQueryInterface(config) {
            return this.each(function() {
              const data = Offcanvas2.getOrCreateInstance(this, config);
              if (typeof config !== "string") {
                return;
              }
              if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
                throw new TypeError(`No method named "${config}"`);
              }
              data[config](this);
            });
          }
        }
        EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
          const target = SelectorEngine.getElementFromSelector(this);
          if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
          }
          if (index_js.isDisabled(this)) {
            return;
          }
          EventHandler.one(target, EVENT_HIDDEN, () => {
            if (index_js.isVisible(this)) {
              this.focus();
            }
          });
          const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
          if (alreadyOpen && alreadyOpen !== target) {
            Offcanvas2.getInstance(alreadyOpen).hide();
          }
          const data = Offcanvas2.getOrCreateInstance(target);
          data.toggle(this);
        });
        EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
          for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
            Offcanvas2.getOrCreateInstance(selector).show();
          }
        });
        EventHandler.on(window, EVENT_RESIZE, () => {
          for (const element of SelectorEngine.find("[aria-modal][class*=show][class*=offcanvas-]")) {
            if (getComputedStyle(element).position !== "fixed") {
              Offcanvas2.getOrCreateInstance(element).hide();
            }
          }
        });
        componentFunctions_js.enableDismissTrigger(Offcanvas2);
        index_js.defineJQueryPlugin(Offcanvas2);
        return Offcanvas2;
      }));
    }
  });

  // node_modules/bootstrap/js/dist/modal.js
  var require_modal = __commonJS({
    "node_modules/bootstrap/js/dist/modal.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_selector_engine(), require_backdrop(), require_component_functions(), require_focustrap(), require_util(), require_scrollbar()) : typeof define === "function" && define.amd ? define(["./base-component", "./dom/event-handler", "./dom/selector-engine", "./util/backdrop", "./util/component-functions", "./util/focustrap", "./util/index", "./util/scrollbar"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Modal = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine, global.Backdrop, global.ComponentFunctions, global.Focustrap, global.Index, global.Scrollbar));
      })(exports, (function(BaseComponent, EventHandler, SelectorEngine, Backdrop, componentFunctions_js, FocusTrap, index_js, ScrollBarHelper) {
        "use strict";
        const NAME = "modal";
        const DATA_KEY = "bs.modal";
        const EVENT_KEY = `.${DATA_KEY}`;
        const DATA_API_KEY = ".data-api";
        const ESCAPE_KEY = "Escape";
        const EVENT_HIDE = `hide${EVENT_KEY}`;
        const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
        const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
        const EVENT_SHOW = `show${EVENT_KEY}`;
        const EVENT_SHOWN = `shown${EVENT_KEY}`;
        const EVENT_RESIZE = `resize${EVENT_KEY}`;
        const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
        const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
        const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
        const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
        const CLASS_NAME_OPEN = "modal-open";
        const CLASS_NAME_FADE = "fade";
        const CLASS_NAME_SHOW = "show";
        const CLASS_NAME_STATIC = "modal-static";
        const OPEN_SELECTOR = ".modal.show";
        const SELECTOR_DIALOG = ".modal-dialog";
        const SELECTOR_MODAL_BODY = ".modal-body";
        const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="modal"]';
        const Default = {
          backdrop: true,
          focus: true,
          keyboard: true
        };
        const DefaultType = {
          backdrop: "(boolean|string)",
          focus: "boolean",
          keyboard: "boolean"
        };
        class Modal2 extends BaseComponent {
          constructor(element, config) {
            super(element, config);
            this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
            this._backdrop = this._initializeBackDrop();
            this._focustrap = this._initializeFocusTrap();
            this._isShown = false;
            this._isTransitioning = false;
            this._scrollBar = new ScrollBarHelper();
            this._addEventListeners();
          }
          // Getters
          static get Default() {
            return Default;
          }
          static get DefaultType() {
            return DefaultType;
          }
          static get NAME() {
            return NAME;
          }
          // Public
          toggle(relatedTarget) {
            return this._isShown ? this.hide() : this.show(relatedTarget);
          }
          show(relatedTarget) {
            if (this._isShown || this._isTransitioning) {
              return;
            }
            const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
              relatedTarget
            });
            if (showEvent.defaultPrevented) {
              return;
            }
            this._isShown = true;
            this._isTransitioning = true;
            this._scrollBar.hide();
            document.body.classList.add(CLASS_NAME_OPEN);
            this._adjustDialog();
            this._backdrop.show(() => this._showElement(relatedTarget));
          }
          hide() {
            if (!this._isShown || this._isTransitioning) {
              return;
            }
            const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
            if (hideEvent.defaultPrevented) {
              return;
            }
            this._isShown = false;
            this._isTransitioning = true;
            this._focustrap.deactivate();
            this._element.classList.remove(CLASS_NAME_SHOW);
            this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
          }
          dispose() {
            EventHandler.off(window, EVENT_KEY);
            EventHandler.off(this._dialog, EVENT_KEY);
            this._backdrop.dispose();
            this._focustrap.deactivate();
            super.dispose();
          }
          handleUpdate() {
            this._adjustDialog();
          }
          // Private
          _initializeBackDrop() {
            return new Backdrop({
              isVisible: Boolean(this._config.backdrop),
              // 'static' option will be translated to true, and booleans will keep their value,
              isAnimated: this._isAnimated()
            });
          }
          _initializeFocusTrap() {
            return new FocusTrap({
              trapElement: this._element
            });
          }
          _showElement(relatedTarget) {
            if (!document.body.contains(this._element)) {
              document.body.append(this._element);
            }
            this._element.style.display = "block";
            this._element.removeAttribute("aria-hidden");
            this._element.setAttribute("aria-modal", true);
            this._element.setAttribute("role", "dialog");
            this._element.scrollTop = 0;
            const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
            if (modalBody) {
              modalBody.scrollTop = 0;
            }
            index_js.reflow(this._element);
            this._element.classList.add(CLASS_NAME_SHOW);
            const transitionComplete = () => {
              if (this._config.focus) {
                this._focustrap.activate();
              }
              this._isTransitioning = false;
              EventHandler.trigger(this._element, EVENT_SHOWN, {
                relatedTarget
              });
            };
            this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
          }
          _addEventListeners() {
            EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
              if (event.key !== ESCAPE_KEY) {
                return;
              }
              if (this._config.keyboard) {
                this.hide();
                return;
              }
              this._triggerBackdropTransition();
            });
            EventHandler.on(window, EVENT_RESIZE, () => {
              if (this._isShown && !this._isTransitioning) {
                this._adjustDialog();
              }
            });
            EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event) => {
              EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event2) => {
                if (this._element !== event.target || this._element !== event2.target) {
                  return;
                }
                if (this._config.backdrop === "static") {
                  this._triggerBackdropTransition();
                  return;
                }
                if (this._config.backdrop) {
                  this.hide();
                }
              });
            });
          }
          _hideModal() {
            this._element.style.display = "none";
            this._element.setAttribute("aria-hidden", true);
            this._element.removeAttribute("aria-modal");
            this._element.removeAttribute("role");
            this._isTransitioning = false;
            this._backdrop.hide(() => {
              document.body.classList.remove(CLASS_NAME_OPEN);
              this._resetAdjustments();
              this._scrollBar.reset();
              EventHandler.trigger(this._element, EVENT_HIDDEN);
            });
          }
          _isAnimated() {
            return this._element.classList.contains(CLASS_NAME_FADE);
          }
          _triggerBackdropTransition() {
            const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
            if (hideEvent.defaultPrevented) {
              return;
            }
            const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
            const initialOverflowY = this._element.style.overflowY;
            if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) {
              return;
            }
            if (!isModalOverflowing) {
              this._element.style.overflowY = "hidden";
            }
            this._element.classList.add(CLASS_NAME_STATIC);
            this._queueCallback(() => {
              this._element.classList.remove(CLASS_NAME_STATIC);
              this._queueCallback(() => {
                this._element.style.overflowY = initialOverflowY;
              }, this._dialog);
            }, this._dialog);
            this._element.focus();
          }
          /**
           * The following methods are used to handle overflowing modals
           */
          _adjustDialog() {
            const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
            const scrollbarWidth = this._scrollBar.getWidth();
            const isBodyOverflowing = scrollbarWidth > 0;
            if (isBodyOverflowing && !isModalOverflowing) {
              const property = index_js.isRTL() ? "paddingLeft" : "paddingRight";
              this._element.style[property] = `${scrollbarWidth}px`;
            }
            if (!isBodyOverflowing && isModalOverflowing) {
              const property = index_js.isRTL() ? "paddingRight" : "paddingLeft";
              this._element.style[property] = `${scrollbarWidth}px`;
            }
          }
          _resetAdjustments() {
            this._element.style.paddingLeft = "";
            this._element.style.paddingRight = "";
          }
          // Static
          static jQueryInterface(config, relatedTarget) {
            return this.each(function() {
              const data = Modal2.getOrCreateInstance(this, config);
              if (typeof config !== "string") {
                return;
              }
              if (typeof data[config] === "undefined") {
                throw new TypeError(`No method named "${config}"`);
              }
              data[config](relatedTarget);
            });
          }
        }
        EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
          const target = SelectorEngine.getElementFromSelector(this);
          if (["A", "AREA"].includes(this.tagName)) {
            event.preventDefault();
          }
          EventHandler.one(target, EVENT_SHOW, (showEvent) => {
            if (showEvent.defaultPrevented) {
              return;
            }
            EventHandler.one(target, EVENT_HIDDEN, () => {
              if (index_js.isVisible(this)) {
                this.focus();
              }
            });
          });
          const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
          if (alreadyOpen) {
            Modal2.getInstance(alreadyOpen).hide();
          }
          const data = Modal2.getOrCreateInstance(target);
          data.toggle(this);
        });
        componentFunctions_js.enableDismissTrigger(Modal2);
        index_js.defineJQueryPlugin(Modal2);
        return Modal2;
      }));
    }
  });

  // src/js/animeflow.js
  var import_offcanvas = __toESM(require_offcanvas(), 1);
  var import_modal = __toESM(require_modal(), 1);

  // src/js/utils.js
  var $ = (sel, root = document) => root.querySelector(sel);
  var $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  function on(root, type, selector, handler, options) {
    root.addEventListener(type, (event) => {
      if (typeof event.target?.closest !== "function") return;
      const target = event.target.closest(selector);
      if (target && root.contains(target)) handler(event, target);
    }, options);
  }
  var debounce = (fn, wait = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };
  var throttle = (fn, wait = 100) => {
    let last = 0, queued = null;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      } else {
        clearTimeout(queued);
        queued = setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, wait - (now - last));
      }
    };
  };
  var storage = {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    }
  };
  var params = () => new URLSearchParams(location.search);
  var escapeHtml = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  function highlight(text, term) {
    const safe = escapeHtml(text);
    if (!term) return safe;
    const pattern = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp(`(${pattern})`, "ig"), "<mark>$1</mark>");
  }
  var prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function trapFocus(container) {
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const onKey = (event) => {
      if (event.key !== "Tab") return;
      const items = $$(selector, container).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKey);
    return () => container.removeEventListener("keydown", onKey);
  }

  // src/js/modules/theme.js
  var KEY = "af-theme";
  var DIR_KEY = "af-dir";
  var remember = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
    }
  };
  var recall = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  function currentTheme() {
    return document.documentElement.getAttribute("data-bs-theme") || "dark";
  }
  function setTheme(mode, { announce = true } = {}) {
    document.documentElement.setAttribute("data-bs-theme", mode);
    remember(KEY, mode);
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(mode === "light"));
      btn.setAttribute("aria-label", mode === "light" ? "Switch to dark theme" : "Switch to light theme");
    });
    document.dispatchEvent(new CustomEvent("af:themechange", { detail: { mode, announce } }));
  }
  function setDirection(dir) {
    const html = document.documentElement;
    html.dir = dir;
    remember(DIR_KEY, dir);
    const sheet = $("#af-stylesheet");
    if (sheet) {
      const ltr = "assets/css/animeflow.min.css";
      const rtl = "assets/css/animeflow.rtl.min.css";
      const next = dir === "rtl" ? rtl : ltr;
      if (!sheet.getAttribute("href").endsWith(next)) sheet.setAttribute("href", next);
    }
    document.dispatchEvent(new CustomEvent("af:dirchange", { detail: { dir } }));
  }
  function initTheme() {
    if (recall(DIR_KEY) === "rtl") setDirection("rtl");
    setTheme(currentTheme(), { announce: false });
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
    $$("[data-dir-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setDirection(document.documentElement.dir === "rtl" ? "ltr" : "rtl");
      });
    });
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
      if (recall(KEY) === null) setTheme(event.matches ? "light" : "dark");
    });
  }

  // src/js/modules/widgets.js
  function closeAllDropdowns(except) {
    $$('[data-af-dropdown][aria-expanded="true"]').forEach((toggle) => {
      if (toggle === except) return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.parentElement.querySelector(".dropdown-menu")?.classList.remove("show");
    });
  }
  function initDropdowns() {
    on(document, "click", "[data-af-dropdown]", (event, toggle) => {
      event.preventDefault();
      const menu = toggle.parentElement.querySelector(".dropdown-menu");
      if (!menu) return;
      const open = toggle.getAttribute("aria-expanded") === "true";
      closeAllDropdowns(toggle);
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("show", !open);
      if (!open) {
        menu.style.removeProperty("inset-inline-start");
        const box = menu.getBoundingClientRect();
        const overflowEnd = document.dir === "rtl" ? -box.left : box.right - window.innerWidth;
        if (overflowEnd > 0) menu.style.insetInlineStart = `${-overflowEnd - 16}px`;
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) closeAllDropdowns();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const open = $('[data-af-dropdown][aria-expanded="true"]');
      if (open) {
        closeAllDropdowns();
        open.focus();
      }
    });
    on(document, "keydown", ".dropdown", (event, wrap) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      const toggle = $("[data-af-dropdown]", wrap);
      const menu = $(".dropdown-menu", wrap);
      if (!toggle || !menu) return;
      if (toggle.getAttribute("aria-expanded") !== "true") {
        toggle.click();
        return;
      }
      event.preventDefault();
      const items = $$("a, button", menu);
      const at = items.indexOf(document.activeElement);
      const next = event.key === "ArrowDown" ? (at + 1) % items.length : at <= 0 ? items.length - 1 : at - 1;
      items[next]?.focus();
    });
  }
  function activateTab(tab) {
    const list = tab.closest('[role="tablist"]');
    const panelId = tab.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    if (!list || !panel) return;
    $$('[role="tab"]', list).forEach((t) => {
      const on2 = t === tab;
      t.classList.toggle("active", on2);
      t.setAttribute("aria-selected", String(on2));
      t.tabIndex = on2 ? 0 : -1;
    });
    const container = panel.parentElement;
    $$(":scope > .tab-pane", container).forEach((p) => {
      p.classList.toggle("show", p === panel);
      p.classList.toggle("active", p === panel);
    });
  }
  function initTabs() {
    on(document, "click", '[role="tab"]', (event, tab) => {
      event.preventDefault();
      activateTab(tab);
    });
    on(document, "keydown", '[role="tab"]', (event, tab) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      const list = tab.closest('[role="tablist"]');
      const tabs = $$('[role="tab"]', list);
      if (event.key === "Home") {
        event.preventDefault();
        tabs[0].focus();
        activateTab(tabs[0]);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        tabs.at(-1).focus();
        activateTab(tabs.at(-1));
        return;
      }
      if (!(event.key in keys)) return;
      event.preventDefault();
      const dir = document.dir === "rtl" ? -keys[event.key] : keys[event.key];
      const next = tabs[(tabs.indexOf(tab) + dir + tabs.length) % tabs.length];
      next.focus();
      activateTab(next);
    });
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      tabs.forEach((t) => {
        t.tabIndex = t.classList.contains("active") ? 0 : -1;
      });
    });
  }
  function collapse(panel, open) {
    const done = () => {
      panel.classList.remove("collapsing");
      panel.classList.toggle("collapse", true);
      panel.classList.toggle("show", open);
      panel.style.removeProperty("height");
    };
    panel.classList.remove("collapse", "show");
    panel.classList.add("collapsing");
    panel.style.height = `${open ? 0 : panel.scrollHeight}px`;
    void panel.offsetHeight;
    panel.style.height = `${open ? panel.scrollHeight : 0}px`;
    panel.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 400);
  }
  function initCollapse() {
    on(document, "click", "[data-af-collapse]", (event, toggle) => {
      event.preventDefault();
      const panel = document.getElementById(toggle.getAttribute("aria-controls"));
      if (!panel) return;
      const open = toggle.getAttribute("aria-expanded") !== "true";
      const parent = panel.dataset.afParent && $(panel.dataset.afParent);
      if (open && parent) {
        $$(".accordion-collapse.show", parent).forEach((other) => {
          if (other === panel) return;
          collapse(other, false);
          const otherToggle = $(`[aria-controls="${other.id}"]`, parent);
          otherToggle?.setAttribute("aria-expanded", "false");
          otherToggle?.classList.add("collapsed");
        });
      }
      toggle.setAttribute("aria-expanded", String(open));
      toggle.classList.toggle("collapsed", !open);
      collapse(panel, open);
    });
  }
  function initAlerts() {
    on(document, "click", "[data-af-dismiss]", (event, btn) => {
      const target = btn.closest(btn.dataset.afDismiss || ".alert");
      if (!target) return;
      target.classList.remove("show");
      target.addEventListener("transitionend", () => target.remove(), { once: true });
      setTimeout(() => target.remove(), 300);
    });
  }
  function initWidgets() {
    initDropdowns();
    initTabs();
    initCollapse();
    initAlerts();
  }

  // src/js/modules/ui.js
  var ICONS = {
    success: "check-circle-fill",
    danger: "x-circle-fill",
    warning: "exclamation-triangle-fill",
    info: "info-circle-fill"
  };
  function toast(title, message = "", variant = "info", timeout = 4e3) {
    const host = $("[data-toast-host]");
    if (!host) return null;
    const el = document.createElement("div");
    el.className = `af-toast af-toast-${variant}`;
    el.setAttribute("role", variant === "danger" ? "alert" : "status");
    el.innerHTML = `<svg class="af-icon" aria-hidden="true"><use href="#i-${ICONS[variant] || ICONS.info}"></use></svg>
    <div><b></b>${message ? "<span></span>" : ""}</div>
    <button type="button" class="af-toast-x" aria-label="Dismiss notification"><svg class="af-icon" aria-hidden="true"><use href="#i-x-lg"></use></svg></button>`;
    el.querySelector("b").textContent = title;
    if (message) el.querySelector("span").textContent = message;
    const close = () => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 400);
    };
    el.querySelector(".af-toast-x").addEventListener("click", close);
    host.append(el);
    if (timeout) setTimeout(close, timeout);
    return el;
  }
  function initCookies() {
    const banner = $("[data-cookie-banner]");
    if (!banner) return;
    if (storage.get("af-cookies") === null) {
      setTimeout(() => {
        banner.hidden = false;
      }, 1200);
    }
    on(banner, "click", "[data-cookie]", (event, btn) => {
      storage.set("af-cookies", btn.dataset.cookie);
      banner.hidden = true;
      toast(
        btn.dataset.cookie === "accept" ? "Cookies accepted" : "Only essential cookies",
        "You can change this any time from the footer.",
        "success"
      );
    });
  }
  function initScrollChrome() {
    const header = $("[data-header]");
    const toTop = $("[data-to-top]");
    const progress = $("[data-scroll-progress]");
    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (toTop) toTop.hidden = y < 600;
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
      }
    };
    window.addEventListener("scroll", throttle(update, 60), { passive: true });
    window.addEventListener("resize", throttle(update, 200), { passive: true });
    update();
    toTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      $(".af-skip")?.focus();
    });
  }
  function initBottomNav() {
    const page = document.body.dataset.page;
    $$("[data-bottom]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.bottom === page);
      if (link.dataset.bottom === page) link.setAttribute("aria-current", "page");
    });
  }
  function initLightbox() {
    const host = $("[data-lightbox-host]");
    if (!host) return;
    const img = $("[data-lightbox-img]", host);
    const caption = $("[data-lightbox-caption]", host);
    let release = null;
    let opener = null;
    const close = () => {
      host.hidden = true;
      document.body.style.removeProperty("overflow");
      release?.();
      opener?.focus();
    };
    on(document, "click", "[data-lightbox]", (event, btn) => {
      event.preventDefault();
      opener = btn;
      img.src = btn.dataset.lightbox;
      img.alt = btn.dataset.caption || "";
      caption.textContent = btn.dataset.caption || "";
      host.hidden = false;
      document.body.style.overflow = "hidden";
      release = trapFocus(host);
      $("[data-lightbox-close]", host).focus();
    });
    on(host, "click", "[data-lightbox-close]", close);
    host.addEventListener("click", (event) => {
      if (event.target === host) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !host.hidden) close();
    });
  }
  function initCopy() {
    on(document, "click", "[data-copy]", async (event, btn) => {
      const code = btn.parentElement.querySelector("code");
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent);
        const label = btn.querySelector("span");
        const original = label ? label.textContent : "";
        btn.classList.add("is-done");
        if (label) label.textContent = "Copied";
        setTimeout(() => {
          btn.classList.remove("is-done");
          if (label) label.textContent = original;
        }, 1800);
      } catch {
        toast("Could not copy", "Your browser blocked clipboard access.", "warning");
      }
    });
  }
  function initNewsletterPopup() {
    const modalEl = $("#af-newsletter-modal");
    if (!modalEl || !window.bootstrap) return;
    if (storage.get("af-newsletter") !== null) return;
    let fired = false;
    const show = () => {
      if (fired || document.querySelector(".modal.show") || !$("[data-search-dialog]")?.hidden) return;
      fired = true;
      storage.set("af-newsletter", "seen");
      window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    };
    const timer = setTimeout(show, 45e3);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.5) {
        clearTimeout(timer);
        show();
      }
    };
    window.addEventListener("scroll", throttle(onScroll, 500), { passive: true });
  }
  function initCursor() {
    const cursor = $("[data-cursor]");
    if (!cursor || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = $(".af-cursor-dot", cursor);
    const ring = $(".af-cursor-ring", cursor);
    let x = 0, y = 0, rx = 0, ry = 0, running = false;
    document.body.classList.add("af-cursor-on");
    window.addEventListener("pointermove", (event) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!running) {
        running = true;
        requestAnimationFrame(follow);
      }
    }, { passive: true });
    function follow() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(x - rx) > 0.4 || Math.abs(y - ry) > 0.4) requestAnimationFrame(follow);
      else running = false;
    }
    on(
      document,
      "pointerenter",
      'a, button, [role="button"], input, select, textarea',
      () => cursor.classList.add("is-active"),
      true
    );
    on(
      document,
      "pointerleave",
      'a, button, [role="button"], input, select, textarea',
      () => cursor.classList.remove("is-active"),
      true
    );
    document.addEventListener("pointerdown", () => cursor.classList.add("is-active"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-active"));
  }
  function initUI() {
    initCookies();
    initScrollChrome();
    initBottomNav();
    initLightbox();
    initCopy();
    initNewsletterPopup();
    initCursor();
  }

  // src/js/modules/store.js
  var DATA_URL = "assets/data/anime.json";
  var POSTS_URL = "assets/data/posts.json";
  var cache = null;
  var inflight = null;
  async function getCatalogue() {
    if (cache) return cache;
    if (inflight) return inflight;
    inflight = fetch(DATA_URL, { headers: { accept: "application/json" } }).then((res) => {
      if (!res.ok) throw new Error(`Catalogue request failed: ${res.status}`);
      return res.json();
    }).then((data) => {
      cache = data;
      inflight = null;
      return data;
    }).catch((err) => {
      inflight = null;
      console.warn("[animeflow] catalogue unavailable \u2014", err.message);
      return { anime: [], genres: [], studios: [], schedule: [] };
    });
    return inflight;
  }
  async function getPosts() {
    try {
      const res = await fetch(POSTS_URL);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  }
  function trackView(slug) {
    if (!slug) return;
    const seen = storage.get("af-recent", []).filter((s) => s !== slug);
    seen.unshift(slug);
    storage.set("af-recent", seen.slice(0, 12));
  }
  var getRecent = () => storage.get("af-recent", []);
  function saveProgress(slug, episode, percent) {
    const all = storage.get("af-progress", {});
    all[slug] = { episode, percent, at: Date.now() };
    storage.set("af-progress", all);
  }
  var getProgress = () => storage.get("af-progress", {});

  // src/js/modules/search.js
  var score = (item, term) => {
    const t = term.toLowerCase();
    const title = item.title.toLowerCase();
    if (title === t) return 100;
    if (title.startsWith(t)) return 80;
    if (title.includes(t)) return 60;
    if (item.studio.toLowerCase().includes(t)) return 40;
    if (item.genres.some((g) => g.toLowerCase().includes(t))) return 30;
    if ((item.synopsis || "").toLowerCase().includes(t)) return 10;
    return 0;
  };
  function searchCatalogue(list, term, limit = 8) {
    if (!term.trim()) return [];
    return list.map((item) => ({ item, s: score(item, term) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || b.item.rating - a.item.rating).slice(0, limit).map((r) => r.item);
  }
  var resultRow = (a, term, selected) => `<li role="option" id="af-opt-${a.slug}" aria-selected="${selected}">
  <a href="anime-details.html?id=${a.slug}">
    <img src="assets/img/posters/${a.slug}.svg" alt="" width="400" height="600" loading="lazy" decoding="async">
    <span>
      <b>${highlight(a.title, term)}</b>
      <small>${escapeHtml(a.studio)} \xB7 ${a.year} \xB7 ${escapeHtml(a.genres.slice(0, 2).join(", "))}</small>
    </span>
  </a>
</li>`;
  function initDialog() {
    const dialog = $("[data-search-dialog]");
    if (!dialog) return;
    const input = $("[data-search-input]", dialog);
    const list = $("[data-search-results]", dialog);
    const hint = $("[data-search-hint]", dialog);
    let index = -1;
    let results = [];
    let release = null;
    let opener = null;
    const paint = (items, term) => {
      results = items;
      index = items.length ? 0 : -1;
      list.innerHTML = items.map((a, i) => resultRow(a, term, i === 0)).join("");
      input.setAttribute("aria-expanded", String(items.length > 0));
      input.setAttribute("aria-activedescendant", items.length ? `af-opt-${items[0].slug}` : "");
    };
    const showDefaults = async () => {
      const { anime } = await getCatalogue();
      hint.textContent = "Popular right now";
      paint(anime.filter((a) => a.tags.includes("trending")).slice(0, 6), "");
    };
    const run = debounce(async (term) => {
      const { anime } = await getCatalogue();
      if (!term.trim()) {
        showDefaults();
        return;
      }
      const items = searchCatalogue(anime, term);
      hint.textContent = items.length ? `${items.length} result${items.length === 1 ? "" : "s"} for \u201C${term}\u201D` : `Nothing matched \u201C${term}\u201D`;
      paint(items, term);
      if (!items.length) {
        list.innerHTML = `<li class="af-search-empty"><p class="af-muted" style="padding:1rem .6rem">Try a studio (\u201CMAPPA\u201D), a genre (\u201CSci-Fi\u201D) or a shorter title.</p></li>`;
      }
    }, 180);
    const open = (trigger) => {
      opener = trigger || document.activeElement;
      dialog.hidden = false;
      document.body.style.overflow = "hidden";
      release = trapFocus(dialog);
      input.value = "";
      showDefaults();
      requestAnimationFrame(() => input.focus());
    };
    const close = () => {
      dialog.hidden = true;
      document.body.style.removeProperty("overflow");
      release?.();
      opener?.focus?.();
    };
    const move = (delta) => {
      if (!results.length) return;
      index = (index + delta + results.length) % results.length;
      $$('li[role="option"]', list).forEach((li, i) => li.setAttribute("aria-selected", String(i === index)));
      input.setAttribute("aria-activedescendant", `af-opt-${results[index].slug}`);
      $$('li[role="option"]', list)[index]?.scrollIntoView({ block: "nearest" });
    };
    on(document, "click", "[data-search-open]", (event, btn) => {
      event.preventDefault();
      open(btn);
    });
    on(dialog, "click", "[data-search-close]", close);
    input.addEventListener("input", () => run(input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Enter" && index > -1 && results[index]) {
        event.preventDefault();
        location.href = `anime-details.html?id=${results[index].slug}`;
      } else if (event.key === "Escape") {
        close();
      }
    });
    document.addEventListener("keydown", (event) => {
      const typing = /^(input|textarea|select)$/i.test(event.target.tagName) || event.target.isContentEditable;
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        dialog.hidden ? open() : close();
      } else if (event.key === "/" && !typing && dialog.hidden) {
        event.preventDefault();
        open();
      }
    });
  }
  async function initResultsPage() {
    const host = $("[data-search-page]");
    if (!host) return;
    const form = $("[data-search-form]");
    const input = $("[data-search-page-input]");
    const heading = $("[data-search-heading]");
    const { anime } = await getCatalogue();
    const render = (term) => {
      const items = searchCatalogue(anime, term, 60);
      heading.textContent = term ? `${items.length} result${items.length === 1 ? "" : "s"} for \u201C${term}\u201D` : "Start typing to search the catalogue";
      if (!items.length) {
        host.innerHTML = `<div class="af-empty">
        <span class="af-empty-icon"><svg class="af-icon" aria-hidden="true"><use href="#i-search"></use></svg></span>
        <h3>No matches</h3><p class="af-muted">Check the spelling, or browse the full catalogue instead.</p>
        <a class="btn btn-primary" href="browse.html">Browse everything</a></div>`;
        return;
      }
      host.innerHTML = items.map((a) => window.AnimeFlow.cardHTML(a)).join("");
      document.dispatchEvent(new CustomEvent("af:cardsrendered", { detail: { root: host } }));
    };
    const initial = new URLSearchParams(location.search).get("q") || "";
    if (input) input.value = initial;
    render(initial);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const term = input.value.trim();
      history.replaceState(null, "", term ? `?q=${encodeURIComponent(term)}` : location.pathname);
      render(term);
    });
    input?.addEventListener("input", debounce(() => render(input.value.trim()), 220));
  }
  function initSearch() {
    initDialog();
    initResultsPage();
  }

  // src/js/modules/card.js
  var icon = (name) => `<svg class="af-icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  function stars(value) {
    const out = [];
    for (let i = 0; i < 5; i += 1) {
      const filled = value / 2 - i;
      out.push(icon(filled >= 0.75 ? "star-fill" : filled >= 0.25 ? "star-half" : "star"));
    }
    return out.join("");
  }
  function cardHTML(a, { rank = 0 } = {}) {
    const saved = isSaved(a.slug);
    const meta = [a.year, a.type, a.episodes ? `${a.episodes} ep` : null].filter(Boolean).join(" \xB7 ");
    const flag = a.status === "Upcoming" ? '<span class="badge af-badge af-badge-info af-card-flag">Upcoming</span>' : a.rating >= 8.6 ? '<span class="badge af-badge af-badge-warning af-card-flag">Top rated</span>' : "";
    return `<article class="af-card" data-slug="${a.slug}" data-title="${escapeHtml(a.title)}">
  <div class="af-poster">
    <a class="af-poster-link" href="anime-details.html?id=${a.slug}" aria-label="${escapeHtml(a.title)} details">
      <img class="af-poster-img" src="assets/img/posters/${a.slug}.svg" alt="${escapeHtml(a.title)}" width="400" height="600" loading="lazy" decoding="async">
    </a>
    ${rank ? `<span class="af-rank" aria-hidden="true">${rank}</span>` : ""}
    ${flag}
    <div class="af-poster-overlay">
      <a class="af-play" href="watch.html?id=${a.slug}" aria-label="Watch ${escapeHtml(a.title)}">${icon("play-fill")}</a>
      <div class="af-poster-actions">
        <button type="button" class="af-icon-btn" data-watchlist="${a.slug}" aria-pressed="${saved}" aria-label="${saved ? "Remove" : "Add"} ${escapeHtml(a.title)} ${saved ? "from" : "to"} watchlist">${icon("heart")}${icon("heart-fill")}</button>
        <button type="button" class="af-icon-btn" data-preview="${a.slug}" aria-label="Preview ${escapeHtml(a.title)} trailer">${icon("play-circle-fill")}</button>
      </div>
    </div>
  </div>
  <div class="af-card-body">
    <h3 class="af-card-title"><a href="anime-details.html?id=${a.slug}">${escapeHtml(a.title)}</a></h3>
    <div class="af-card-meta">
      ${a.rating ? `<span class="af-rating af-rating-sm" role="img" aria-label="Rated ${a.rating} out of 10"><span class="af-rating-stars" aria-hidden="true">${stars(a.rating)}</span><b>${a.rating.toFixed(1)}</b></span>` : '<span class="af-muted">Not yet rated</span>'}
      <span class="af-dot" aria-hidden="true"></span>
      <span class="af-muted">${escapeHtml(meta)}</span>
    </div>
  </div>
</article>`;
  }
  var skeletonHTML = (count = 10) => Array.from({ length: count }, () => `<div class="af-card af-skeleton-card" aria-hidden="true">
    <div class="af-poster af-skeleton"></div>
    <div class="af-card-body">
      <div class="af-skeleton af-skeleton-line" style="width:80%"></div>
      <div class="af-skeleton af-skeleton-line" style="width:55%"></div>
    </div>
  </div>`).join("");

  // src/js/modules/watchlist.js
  var KEY2 = "af-watchlist";
  var getWatchlist = () => storage.get(KEY2, []);
  var isSaved = (slug) => getWatchlist().includes(slug);
  function toggleWatchlist(slug) {
    const list = getWatchlist();
    const index = list.indexOf(slug);
    const added = index === -1;
    if (added) list.unshift(slug);
    else list.splice(index, 1);
    storage.set(KEY2, list);
    syncButtons();
    syncCount();
    document.dispatchEvent(new CustomEvent("af:watchlistchange", { detail: { slug, added, list } }));
    return added;
  }
  function syncButtons(root = document) {
    const list = getWatchlist();
    $$("[data-watchlist]", root).forEach((btn) => {
      const saved = list.includes(btn.dataset.watchlist);
      btn.setAttribute("aria-pressed", String(saved));
      const title = btn.closest("[data-title]")?.dataset.title;
      if (title) {
        btn.setAttribute("aria-label", `${saved ? "Remove" : "Add"} ${title} ${saved ? "from" : "to"} watchlist`);
      }
    });
  }
  function syncCount() {
    const count = getWatchlist().length;
    $$("[data-watchlist-count]").forEach((el) => {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }
  async function renderWatchlistPage() {
    const host = $("[data-watchlist-grid]");
    if (!host) return;
    const { anime } = await getCatalogue();
    const saved = getWatchlist();
    const items = saved.map((slug) => anime.find((a) => a.slug === slug)).filter(Boolean);
    const counter = $("[data-watchlist-total]");
    if (counter) counter.textContent = `${items.length} title${items.length === 1 ? "" : "s"}`;
    if (!items.length) {
      host.innerHTML = `<div class="af-empty" style="grid-column:1/-1">
      <span class="af-empty-icon"><svg class="af-icon" aria-hidden="true"><use href="#i-heart"></use></svg></span>
      <h3>Your watchlist is empty</h3>
      <p class="af-muted">Tap the heart on any poster and it will show up here \u2014 stored in your browser, no account needed.</p>
      <a class="btn btn-primary" href="browse.html">Find something to watch</a>
    </div>`;
      $("[data-watchlist-clear]")?.setAttribute("disabled", "");
      return;
    }
    $("[data-watchlist-clear]")?.removeAttribute("disabled");
    host.innerHTML = items.map((a) => cardHTML(a)).join("");
    syncButtons(host);
  }
  async function renderRecent() {
    const host = $("[data-recent-grid]");
    if (!host) return;
    const { anime } = await getCatalogue();
    const items = getRecent().map((slug) => anime.find((a) => a.slug === slug)).filter(Boolean).slice(0, 6);
    if (!items.length) {
      host.closest("[data-recent-section]")?.setAttribute("hidden", "");
      return;
    }
    host.closest("[data-recent-section]")?.removeAttribute("hidden");
    host.innerHTML = items.map((a) => cardHTML(a)).join("");
    syncButtons(host);
  }
  function initWatchlist() {
    syncCount();
    syncButtons();
    on(document, "click", "[data-watchlist]", async (event, btn) => {
      event.preventDefault();
      const slug = btn.dataset.watchlist;
      const added = toggleWatchlist(slug);
      const title = btn.closest("[data-title]")?.dataset.title || "Title";
      toast(
        added ? "Added to watchlist" : "Removed from watchlist",
        title,
        added ? "success" : "info",
        2600
      );
      if ($("[data-watchlist-grid]")) renderWatchlistPage();
    });
    $("[data-watchlist-clear]")?.addEventListener("click", () => {
      storage.set(KEY2, []);
      syncCount();
      renderWatchlistPage();
      toast("Watchlist cleared", "", "info");
    });
    renderWatchlistPage();
    renderRecent();
  }

  // src/js/modules/catalog.js
  var PAGE_SIZE = 18;
  var state = {
    genre: /* @__PURE__ */ new Set(),
    status: /* @__PURE__ */ new Set(),
    studio: "",
    score: 0,
    sort: "popular",
    query: "",
    shown: PAGE_SIZE
  };
  var sorters = {
    popular: (a, b) => b.tags.length - a.tags.length || b.rating - a.rating,
    rating: (a, b) => b.rating - a.rating,
    newest: (a, b) => b.year - a.year,
    title: (a, b) => a.title.localeCompare(b.title)
  };
  function applyFilters(all) {
    return all.filter((a) => {
      if (state.genre.size && !a.genres.some((g) => state.genre.has(g))) return false;
      if (state.status.size && !state.status.has(a.status)) return false;
      if (state.studio && a.studio !== state.studio) return false;
      if (state.score && a.rating < state.score) return false;
      if (state.query && !`${a.title} ${a.studio} ${a.genres.join(" ")}`.toLowerCase().includes(state.query.toLowerCase())) return false;
      return true;
    }).sort(sorters[state.sort] || sorters.popular);
  }
  function chipsHTML() {
    const chips = [
      ...[...state.genre].map((g) => ({ type: "genre", value: g })),
      ...[...state.status].map((s) => ({ type: "status", value: s })),
      ...state.studio ? [{ type: "studio", value: state.studio }] : [],
      ...state.score ? [{ type: "score", value: `${state.score}+ rating` }] : []
    ];
    if (!chips.length) return "";
    return chips.map((c) => `<span class="af-chip" data-chip="${c.type}:${c.value}">${c.value}
    <button type="button" class="af-chip-x" data-chip-remove data-type="${c.type}" data-value="${c.value}" aria-label="Remove filter ${c.value}">
      <svg class="af-icon" aria-hidden="true"><use href="#i-x-lg"></use></svg></button></span>`).join("") + `<button type="button" class="af-ghost-btn" data-filter-reset>Clear all</button>`;
  }
  function syncURL() {
    const url = new URLSearchParams();
    if (state.genre.size) url.set("genre", [...state.genre].join(","));
    if (state.status.size) url.set("status", [...state.status].join(","));
    if (state.studio) url.set("studio", state.studio);
    if (state.score) url.set("score", state.score);
    if (state.sort !== "popular") url.set("sort", state.sort);
    const qs = url.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }
  function readURL() {
    const url = new URLSearchParams(location.search);
    url.get("genre")?.split(",").filter(Boolean).forEach((g) => state.genre.add(g));
    url.get("status")?.split(",").filter(Boolean).forEach((s) => state.status.add(s));
    state.studio = url.get("studio") || "";
    state.score = Number(url.get("score") || 0);
    state.sort = url.get("sort") || "popular";
  }
  function syncControls() {
    $$("[data-filters]").forEach((form) => {
      $$('[data-filter="genre"]', form).forEach((cb) => {
        cb.checked = state.genre.has(cb.value);
      });
      $$('[data-filter="status"]', form).forEach((cb) => {
        cb.checked = state.status.has(cb.value);
      });
      const studio = $('[data-filter="studio"]', form);
      if (studio) studio.value = state.studio;
      const sort = $('[data-filter="sort"]', form);
      if (sort) sort.value = state.sort;
      const score2 = $('[data-filter="score"]', form);
      if (score2) score2.value = String(state.score);
      const out = $('[data-filter-out="score"]', form);
      if (out) out.textContent = state.score.toFixed(1);
    });
  }
  async function initCatalog() {
    const grid = $("[data-catalog-grid]");
    if (!grid) return;
    const countEl = $("[data-catalog-count]");
    const chipHost = $("[data-active-filters]");
    const moreBtn = $("[data-load-more]");
    const sentinel = $("[data-infinite]");
    grid.innerHTML = skeletonHTML(12);
    readURL();
    syncControls();
    const { anime } = await getCatalogue();
    function render({ append = false } = {}) {
      const results = applyFilters(anime);
      const slice = results.slice(0, state.shown);
      if (countEl) countEl.textContent = `${results.length} title${results.length === 1 ? "" : "s"}`;
      if (chipHost) chipHost.innerHTML = chipsHTML();
      if (!results.length) {
        grid.innerHTML = `<div class="af-empty" style="grid-column:1/-1">
        <span class="af-empty-icon"><svg class="af-icon" aria-hidden="true"><use href="#i-funnel"></use></svg></span>
        <h3>Nothing matches those filters</h3>
        <p class="af-muted">Loosen one of them \u2014 dropping the minimum rating usually helps.</p>
        <button type="button" class="btn btn-primary" data-filter-reset>Reset filters</button></div>`;
      } else if (append) {
        const start = grid.querySelectorAll(".af-card:not(.af-skeleton-card)").length;
        grid.insertAdjacentHTML("beforeend", slice.slice(start).map((a) => cardHTML(a)).join(""));
      } else {
        grid.innerHTML = slice.map((a) => cardHTML(a)).join("");
      }
      syncButtons(grid);
      const done = state.shown >= results.length;
      if (moreBtn) moreBtn.hidden = done;
      if (sentinel) sentinel.hidden = done;
      syncURL();
    }
    const update = () => {
      state.shown = PAGE_SIZE;
      render();
    };
    on(document, "change", "[data-filter]", (event, el) => {
      const kind = el.dataset.filter;
      if (kind === "genre" || kind === "status") {
        const set = state[kind];
        el.checked ? set.add(el.value) : set.delete(el.value);
      } else if (kind === "studio") state.studio = el.value;
      else if (kind === "sort") state.sort = el.value;
      else if (kind === "score") {
        state.score = Number(el.value);
        $$('[data-filter-out="score"]').forEach((o) => {
          o.textContent = state.score.toFixed(1);
        });
      }
      syncControls();
      update();
    });
    on(document, "input", '[data-filter="score"]', debounce((event, el) => {
      $$('[data-filter-out="score"]').forEach((o) => {
        o.textContent = Number(el.value).toFixed(1);
      });
    }, 30));
    on(document, "click", "[data-filter-reset]", () => {
      state.genre.clear();
      state.status.clear();
      state.studio = "";
      state.score = 0;
      state.sort = "popular";
      syncControls();
      update();
    });
    on(document, "click", "[data-chip-remove]", (event, btn) => {
      const { type, value } = btn.dataset;
      if (type === "genre" || type === "status") state[type].delete(value);
      else if (type === "studio") state.studio = "";
      else if (type === "score") state.score = 0;
      syncControls();
      update();
    });
    const loadMore = () => {
      const results = applyFilters(anime);
      if (state.shown >= results.length) return;
      state.shown += PAGE_SIZE;
      render({ append: true });
    };
    moreBtn?.addEventListener("click", loadMore);
    if (sentinel && "IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      }, { rootMargin: "400px" }).observe(sentinel);
    }
    render();
  }

  // src/js/modules/rails.js
  function setupRail(rail) {
    const track = $("[data-rail-track]", rail);
    const prev = $("[data-rail-prev]", rail);
    const next = $("[data-rail-next]", rail);
    if (!track) return;
    const step = () => Math.max(track.clientWidth * 0.8, 240);
    const behavior = () => prefersReducedMotion() ? "auto" : "smooth";
    const updateArrows = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      const pos = Math.abs(track.scrollLeft);
      if (prev) prev.hidden = pos <= 2;
      if (next) next.hidden = pos >= max;
    };
    prev?.addEventListener("click", () => {
      track.scrollBy({ left: document.dir === "rtl" ? step() : -step(), behavior: behavior() });
    });
    next?.addEventListener("click", () => {
      track.scrollBy({ left: document.dir === "rtl" ? -step() : step(), behavior: behavior() });
    });
    track.addEventListener("scroll", throttle(updateArrows, 100), { passive: true });
    window.addEventListener("resize", throttle(updateArrows, 200), { passive: true });
    track.addEventListener("keydown", (event) => {
      const map = {
        ArrowRight: step(),
        ArrowLeft: -step(),
        PageDown: track.clientWidth,
        PageUp: -track.clientWidth
      };
      if (event.key === "Home") {
        event.preventDefault();
        track.scrollTo({ left: 0, behavior: behavior() });
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        track.scrollTo({ left: track.scrollWidth, behavior: behavior() });
        return;
      }
      if (map[event.key] === void 0) return;
      event.preventDefault();
      track.scrollBy({ left: map[event.key], behavior: behavior() });
    });
    let down = false, startX = 0, startScroll = 0, moved = 0;
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      down = true;
      moved = 0;
      startX = event.clientX;
      startScroll = track.scrollLeft;
    });
    track.addEventListener("pointermove", (event) => {
      if (!down) return;
      const delta = event.clientX - startX;
      moved = Math.abs(delta);
      if (moved > 6) {
        track.classList.add("is-dragging");
        track.setPointerCapture?.(event.pointerId);
        track.scrollLeft = startScroll - delta;
      }
    });
    const release = () => {
      if (!down) return;
      down = false;
      track.classList.remove("is-dragging");
      updateArrows();
    };
    track.addEventListener("pointerup", release);
    track.addEventListener("pointercancel", release);
    track.addEventListener("pointerleave", release);
    track.addEventListener("click", (event) => {
      if (moved > 6) {
        event.preventDefault();
        event.stopPropagation();
        moved = 0;
      }
    }, true);
    updateArrows();
  }
  function initRails(root = document) {
    $$("[data-rail]", root).forEach(setupRail);
  }

  // src/js/modules/motion.js
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.revealDelay || 0);
        setTimeout(() => entry.target.classList.add("is-revealed"), delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  }
  function initParallax() {
    const layers = $$("[data-parallax]");
    if (!layers.length || prefersReducedMotion()) return;
    const update = () => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener("scroll", throttle(update, 16), { passive: true });
    update();
  }
  function countTo(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion()) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(countTo);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countTo(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }
  function initTypewriter() {
    $$("[data-typewriter]").forEach((el) => {
      const words = el.dataset.typewriter.split("|").map((w2) => w2.trim()).filter(Boolean);
      if (!words.length) return;
      if (prefersReducedMotion()) {
        el.textContent = words[0];
        return;
      }
      let w = 0, c = 0, deleting = false;
      const tick = () => {
        const word = words[w];
        c += deleting ? -1 : 1;
        el.textContent = word.slice(0, c);
        let wait = deleting ? 45 : 85;
        if (!deleting && c === word.length) {
          deleting = true;
          wait = 1600;
        } else if (deleting && c === 0) {
          deleting = false;
          w = (w + 1) % words.length;
          wait = 350;
        }
        setTimeout(tick, wait);
      };
      tick();
    });
  }
  function initImages() {
    $$('img[loading="lazy"]').forEach((img) => {
      if (img.complete) {
        img.dataset.loaded = "true";
        return;
      }
      img.addEventListener("load", () => {
        img.dataset.loaded = "true";
      }, { once: true });
      img.addEventListener("error", () => {
        img.dataset.loaded = "error";
      }, { once: true });
    });
  }
  function initMotion() {
    initReveal();
    initParallax();
    initCounters();
    initTypewriter();
    initImages();
  }
  document.addEventListener("af:cardsrendered", () => {
    initReveal();
    initImages();
  });

  // src/js/modules/forms.js
  var MESSAGES = {
    valueMissing: "This field is required.",
    typeMismatch: "Check the format \u2014 that does not look right.",
    tooShort: "A little longer, please.",
    patternMismatch: "That does not match the expected format."
  };
  function messageFor(input) {
    const v = input.validity;
    if (v.valueMissing) return MESSAGES.valueMissing;
    if (v.typeMismatch) return input.type === "email" ? "Enter a valid email address." : MESSAGES.typeMismatch;
    if (v.tooShort) return `Use at least ${input.minLength} characters.`;
    if (v.patternMismatch) return MESSAGES.patternMismatch;
    return input.validationMessage || "Please check this field.";
  }
  function validate(input) {
    const field = input.closest(".af-field") || input.parentElement;
    const error = field?.querySelector("[data-error]");
    const ok = input.checkValidity();
    input.classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    if (error) {
      error.textContent = ok ? "" : messageFor(input);
      error.style.display = ok ? "" : "block";
    }
    return ok;
  }
  function initValidation() {
    on(
      document,
      "blur",
      "form[novalidate] input, form[novalidate] textarea, form[novalidate] select",
      (event, el) => {
        if (el.value !== "" || el.required) validate(el);
      },
      true
    );
    on(document, "input", "form[novalidate] .is-invalid", (event, el) => validate(el));
  }
  function strength(value) {
    let s = 0;
    if (value.length >= 8) s += 1;
    if (value.length >= 12) s += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s += 1;
    if (/\d/.test(value) && /[^\w\s]/.test(value)) s += 1;
    return Math.min(4, s);
  }
  var LABELS = ["Too short", "Weak", "Getting there", "Good", "Strong"];
  function initPasswords() {
    on(document, "input", "[data-password]", (event, input) => {
      const meter = $(`#${input.dataset.password}`);
      if (!meter) return;
      const s = input.value ? strength(input.value) : 0;
      meter.dataset.score = String(s);
      const label = meter.nextElementSibling;
      if (label?.hasAttribute("data-password-label")) {
        label.textContent = input.value ? LABELS[s] : "Use 12+ characters with a number and a symbol.";
      }
    });
    on(document, "click", "[data-password-toggle]", (event, btn) => {
      const input = $(`#${btn.dataset.passwordToggle}`);
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  }
  async function fakeSend(ms = 900) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function initSubmits() {
    $$("form[data-async]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const fields = $$("input, textarea, select", form).filter((el) => el.type !== "hidden");
        const valid = fields.map(validate).every(Boolean);
        if (!valid) {
          fields.find((el) => el.classList.contains("is-invalid"))?.focus();
          toast("Check the form", "Some fields still need attention.", "warning");
          return;
        }
        const submit = $('[type="submit"]', form);
        const original = submit?.innerHTML;
        if (submit) {
          submit.disabled = true;
          submit.innerHTML = "<span>Sending\u2026</span>";
        }
        await fakeSend();
        if (submit) {
          submit.disabled = false;
          submit.innerHTML = original;
        }
        form.reset();
        fields.forEach((el) => el.classList.remove("is-invalid"));
        const done = form.dataset.async || "Sent";
        toast(done, form.dataset.asyncNote || "", "success");
        const success = $("[data-form-success]", form.parentElement || form);
        if (success) success.hidden = false;
      });
    });
    $$("[data-newsletter]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = $('input[type="email"]', form);
        if (!validate(input)) {
          input.focus();
          return;
        }
        const known = storage.get("af-subscribed", []);
        if (known.includes(input.value.toLowerCase())) {
          toast("Already subscribed", "That address is on the list.", "info");
          return;
        }
        const submit = $('[type="submit"]', form);
        if (submit) submit.disabled = true;
        await fakeSend(700);
        if (submit) submit.disabled = false;
        storage.set("af-subscribed", [...known, input.value.toLowerCase()]);
        form.reset();
        toast("You are on the list", "Check your inbox for the confirmation.", "success");
        const modal = form.closest(".modal");
        if (modal && window.bootstrap) window.bootstrap.Modal.getInstance(modal)?.hide();
      });
    });
  }
  function initForms() {
    initValidation();
    initPasswords();
    initSubmits();
  }

  // src/js/modules/video.js
  var DEFAULT_TRAILER = "dQw4w9WgXcQ";
  var frame = (id, title) => `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1"
    title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
    allowfullscreen loading="lazy"></iframe>`;
  function initVideo() {
    const modalEl = $("#af-trailer");
    on(document, "click", "[data-preview], [data-trailer]", (event, btn) => {
      event.preventDefault();
      if (!modalEl || !window.bootstrap) return;
      const host = $("[data-trailer-host]", modalEl);
      const title = btn.closest("[data-title]")?.dataset.title || btn.dataset.trailerTitle || "Trailer";
      $("#af-trailer-title", modalEl).textContent = `${title} \u2014 trailer`;
      host.innerHTML = frame(btn.dataset.trailer || DEFAULT_TRAILER, `${title} trailer`);
      window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    });
    modalEl?.addEventListener("hidden.bs.modal", () => {
      const host = $("[data-trailer-host]", modalEl);
      if (host) host.innerHTML = "";
    });
    on(document, "click", "[data-video-play]", (event, btn) => {
      const wrap = btn.closest("[data-video]");
      if (!wrap) return;
      wrap.innerHTML = frame(wrap.dataset.video || DEFAULT_TRAILER, wrap.dataset.title || "Video");
    });
  }

  // src/js/modules/pages.js
  var icon2 = (n) => `<svg class="af-icon" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
  var EPISODE_TITLES = [
    "The journey begins",
    "An unexpected ally",
    "What the rain remembers",
    "Two steps behind",
    "The weight of a promise",
    "Nightfall",
    "Everything he left behind",
    "The long way round",
    "Held together with string",
    "A quiet kind of courage",
    "The last train home",
    "Where it ends"
  ];
  var episodeTitle = (n) => EPISODE_TITLES[(n - 1) % EPISODE_TITLES.length];
  async function initDetails() {
    const root = $("[data-detail]");
    if (!root) return;
    const { anime } = await getCatalogue();
    const slug = params().get("id") || root.dataset.detail || anime[0]?.slug;
    const item = anime.find((a) => a.slug === slug) || anime[0];
    if (!item) return;
    trackView(item.slug);
    document.title = `${item.title} \xB7 AnimeFlow Pro`;
    const set = (sel, value, asHtml = false) => {
      const el = $(sel, root);
      if (!el) return;
      if (asHtml) el.innerHTML = value;
      else el.textContent = value;
    };
    set("[data-d-title]", item.title);
    set("[data-d-synopsis]", item.synopsis);
    set("[data-d-studio]", item.studio);
    set("[data-d-year]", item.year);
    set("[data-d-type]", item.type);
    set("[data-d-status]", item.status);
    set("[data-d-episodes]", item.episodes || "\u2014");
    set("[data-d-duration]", `${item.duration} min`);
    set("[data-d-rating]", item.rating ? item.rating.toFixed(1) : "\u2014");
    set("[data-d-genres]", item.genres.map((g) => `<a class="af-pill" href="browse.html?genre=${encodeURIComponent(g)}">${escapeHtml(g)}</a>`).join(""), true);
    $$("[data-d-poster]", root).forEach((img) => {
      img.src = `assets/img/posters/${item.slug}.svg`;
      img.alt = `${item.title} poster`;
    });
    const backdrop = $("[data-d-backdrop]", root);
    if (backdrop) {
      backdrop.src = `assets/img/backdrops/${item.slug}.svg`;
      backdrop.addEventListener("error", () => {
        backdrop.src = `assets/img/posters/${item.slug}.svg`;
      }, { once: true });
    }
    $$("[data-d-watch]", root).forEach((a) => {
      a.href = `watch.html?id=${item.slug}`;
    });
    const heart = $("[data-d-heart]", root);
    if (heart) {
      heart.dataset.watchlist = item.slug;
      heart.closest("[data-title]")?.setAttribute("data-title", item.title);
    }
    root.dataset.title = item.title;
    syncButtons(root);
    const list = $("[data-d-episodes-list]", root);
    if (list) {
      const total = Math.min(item.episodes || 0, 12);
      const progress = getProgress()[item.slug];
      list.innerHTML = total ? Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const watched = progress ? n < progress.episode : false;
        const pct = progress && progress.episode === n ? progress.percent : 0;
        return `<li class="af-episode${watched ? " is-watched" : ""}">
            <a class="af-episode-link" href="watch.html?id=${item.slug}&ep=${n}">
              <span class="af-episode-thumb">${icon2("play-fill")}<b>${n}</b></span>
              <span class="af-episode-body">
                <span class="af-episode-title">${escapeHtml(episodeTitle(n))}</span>
                <span class="af-muted">${item.duration} min${watched ? " \xB7 Watched" : ""}</span>
                ${pct ? `<div class="progress af-progress af-progress-xs" role="progressbar" aria-label="Episode ${n} progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div>` : ""}
              </span>
            </a>
          </li>`;
      }).join("") : `<li class="af-muted" style="padding:1rem">Episodes are announced closer to the premiere.</li>`;
    }
    const related = $("[data-d-related]", root);
    if (related) {
      const others = anime.filter((a) => a.slug !== item.slug && a.genres.some((g) => item.genres.includes(g))).sort((a, b) => b.rating - a.rating).slice(0, 10);
      related.innerHTML = others.map((a) => cardHTML(a)).join("");
      syncButtons(related);
      initRails(related.closest(".af-rail-section") || document);
      document.dispatchEvent(new CustomEvent("af:cardsrendered", { detail: { root: related } }));
    }
  }
  async function initWatch() {
    const root = $("[data-watch]");
    if (!root) return;
    const { anime } = await getCatalogue();
    const slug = params().get("id") || anime[0]?.slug;
    const item = anime.find((a) => a.slug === slug) || anime[0];
    if (!item) return;
    const total = Math.max(1, Math.min(item.episodes || 12, 12));
    let current = Math.min(Math.max(1, Number(params().get("ep")) || 1), total);
    trackView(item.slug);
    const video = $("[data-video]", root);
    const list = $("[data-watch-episodes]", root);
    const paint = () => {
      document.title = `${item.title} \u2014 Episode ${current} \xB7 AnimeFlow Pro`;
      $("[data-w-title]", root).textContent = item.title;
      $("[data-w-episode]", root).textContent = `Episode ${current} \xB7 ${episodeTitle(current)}`;
      $("[data-w-meta]", root).textContent = `${item.studio} \xB7 ${item.year} \xB7 ${item.duration} min`;
      const heart = $("[data-watchlist]", root);
      if (heart) {
        heart.dataset.watchlist = item.slug;
      }
      root.dataset.title = item.title;
      syncButtons(root);
      if (video) {
        video.dataset.title = `${item.title} episode ${current}`;
        const img = $("img", video);
        if (img) {
          img.src = `assets/img/backdrops/${item.slug}.svg`;
          img.addEventListener("error", () => {
            img.src = `assets/img/posters/${item.slug}.svg`;
          }, { once: true });
        }
      }
      if (list) {
        list.innerHTML = Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          return `<li class="af-episode${n === current ? " is-current" : ""}${n < current ? " is-watched" : ""}">
          <button type="button" class="af-episode-link" data-goto-episode="${n}" ${n === current ? 'aria-current="true"' : ""}>
            <span class="af-episode-thumb">${icon2(n === current ? "play-fill" : "play-circle-fill")}<b>${n}</b></span>
            <span class="af-episode-body">
              <span class="af-episode-title">${escapeHtml(episodeTitle(n))}</span>
              <span class="af-muted">${item.duration} min</span>
            </span>
          </button>
        </li>`;
        }).join("");
      }
      $("[data-w-prev]", root)?.toggleAttribute("disabled", current === 1);
      $("[data-w-next]", root)?.toggleAttribute("disabled", current === total);
      saveProgress(item.slug, current, 5);
      history.replaceState(null, "", `?id=${item.slug}&ep=${current}`);
    };
    on(root, "click", "[data-goto-episode]", (event, btn) => {
      current = Number(btn.dataset.gotoEpisode);
      paint();
      $("[data-watch-player]", root)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("[data-w-prev]", root)?.addEventListener("click", () => {
      if (current > 1) {
        current -= 1;
        paint();
      }
    });
    $("[data-w-next]", root)?.addEventListener("click", () => {
      if (current < total) {
        current += 1;
        paint();
      }
    });
    paint();
    const cd = $("[data-countdown]");
    if (cd) {
      const target = /* @__PURE__ */ new Date();
      target.setDate(target.getDate() + ((6 - target.getDay() + 7) % 7 || 7));
      target.setHours(17, 0, 0, 0);
      const tick = () => {
        const diff = Math.max(0, target - Date.now());
        const days = Math.floor(diff / 864e5);
        const hours = Math.floor(diff / 36e5 % 24);
        const mins = Math.floor(diff / 6e4 % 60);
        const secs = Math.floor(diff / 1e3 % 60);
        const put = (u, v) => {
          const el = $(`[data-cd="${u}"]`, cd);
          if (el) el.textContent = String(v).padStart(2, "0");
        };
        put("days", days);
        put("hours", hours);
        put("minutes", mins);
        put("seconds", secs);
      };
      tick();
      setInterval(tick, 1e3);
    }
  }
  async function initDashboard() {
    const root = $("[data-dashboard]");
    if (!root) return;
    const { anime } = await getCatalogue();
    const progress = getProgress();
    const watchlist = getWatchlist();
    const stats = {
      watching: Object.keys(progress).length,
      saved: watchlist.length,
      hours: Object.values(progress).reduce((sum, p) => sum + Math.round(p.episode * 24 / 60), 0),
      streak: storage.get("af-streak", 7)
    };
    Object.entries(stats).forEach(([key, value]) => {
      const el = $(`[data-stat="${key}"]`, root);
      if (el) {
        el.dataset.count = String(value);
        el.textContent = "0";
      }
    });
    const host = $("[data-continue-grid]", root);
    if (host) {
      const seeded = root.dataset.seed ? JSON.parse(root.dataset.seed) : [];
      const entries = Object.entries(progress).map(([slug, p]) => ({ slug, episode: p.episode, progress: p.percent, at: p.at })).sort((a, b) => b.at - a.at);
      const items = (entries.length ? entries : seeded).map((e) => ({ ...e, item: anime.find((a) => a.slug === e.slug) })).filter((e) => e.item).slice(0, 4);
      host.innerHTML = items.length ? items.map(({ item, episode, progress: pct }) => `
      <article class="af-continue" data-slug="${item.slug}" data-title="${escapeHtml(item.title)}">
        <a href="watch.html?id=${item.slug}&ep=${episode}" class="af-continue-media">
          <img src="assets/img/backdrops/${item.slug}.svg" alt="" width="1280" height="720" loading="lazy" decoding="async"
               onerror="this.src='assets/img/posters/${item.slug}.svg'">
          <span class="af-continue-play">${icon2("play-fill")}</span>
        </a>
        <div class="af-continue-body">
          <h3><a href="watch.html?id=${item.slug}&ep=${episode}">${escapeHtml(item.title)}</a></h3>
          <p class="af-muted">Episode ${episode} \xB7 ${Math.max(0, 100 - pct)}% left</p>
          <div class="progress af-progress af-progress-xs" role="progressbar" aria-label="${escapeHtml(item.title)} progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div>
        </div>
      </article>`).join("") : `<p class="af-muted">Nothing in progress yet \u2014 press play on anything and it will appear here.</p>`;
    }
    const fav = $("[data-favourites-grid]", root);
    if (fav) {
      const items = watchlist.map((s) => anime.find((a) => a.slug === s)).filter(Boolean).slice(0, 6);
      fav.innerHTML = items.length ? items.map((a) => cardHTML(a)).join("") : `<p class="af-muted" style="grid-column:1/-1">Your favourites will show up here once you heart a few titles.</p>`;
      syncButtons(fav);
    }
    document.dispatchEvent(new CustomEvent("af:cardsrendered", { detail: { root } }));
  }
  function initPricing() {
    const toggle = $("[data-billing-toggle]");
    if (!toggle) return;
    const apply = () => {
      const yearly = toggle.checked;
      $$("[data-price-monthly]").forEach((el) => {
        const value = Number(yearly ? el.dataset.priceYearly : el.dataset.priceMonthly);
        el.textContent = value === 0 ? "0" : value.toFixed(2).replace(/\.00$/, "");
      });
      $$("[data-price-period]").forEach((el) => {
        el.textContent = yearly ? "/year" : "/month";
      });
      $$("[data-billing-save]").forEach((el) => {
        el.hidden = !yearly;
      });
    };
    toggle.addEventListener("change", apply);
    apply();
  }
  async function initBlogPost() {
    const root = $("[data-post]");
    if (!root) return;
    const posts = await getPosts();
    if (!posts.length) return;
    const slug = params().get("slug");
    const post = posts.find((p) => p.slug === slug) || posts[0];
    const article = $(`[data-post-body="${post.slug}"]`);
    $$("[data-post-body]").forEach((el) => {
      el.hidden = el !== article;
    });
    if (article) {
      document.title = `${post.title} \xB7 AnimeFlow Pro`;
      $("[data-post-title]", root).textContent = post.title;
      $("[data-post-date]", root).textContent = post.date;
      $("[data-post-read]", root).textContent = `${post.readingTime} min read`;
      $("[data-post-category]", root).textContent = post.category;
      $("[data-post-author]", root).textContent = post.author;
      const cover = $("[data-post-cover]", root);
      if (cover) cover.src = `assets/img/backdrops/${post.cover}.svg`;
    }
    const more = $("[data-post-more]", root);
    if (more) {
      const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
      more.innerHTML = others.map((p) => `<article class="af-post">
      <a class="af-post-media" href="blog-post.html?slug=${p.slug}" tabindex="-1" aria-hidden="true">
        <img src="assets/img/backdrops/${p.cover}.svg" alt="" width="1280" height="720" loading="lazy" decoding="async"></a>
      <div class="af-post-body">
        <div class="af-post-meta"><span class="badge af-badge af-badge-soft">${escapeHtml(p.category)}</span><span class="af-muted">${escapeHtml(p.date)}</span></div>
        <h3><a href="blog-post.html?slug=${p.slug}">${escapeHtml(p.title)}</a></h3>
      </div></article>`).join("");
    }
  }
  function initShare() {
    on(document, "click", "[data-share]", async (event, btn) => {
      event.preventDefault();
      const data = { title: document.title, url: location.href };
      try {
        if (navigator.share) {
          await navigator.share(data);
          return;
        }
        await navigator.clipboard.writeText(location.href);
        toast("Link copied", "Paste it wherever you like.", "success");
      } catch (err) {
        if (err?.name !== "AbortError") toast("Could not share", "Copy the address bar instead.", "warning");
      }
    });
  }
  function initPages() {
    initDetails();
    initWatch();
    initDashboard();
    initPricing();
    initBlogPost();
    initShare();
  }

  // src/js/animeflow.js
  window.bootstrap = { Offcanvas: import_offcanvas.default, Modal: import_modal.default };
  function boot() {
    initTheme();
    initWidgets();
    initUI();
    initWatchlist();
    initSearch();
    initRails();
    initMotion();
    initForms();
    initVideo();
    initCatalog();
    initPages();
    document.documentElement.classList.add("af-ready");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
  window.AnimeFlow = { toast, cardHTML, skeletonHTML, getCatalogue, initRails, version: "1.0.0" };
})();
