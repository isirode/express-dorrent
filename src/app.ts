import express, { Application, Request, Response } from "express";
import createTorrent from 'create-torrent';
import parseTorrent from 'parse-torrent';
import fs from 'fs';
import path from 'path';

const app: Application = express();
const port = 5100;

const fileDir = 'public';
const extension = '.dorrent';
const torrentDir = 'dorrent';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/${fileDir}`, express.static(fileDir));
app.use(`/${torrentDir}`, express.static(torrentDir));

// console.log(__dirname);// __dirname is not defined in ES module scope
// console.log(process.cwd());

app.get(`/${torrentDir}/:filename${extension}`, (req, res) => {
  console.log('fetching torrent');
  console.log(req.params.filename);
  const filename = req.params.filename;
  createTorrent(`./${fileDir}/${filename}`, {
    announceList: [
      ["nothing"]
    ]
  }, async (err: unknown, torrent: Buffer) => {
    if (!err) {
      console.log('torrent was generated');
      console.log(await parseTorrent(torrent));
      const fileToCreate = `./${torrentDir}/${filename}${extension}`;
      await fs.promises.mkdir(path.dirname(fileToCreate), {recursive: true});
      await fs.promises.writeFile(fileToCreate, torrent);
      res.status(200);
      return res.end(torrent);
    } else {
      console.warn(err);
      res.status(404).send('File not found');
    }
  });
});

try {
  app.listen(port, (): void => {
      console.log(`The server is listening on port ${port}`);
  });
} catch (error: any) {
    console.error(`An error occured: ${error.message}`);
}