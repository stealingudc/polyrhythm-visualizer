import React from "react"

export default (callback?: (node: any, ...args: any[]) => any) => {
  const ref = React.useRef<any>();
  React.useCallback((node: any) => {
    if(node){
      callback ? callback(node) : null; 
    }

    ref.current = node;
  }, []);

  return ref;
}
