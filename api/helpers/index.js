const fs = require("fs");
const Jimp = require("jimp");
const Axios = require("axios");
const slugify = require("slugify");
const MergeImages = require("merge-images");
const download = require("image-downloader");
const { Canvas, Image } = require("canvas");

// Custom slug generator
const CustomSlug = (data) => {
  let newSlug = slugify(data, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: /[`/|*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
  });
  newSlug = newSlug + "-" + Date.now();
  return newSlug;
};

// Host URL from server
const HostURL = (req) => {
  // return "http://" + req.headers.host + "/";
  return "https://api.efgtailor.com/";
};

// Single file upload
const UploadFile = async (data, path) => {
  try {
    const image = data;
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    const newName = Date.now() + ".png";
    uploadPath = path + newName;
    const moveFile = image.mv(uploadPath);

    if (moveFile) return newName;
  } catch (error) {
    if (error) return error;
  }
};

// Single file upload with resize
const UploadFileWithResize = async (file, uploadpath, width, height) => {
  try {
    let image = await Jimp.read(file.data);
    await image.resize(parseInt(width), parseInt(height));
    await image.quality(50);

    if (!fs.existsSync(uploadpath))
      fs.mkdirSync(uploadpath, { recursive: true });

    const newFile = "product-" + Date.now() + ".png";
    await image.write(uploadpath + "/" + newFile);
    return newFile;
  } catch (error) {
    if (error) return error;
  }
};

// Delete file from specific destination
const DeleteFile = (destination, file) => {
  fs.unlink(destination + file, function (error) {
    if (error) {
      return error;
    }
    return;
  });
};

// Copy file to another directory
const CopyFile = async (from, to) => {
  try {
    await fs.copyFileSync(from, to);
    return true;
  } catch (error) {
    if (error) return false;
  }
};

// Extract route group name
const RouteGroupName = (path) => {
  return path.replace(/\//g, " ").split(" ")[1];
};

// Merge elements
const MergeElements = async (items, req, destination) => {
  try {
    const mergResponse = await MergeImages([...items], {
      Canvas: Canvas,
      Image: Image,
    });

    if (mergResponse) {
      const file = {
        src: mergResponse,
      };

      // if (result) return file;
      return file;
    }
  } catch (error) {
    if (error) return false;
  }
};

// Remove Background
const RemoveBg = async (fileName) => {
  try {
    const data = { image_name: fileName };

    const config = {
      method: "POST",
      url: "https://imageprocessor.efgtailor.com/remove/",
      data: data,
    };

    const response = await Axios(config);
    if (response && response.status === 200) return response.data.data.image;
  } catch (error) {
    if (error) return false;
  }
};

// Download image
const DownloadImage = (url, filepath) => {
  return download.image({
    url,
    dest: filepath,
  });
};

// Button generate
const GenerateButton = async (data) => {
  try {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const response = await Axios.post(
      `https://imageprocessor.efgtailor.com/buttongen/`,
      data,
      config
    );
    if (response && response.status === 200) return response.data.data.button;
  } catch (error) {
    if (error) return false;
  }
};

const IsValidURL = (string) => {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

module.exports = {
  CustomSlug,
  HostURL,
  UploadFile,
  UploadFileWithResize,
  DeleteFile,
  CopyFile,
  RouteGroupName,
  MergeElements,
  RemoveBg,
  DownloadImage,
  GenerateButton,
  IsValidURL,
};
