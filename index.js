const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const Datastore = require('nedb');

const port = 3000;
const app = express();

// Set up multer storage configuration for video files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'videos')); // Correct path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique names
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'video', maxCount: 1 },     // Handle video upload
  { name: 'thumbnail', maxCount: 1 }  // Handle optional thumbnail upload
]);
const database = new Datastore({ filename: 'database.db', autoload: true }); // Load database
const thumbnail_folder = path.join(__dirname, 'public', 'videos', 'thumbnails'); // Folder for thumbnails

app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


app.get('/', (req, res) => {
  res.sendFile(__dirname, 'public', 'index.html');
})

app.get('/load_vid', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
        res.end()
        return
    }
    res.json(data)}
)
})

app.get('/stream/:video', (req, res) => {
  const video = req.params.video;
  const videoPath = path.join(__dirname, 'public', 'videos', video);

  fs.stat(videoPath, (err, stat) => {
    if (err || !stat.isFile()) {
      console.error('Video file not found:', videoPath);
      return res.status(404).send('Video not found');
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');

    const range = req.headers.range;
    if (range) {
      const videoSize = stat.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunkSize = (end - start) + 1;

      res.status(206); // Partial content
      res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
      res.setHeader('Content-Length', chunkSize);

      const stream = fs.createReadStream(videoPath, { start, end });
      stream.pipe(res);

      stream.on('error', (err) => {
        res.status(500).send('Error reading video file');
      });
    } else {
      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);

      stream.on('error', (err) => {
        res.status(500).send('Error reading video file');
      });
    }
  });
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload_video', 'index.html'));
});

app.post('/upload/video', upload, (req, res) => {
  const { title, tags, url, description } = req.body;
  const videoFile = req.files.video ? req.files.video[0] : null; // Access video file
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null; // Access thumbnail file

  // Check for required fields
  if (!title || !description || !videoFile) {
    return res.status(400).json({ message: 'Missing required fields (video and/or title/description)' });
  }

  // Generate a unique filename for the thumbnail if it's not provided
  const now = Date.now();
  let thumbnailPath = null;

  if (thumbnailFile) {
    // If the user uploaded a thumbnail, move it to the thumbnails folder
    const thumbnailName = Date.now() + path.extname(thumbnailFile.originalname);
    const thumbnailDestPath = path.join(thumbnail_folder, thumbnailName);

    // Move the uploaded thumbnail to the destination folder
    fs.rename(thumbnailFile.path, thumbnailDestPath, (err) => {
      if (err) {
        console.error('Error saving thumbnail:', err);
        return res.status(500).json({ message: 'Error saving thumbnail' });
      }

      console.log('Thumbnail uploaded successfully.');
      thumbnailPath = thumbnailName;  // Update thumbnail path
      saveVideoData();  // Proceed to save video data
    });
  } else {
    // If no thumbnail was uploaded, generate one from the video using ffmpeg
    const thumbnailFileName = `thumbnail-${slugify(title)}-${now}.jpg`;
    const thumbnailDestPath = path.join(thumbnail_folder, thumbnailFileName);

    // Use ffmpeg to generate a thumbnail from the video
    ffmpeg(path.join(__dirname, 'public', 'videos', videoFile.filename))
      .screenshots({
        timestamps: [1], // Capture a thumbnail at 1 second into the video
        filename: thumbnailFileName,
        folder: thumbnail_folder,
      })
      .on('end', () => {
        console.log('Thumbnail generated successfully.');
        thumbnailPath = thumbnailFileName;  // Update thumbnail path
        saveVideoData();  // Proceed to save video data
      })
      .on('error', (err) => {
        console.error('Error generating thumbnail:', err);
        return res.status(500).json({ message: 'Error generating thumbnail' });
      });
  }

  // Function to save video data after thumbnail is handled
  function saveVideoData() {
    const videoData = {
      file_path: videoFile.filename,
      title,
      tags,
      url,
      description,
      thumbnail: thumbnailPath, // Store thumbnail path in the database
    };

    // Insert video data into the database
    database.insert(videoData, (err, newDoc) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving video to database' });
      }

      // Respond with success
      res.status(200).json({
        message: 'Video uploaded successfully!',
        videoFile: videoFile.filename,
        thumbnail: thumbnailPath,
      });
    });
  }
});

function slugify(str) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}
