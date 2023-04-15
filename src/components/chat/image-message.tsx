import React from "react";

export interface IImageMessageProps {
    // ссылка на изображение
    src: string;
}

/**
 * Сообщение - картинка
 */
const ImageMessage: React.FunctionComponent<IImageMessageProps> = ({ src }) => {
    const [data, setData] = React.useState<string | null | undefined>();

    React.useEffect(() => {
        const imgSrc = src.match(/((http|https):\/\/.+\.(?:jpg|jpeg|gif|png))/i)?.[0];
    

        if (imgSrc) {
            const onLoad = () =>  setData(imgSrc);
            const onError = () => setData(null);

            const image = new Image();
            image.src = imgSrc;
    
            image.addEventListener('load', onLoad); 
            image.addEventListener('error', onError); 

            return () => {
                image.removeEventListener('load', onLoad);
                image.removeEventListener('error', onError);
            }
        }

        return;
    }, [])

    if (!data === undefined) {
        return <>Loading image...</>;
    }

    if (data === null) {
        return <>Error while loading image ¯\_(ツ)_/¯</>
    }

    return <img className="text--image" src={data} alt="image" />
}

export default ImageMessage;