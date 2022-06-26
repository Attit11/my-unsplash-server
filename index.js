const express = require("express");
const ImageDetails = require("./model/imageDetails");
const multer = require("multer");
const cors = require("cors");
require("./db/mongoose");

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload an image with extension jpg or jpeg or png")
      );
    }

    cb(undefined, true);
  },
});

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

app.post(
  "/upload-picture",
  upload.single("picture"),
  async (req, res) => {
    try {
      const { label } = req.body;
      const picture = req.file.buffer;
      const imageDetails = new ImageDetails({ label, picture });
      await imageDetails.save();
      res.send({
        label: imageDetails.label,
        message: "picture has been uploaded",
      });
    } catch (e) {
      res.status(401).send({ error: e.message });
    }
  },
  (error, req, res, next) => {
    res.status(401).send({ error: error.message });
  }
);

app.get("/get-all-images", async (req, res) => {
  try {
    const imageDetails = await ImageDetails.find({});
    if (!imageDetails) {
      return res.status(404).send({ error: "No pic found" });
    }
    res.send(imageDetails);
  } catch (error) {
    res.status(404).send({ error: error });
  }
});

app.delete("/delete-image/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const imageDetail = await ImageDetails.findByIdAndDelete(id, {
      new: true,
    });
    if (!imageDetail) {
      return res.status(404).send({ error: "no picture found" });
    }
    res.send(imageDetail);
  } catch (error) {
    res.status(401).send({ error });
  }
});

app.get("/image/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await ImageDetails.findById(id);
    if (!data) {
      res.status(404).send("Did not find the picture you are looking for");
    }
    res.set("Content-Type", "Image/jpg");
    res.send(data.picture);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running in the port ${PORT}`);
});
