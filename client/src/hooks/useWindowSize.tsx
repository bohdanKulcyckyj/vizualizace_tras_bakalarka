import { useEffect, useState } from 'react'

type TWindowSize = {
    width: number,
    height: number
} | null

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<TWindowSize>(null)


    useEffect(() => {
        const windowSizeHandler = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        };
        window.addEventListener("resize", windowSizeHandler);
    
        return () => {
          window.removeEventListener("resize", windowSizeHandler);
        };
      }, []);

  return windowSize
}

export default useWindowSize