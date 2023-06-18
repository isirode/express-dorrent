import express, { Application, Request, Response } from "express";
import createTorrent from 'create-torrent';
import parseTorrent from 'parse-torrent';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app: Application = express();
const port = 5100;

const fileDir = 'public';
const extension = '.dorrent';
const torrentDir = 'dorrent';

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/${fileDir}`, express.static(fileDir));
app.use(`/${torrentDir}`, express.static(torrentDir));

// console.log(__dirname);// __dirname is not defined in ES module scope
// console.log(process.cwd());

// Info : :filename([A-Za-z0-9_]+) is not working for a reason
app.get(`/${torrentDir}/:filename([^:]+)${extension}`, (req, res) => {
  console.debug('fetching torrent');
  console.debug(req.params.filename);
  // TODO : I rather know if an invalid filename is passed
  // Info : express is resolving by normalizing the path as well
  // So something containing .. will pass by the static handler first
  const filename = path.normalize(req.params.filename);
  console.debug(filename);
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