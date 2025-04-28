const truncateText = (text: string, maxLength: number) => {
  // Remove anything within parentheses and the parentheses themselves
  if (text) {
    const cleanedText = text.replace(/\(.*?\)/g, '').trim();

    // Truncate the text if it exceeds the maxLength
    if (cleanedText.length > maxLength) {
      return `${cleanedText.slice(0, maxLength)}...`;
    }

    return cleanedText;
  }
};

export default truncateText;
