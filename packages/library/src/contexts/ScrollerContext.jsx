/*
* Custom service wrapper for moved scrollable parent container reference
*
* The hook for this context `useScroller` provides the following:
*   ref, set
*
* This is a reference to the scrollable parent DOM element for use in
* onScroll bindings throughout the app for children components and a function
* for updating that element
*
* This context exposes three exports to implement scroller context
* See the examples below for how to implement each approach
*
* Use full context for class component
* example:
*    import { ScrollerContext } from '@moved/services';
*    static contextType = ScrollerContext;
*    const scroller = this.context.scroller;
*    scroller.current.addEventListener('onscroll', (e) => ...do something...);
*
* Use context hook for functional component
* example:
*    import { useScroller } from '@moved/services';
*    const { ref } = useScroller();
*    ref.current.addEventListener('onscroll', (e) => ...do something...);
*
* Use context provider component for wrapping the global application
* (not needed more than once per app, usually in the Root component)
* example:
*    import { ScrollerProvider } from '@moved/services';
*    render (
*      <ScrollerProvider> ... </ScrollerProvider>
*    )
*/
import React, { createContext, useContext, useRef } from "react";

const ScrollerContext = createContext();
const useScroller = () => useContext(ScrollerContext);

// define ScrollerContextProvider as functional component
const ScrollerProvider = (props) => {
  const scroller = useRef(window);
  const setScroller = (ref) => scroller.current = ref;
  const context = { ref: scroller, set: setScroller };
  return (
    <ScrollerContext.Provider value={context}>{props.children}</ScrollerContext.Provider>
  );
};

export { ScrollerContext, ScrollerProvider, useScroller };
