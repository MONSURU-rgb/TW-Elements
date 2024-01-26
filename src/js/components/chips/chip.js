/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

import { element, typeCheckConfig } from "../../util/index";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import { getChip } from "./templates";

/**
 *
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "chip";
const DATA_KEY = `te.${NAME}`;

const ATTR_CHIP_CLOSE = "data-te-chip-close";

const ATTR_SELECTOR_CHIP_CLOSE = `[${ATTR_CHIP_CLOSE}]`;

const EVENT_DELETE = "delete.te.chips";
const EVENT_SELECT = "select.te.chip";

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;

const DefaultType = {
  text: "string",
  closeIcon: "boolean",
  img: "object",
  iconSVG: "string",
};

const Default = {
  text: "",
  closeIcon: false,
  img: { path: "", alt: "" },
  iconSVG: defaultIcon,
};

const DefaultClasses = {
  icon: "float-right pl-2 text-base opacity-[.53] cursor-pointer transition-all duration-200 ease-in-out",
  chipElement:
    "flex justify-between items-center h-8 leading-loose py-[5px] px-3 mr-4 my-[5px] text-[13px] font-normal text-surface cursor-pointer bg-zinc-50 dark:text-white dark:bg-neutral-700 rounded-2xl transition-[opacity] duration-300 ease-linear [word-wrap: break-word] shadow-none normal-case hover:!shadow-none inline-block font-medium leading-normal text-center no-underline align-middle cursor-pointer select-none border-[.125rem] border-solid border-transparent py-1.5 px-3 text-xs rounded",
  chipCloseIcon:
    "w-4 float-right cursor-pointer pl-1 text-[16px] dark:text-white/30 opacity-[.53] transition-all duration-200 ease-in-out hover:text-black/50 text-black/30 dark:hover:text-white/50 [&>svg]:h-4 [&>svg]:w-4",
};

const DefaultClassesType = {
  icon: "string",
  chipElement: "string",
  chipCloseIcon: "string",
};

class Chip {
  constructor(element, data = {}, classes) {
    this._element = element;
    this._options = this._getConfig(data);
    this._classes = this._getClasses(classes);
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  init() {
    this._appendCloseIcon();
    this._handleDelete();
    this._handleTextChip();
    this._handleClickOnChip();
  }

  dispose() {
    this._element = null;
    this._options = null;
    EventHandler.off(this._element, "click");
  }

  appendChip() {
    const { text, closeIcon, iconSVG } = this._options;
    const chip = getChip({ text, closeIcon, iconSVG }, this._classes);

    return chip;
  }

  // Private

  _appendCloseIcon(el = this._element) {
    if (SelectorEngine.find(ATTR_SELECTOR_CHIP_CLOSE, this._element).length > 0)
      return;

    if (this._options.closeIcon) {
      const createIcon = element("span");

      createIcon.classList = this._classes.icon;
      createIcon.setAttribute(ATTR_CHIP_CLOSE);
      createIcon.innerHTML = this._options.iconSVG;

      el.insertAdjacentElement("beforeend", createIcon);
    }
  }

  _handleClickOnChip() {
    EventHandler.on(this._element, "click", (event) => {
      const { textContent } = event.target;
      const obj = {};

      obj.tag = textContent.trim();

      EventHandler.trigger(EVENT_SELECT, { event, obj });
    });
  }

  _handleDelete() {
    const deleteElement = SelectorEngine.find(
      ATTR_SELECTOR_CHIP_CLOSE,
      this._element
    );

    if (deleteElement.length === 0) return;

    EventHandler.on(this._element, "click", ATTR_SELECTOR_CHIP_CLOSE, () => {
      EventHandler.trigger(this._element, EVENT_DELETE);
      this._element.remove();
    });
  }

  _handleTextChip() {
    if (this._element.innerText !== "") return;

    this._element.innerText = this._options.text;
  }

  _getConfig(options) {
    const config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...options,
    };

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  _getClasses(classes) {
    const dataAttributes = Manipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }
}

export default Chip;
