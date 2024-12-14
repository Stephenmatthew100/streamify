# Streamify

Streamify is a video streaming platform built with Node.js, allowing users to upload, view, and manage videos. The platform provides a home page that lists all uploaded videos, a video upload page, and a video player page. Key features include the ability to upload video files, generate thumbnails, and stream videos directly in the browser. This project aims to provide a simple and lightweight solution for personal video streaming giving you the ability to get videeos over local network or possibly extending the feature to an online streaming platform.

## Features

- **Video Upload**: Allows users to upload videos and associate metadata such as title, description, and tags.
- **Thumbnail Generation**: Automatically generates thumbnails for videos, or users can upload their own.
- **Video Streaming**: Videos can be streamed directly from the platform in the browser.
- **Video Listing**: A home page that dynamically lists all uploaded videos with thumbnails and metadata.
- **Responsive Design**: Optimized for both desktop and mobile users.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript (with dynamic elements for video upload and listing)
- **Database**: NeDB (local, lightweight NoSQL database)
- **Video Handling**: FFmpeg (for thumbnail generation)
- **File Storage**: Multer (for handling file uploads)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Stephenmatthew100/streamify.git
cd streamify
```

### 2. Install Dependencies

Make sure you have **Node.js** installed, then install the required packages:

```bash
npm install
```

### 3. Set Up Directories

Ensure the following directories exist for storing uploaded videos and thumbnails:

- `public/videos/` – For storing uploaded videos
- `public/videos/thumbnails/` – For storing generated thumbnails

If these directories do not exist, you can create them manually or let the application create them automatically when files are uploaded.

### 4. Start the Server

Run the Node.js server using the following command:

```bash
npm start
```

The server will start at `http://localhost:3000`.

### 5. Access the Application

Open your browser and go to `http://localhost:3000` to start using the platform.

## Usage

1. **Home Page**: Displays a list of all uploaded videos with thumbnails and metadata (e.g., title, description, and tags).
2. **Upload Page**: Allows you to upload videos and thumbnails, as well as enter metadata (title, description, tags).
3. **Video Player Page**: Streams videos directly in the browser. Supports video seeking and buffering.

## Folder Structure

```plaintext
.
├── public/
│   ├── icon/
│   │   └── download.svg
│   ├── index.html
│   ├── master.css
│   ├── player/
│   │   ├── index.html
│   │   └── player.js
│   ├── upload_video/
│   │   ├── index.html
│   │   └── style.css
│   ├── videos/           # Stores uploaded videos
│   └── videos/thumbnails/ # Stores generated thumbnails
├── server.js             # Main application file
├── package.json          # Project dependencies
├── package-lock.json     # Lock file for dependencies
└── README.md             # Project description
```

## Future Improvements

- **Search Functionality**: Implement a search feature that allows users to find videos by title or tags.
- **User Authentication**: Add login and registration functionality for users to manage their videos.
- **Advanced Video Features**: Support for multiple video formats, quality options, and subtitles.
- **Cloud Storage Integration**: Use cloud storage (e.g., AWS S3) to store video files and thumbnails.
- **Video management**: Allow other video management options like deleting editing information etc
## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
