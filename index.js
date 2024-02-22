const nodeListPrototype = {
  execute(fn) {
    if (this instanceof Element || this instanceof HTMLDocument) {
      fn(this);
    } else {
      this.forEach((node, index) => {
        fn(node, index);
      });
    }
  },
  listen(eventName, callback, dynamic) {
    const callbackWithNode = ($node, index) => (e) =>
      callback({ $node, index, e });

    const events = eventName.split(' ');

    this.execute((node, index) => {
      const extendedNode = Object.assign(node, nodeListPrototype);
      if (dynamic) {
        events.forEach(event => {
          document.addEventListener(event, (e) => {
            const $intendedNode = e.target.closest(this.selectedWith);
            if ($intendedNode) {
              callbackWithNode(extendedNode, index)(e);
            }
          });
        });
      } else {
        events.forEach(event => {
          extendedNode.addEventListener(event, (e) =>
            callbackWithNode(extendedNode, index)(e)
          );
        })
      }
    });
  },
  modifyClass(method, className) {
    this.execute((node) => node.classList[method](className));
  },
};

function select(selector, parent = document) {
  /*
    Selector can either be a node or string.
    If string, select the appropriate nodes within the parent (default is document),
    otherwise continue
  */
  const object =
    typeof selector === 'string' ? parent.querySelectorAll(selector) : selector;

  /*
    For each node, attach the custom helper functions from the nodeListPrototype above
  */
  const mappedObject = [...object].map((item) =>
    Object.assign(item, nodeListPrototype, { selectedWith: selector })
  );

  /*
    If the node list contains only a single node, return the node itself, otherwise return the array of nodes
  */
  const selectObject =
    mappedObject && mappedObject.length === 1 ? mappedObject[0] : mappedObject;

  /*
    Attach the custom helper functions to the returned object itself.
    (Useful for executing a custom function on every item in the object (modifyClass))
  */
  const extendedObject = Object.assign(selectObject, nodeListPrototype);

  return extendedObject;
}

export { select as default };
