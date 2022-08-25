import React, {useEffect} from 'react'

const useClickOutside = (ref:any, currentClassName: string | null, callback:Function) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event:any) {
      console.log(event.target)
      console.log(currentClassName)
      if(currentClassName) {
        if(ref.current && event.target.className !== currentClassName) {
          callback()
        }
        return;
      }
      if (ref.current) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default useClickOutside;