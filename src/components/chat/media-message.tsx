import React from "react";

export interface IImageMessageProps {
    // ссылка на изображение
    src: string;
}

/**
 * Компонент сообщение - картинка или текст
 */
const MediaMessage: React.FunctionComponent<IImageMessageProps> = ({ src }) => {
    const [data, setData] = React.useState<string | { src: string } | undefined>();

    React.useEffect(() => {
        const onLoad = () =>  setData({ src });
        const onError = () => setData(src);

        const image = new Image();
        image.src = src;

        image.addEventListener('load', onLoad); 
        image.addEventListener('error', onError); 

        return () => {
            image.removeEventListener('load', onLoad);
            image.removeEventListener('error', onError);
        }
    }, [])

    if (data === undefined) {
        return <>Loading...</>;
    }

    if (data.hasOwnProperty('src')) {
        return <img className="text--image" src={src} alt="image" />
    }

    return <>{src}</>

}

export default MediaMessage;