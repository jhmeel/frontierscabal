function getMimeType(base64String) {
    const match = base64String?.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (match && match.length > 1) {
      return match[1];
    }
    return 'image/jpeg'; 
  }
  

  export default getMimeType