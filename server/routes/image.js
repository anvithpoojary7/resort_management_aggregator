const express = require('express');
const router = express.Router();

module.exports = (gfs, gridfsBucket) => {
  // GET image by filename
  router.get('/:filename', async (req, res) => {
    try {
      const file = await gfs.files.findOne({ filename: req.params.filename });
      if (!file) return res.status(404).json({ error: 'File not found' });

      const readStream = gridfsBucket.openDownloadStreamByName(file.filename);
      res.set('Content-Type', file.contentType);
      readStream.pipe(res);
    } catch (err) {
      console.error('❌ Error fetching image:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
