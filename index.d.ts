declare module 'selectricity' {
  interface SelectObject extends HTMLElement {
    execute: () => void;
    listen: (
      eventName: string,
      callback: (data: CallbackData) => void,
      dynamic?: boolean
    ) => void;
    modifyClass: (method: string, className: string) => void;
    addClass: (className: string) => void;
    removeClass: (className: string) => void;
    toggleClass: (className: string) => void;
    addAttr: (attribute: string, value?: string | number | boolean) => void;
    removeAttr: (attribute: string) => void;
    toggleAttr: (attribute: string, value?: string | number | boolean) => void;
  }

  interface CallbackData {
    $node: SelectObject;
    index: number;
    e: Event;
  }

  interface SelectObjectArray extends Array<SelectObject>, SelectObject {}

  export default function select(
    selector: string | HTMLElement,
    parent?: string | HTMLElement
  ): SelectObject | SelectObjectArray;
}
