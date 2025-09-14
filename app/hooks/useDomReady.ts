import { useEffect, useState } from "react";

export const useDomReady = () => {
    const [domReady, setDomReady] = useState<boolean>(false);
    useEffect(() => {
        setDomReady(true);
    }, []);

    return { domReady };
}