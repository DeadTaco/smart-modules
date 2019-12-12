/* 
sm.eventmapper.js
Sets up interactive events for the DOM and its elements
*/

SmartModule.addModule("events", {
  description: [
    "sm.eventmapper.js",
    "Sets up interactive events for the DOM and its elements"
  ],
  eventList: {},
  add(querySelector, eventName, evt) {
    let nodes = document.querySelectorAll(querySelector);
    Array.from(nodes).map(node => {
      // Keep a tally of what events are added to an element.  For debugging as well as preventing duplicates
      if (!this.eventList[node]) this.eventList[node] = {};
      if (!this.eventList[node][eventName])
        this.eventList[node][eventName] = "";
      if (this.eventList[node][eventName] != "") {
        // console.warn(`Warning: An element within "${querySelector}" already has an event bound to it named "${eventName}"!  This event being overwritten!`); // [DEBUG]
        node.removeEventListener(eventName, this.eventList[node][eventName]);
      }
      this.eventList[node][eventName] = evt;
      node.addEventListener(eventName, evt);
    });
    return nodes;
  },
  remove(querySelector, eventName) {
    let nodes = document.querySelectorAll(querySelector);
    // Keep a tally of what events are removed from an element.  For debugging as well as preventing duplicates
    Array.from(nodes).map(node => {
      if (this.eventList[node]) {
        // No events were bound to this element, so just return without doing anything.
        if (this.eventList[node][eventName]) {
          node.removeEventListener(eventName, this.eventList[node][eventName]);
        }
      }
    });
    return nodes;
  },
  removeAll(querySelector) {
    let nodes = document.querySelectorAll(querySelector);
    // Keep a tally of what events are removed from an element.  For debugging as well as preventing duplicates
    Array.from(nodes).map(node => {
      if (this.eventList[node]) {
        // No events were bound to this element, so just return without doing anything.
        Object.keys(this.eventList[node]).map(key => {
          if (this.eventList[node][key]) {
            node.removeEventListener(key, this.eventList[node][key]);
            console.log(`Removing ${key}`);
          }
        });
      }
    });
    return nodes;
  },
 });
