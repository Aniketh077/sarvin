import React from 'react';

const convertGoogleDriveLink = (url) => {
  const match = url.match(/\/file\/d\/([^/]+)\//);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/thumbnail?id=${fileId}`;
  }
  return url;
};

const DriveCompatibleImage = ({ src, alt, ...props }) => {
  const processedSrc = convertGoogleDriveLink(src);
  return <img src={processedSrc} alt={alt} {...props} />;
};

export default DriveCompatibleImage;
