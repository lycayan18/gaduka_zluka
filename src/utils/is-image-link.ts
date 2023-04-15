/**
 * Check if text is a image link
 */
const isImageLink = (text: string): boolean => 
   /((http|https):\/\/.+\.(?:jpg|jpeg|gif|png))/i.test(text);

export default isImageLink;