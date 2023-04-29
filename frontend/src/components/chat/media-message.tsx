import React from "react";

export interface IImageMessageProps {
    // link to the image
    src: string;
}

/**
 * This component stands for detecting media links in messages and showing media if needed
 */
const MediaMessage: React.FunctionComponent<IImageMessageProps> = ({ src }) => {
    const initialValue = src.match(/^(http|https):\/\/\S+$/) === null
                        ? "text"
                        : src.match(/^https:\/\/www.youtube.com\/watch\?v=\S+$/) === null
                        ? "media"
                        : "youtube-video";

    const [dataType, setDataType] = React.useState<"text" | "media" | "image" | "video" | "audio" | "youtube-video">(initialValue);

    React.useEffect(() => {
        // Initial value can be undefined ( in case we detected link and we want to check that for media content )
        // or string ( in case we detected, that this message is a usual text message )
        // So, if initialValue is undefined, then it's usual text message and we have no need to check that message
        if(initialValue === "text") {
            return;
        }

        const onImageLoad = () => setDataType("image");
        const onVideoLoad = () => setDataType("video");
        const onAudioLoad = () => setDataType("audio");

        const image = new Image();
        image.src = src;
        
        const video = document.createElement("video");
        video.src = src;

        const audio = document.createElement("audio");
        audio.src = src;

        image.addEventListener('load', onImageLoad);
        video.addEventListener('canplaythrough', onVideoLoad);
        audio.addEventListener('canplaythrough', onAudioLoad);

        return () => {
            image.removeEventListener('load', onImageLoad);
            video.removeEventListener('canplaythrough', onVideoLoad);
            audio.removeEventListener('canplaythrough', onAudioLoad);
        }
    }, []);

    switch(dataType) {
        case "text": {
            return <>{src}</>;
        }

        case "image": {
            return <img className="text--image" src={src} alt="image" loading="lazy"/>
        }

        case "video": {
            return <video className="text--video" src={src} controls />
        }

        case "audio": {
            return <audio src={src} controls />
        }

        case "youtube-video": {
            return <iframe src={src.replace("watch?v=", "embed/")} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        }
    }

    return <>{src}</>

}

export default MediaMessage;