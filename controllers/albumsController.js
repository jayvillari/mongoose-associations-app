const router = require("express").Router();
const Album = require("../models/album").Album;
const Song = require("../models/album").Song;

// INDEX (GET)
router.get("/", (req, res) => {
  Album.find({}, (error, allAlbums) => {
    res.render("albums/index.ejs", {
      albums: allAlbums,
    });
  });
});

// NEW ALBUM FORM
router.get("/new", (req, res) => {
  res.render("albums/new.ejs");
});

// ADD EMPTY FORM TO ALBUM SHOW PAGE TO ADD SONG TO ALBUM
router.get("/:albumID", (req, res) => {
  // find user in db by id and add new tweet
  Album.findById(req.params.albumID, (error, album) => {
    res.render("albums/show.ejs", { album });
  });
});

// CREATE A NEW ALBUM
router.post("/", (req, res) => {
  Album.create(req.body, (error, album) => {
    res.redirect(`/albums/${album.id}`);
  });
});

// CREATE SONG EMBEDDED IN ALBUM
router.post("/:albumID/songs", (req, res) => {
  console.log(req.body);
  // store new song in memory with data from request body
  const newSong = new Song({ songName: req.body.songName });
  // find album in db by id and add new song
  Album.findById(req.params.albumID, (error, album) => {
    album.songs.push(newSong);
    album.save((err, album) => {
      res.redirect(`/albums/${album.id}`);
    });
  });
});

// RENDER AN EDIT FORM FOR A SONG
router.get("/:albumID/songs/:songID/edit", (req, res) => {
  // set the value of the user and tweet ids
  const albumID = req.params.albumID;
  const songID = req.params.songID;
  // find album in db by id
  Album.findById(albumID, (err, foundAlbum) => {
    // find song embedded in album
    const foundSong = foundAlbum.songs.id(songID);
    // update song name and completed with data from request body
    res.render("songs/edit.ejs", { foundAlbum, foundSong });
  });
});

//DELETE A USER
router.delete('/:id', (req, res)=>{
    Album.findByIdAndRemove(req.params.id, (err)=>{
        res.redirect('/albums');
    });
});

// UPDATE SONG EMBEDDED IN AN ALBUM
router.put("/:albumID/songs/:songID", (req, res) => {
  console.log("PUT ROUTE");
  // set the value of the user and tweet ids
  const albumID = req.params.albumID;
  const songID = req.params.songID;

  // find album in db by id
  Album.findById(albumID, (err, foundAlbum) => {
    // find song embedded in album
    const foundSong = foundAlbum.songs.id(songID);
    // update song name and completed with data from request body
    foundSong.songName = req.body.songName;
    foundAlbum.save((err, savedAlbum) => {
      res.redirect(`/albums/${foundAlbum.id}`);
    });
  });
});

//DELETE A SPECIFIC SONG
router.delete("/:albumID/songs/:songID", (req, res) => {
  console.log("DELETE SONG");
  // set the value of the album and song ids
  const albumID = req.params.albumID;
  const songID = req.params.songID;

  // find album in db by id
  Album.findById(albumID, (err, foundAlbum) => {
    // find song embedded in album
    foundAlbum.songs.id(songID).remove();
    // update song name and completed with data from request body
    foundAlbum.save((err, savedAlbum) => {
      res.redirect(`/albums/${foundAlbum.id}`);
    });
  });
});

module.exports = router;
