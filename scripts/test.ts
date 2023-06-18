import fetch from 'node-fetch';
import crypto from 'node:crypto';
import { stdout } from 'node:process';
import parseTorrent, { Instance, remote } from 'parse-torrent';

// To run the file, use `ts-node-esm ./scripts/test.ts`

// This is the file I am using locally, it is the Grammalecte database for the word-guessing project
// It is not committed since it is voluminous
// There is a file named hello-world.txt if needed, that is committed
const localFilename = 'http://localhost:5100/public/sample.db';
const remoteFilename = 'https://static.isirode.ovh/public/word-guessing/dictionaries/grammalecte/db-fra-grammalecte-1.0.0.db';
// const torrentFilename = `http://localhost:5100/dorrent/sample.db.dorrent`;
const torrentFilename = `http://static.isirode.ovh:5100/dorrent/hello-world.txt.dorrent`;

async function main() {
  
  // fetchRangeAndHash();

  fetchTorrentUsingRemoteAndFilename();

}

async function fetchRangeAndHash() {
  const response = await fetch(remoteFilename, {
    headers: {
      'range': 'bytes=0-' + (65536 - 1)
    }
  });
  const body = await response.body;

  if (body === null) {
    throw new Error('body was null');
  }

  // console.log(body);

  const sha1 = crypto.createHash('sha1');

  // working
  // body?.pipe(sha1).setEncoding('hex').pipe(stdout);

  // working
  sha1.setEncoding('hex');
  body.on('end', function() {
    sha1.end();
    const hash: string = sha1.read();
    console.log(hash);
  });

  body.pipe(sha1);
}

async function fetchAndHash() {
  const response = await fetch(remoteFilename);
  const body = await response.body;

  if (body === null) {
    throw new Error('body was null');
  }

  // console.log(body);

  const sha1 = crypto.createHash('sha1');

  // working
  // body?.pipe(sha1).setEncoding('hex').pipe(stdout);

  // working
  sha1.setEncoding('hex');
  body.on('end', function() {
    sha1.end();
    const hash: string = sha1.read();
    console.log(hash);
  });

  body.pipe(sha1);
}

// working
async function fetchTorrentUsingRemoteAndFilename() {
  remote(torrentFilename, (err: unknown, parsedTorrent?: Instance) => {
    if (err) throw err;
    console.log('parsed torrent');
    console.log(parsedTorrent);
  });
}

// not working
// Error: Invalid torrent identifier
async function fetchTorrentUsingBlobAndRemote() {
  const response = await fetch(torrentFilename);
  if (response.status !== 200) {
    throw new Error(`an error occurred : ${response.status}:${response.statusText}`)
  }
  const body = await response.blob();
  remote(body, (err: unknown, parsedTorrent?: Instance) => {
    if (err) throw err;
    console.log('parsed torrent');
    console.log(parsedTorrent);
  });
}

// not working
// Error: Invalid torrent identifier
// Weirdly, the stacktrace is bigger
async function fetchTorrentUsingBlobAndParseTorrent() {
  const response = await fetch(torrentFilename);
  if (response.status !== 200) {
    throw new Error(`an error occurred : ${response.status}:${response.statusText}`)
  }
  const body = await response.blob();

  console.log(parseTorrent(await body.arrayBuffer()));
}

// working
async function fetchTorrentUsingBlobAndArrayBufferAndParseTorrent() {
  const response = await fetch(torrentFilename);
  if (response.status !== 200) {
    throw new Error(`an error occurred : ${response.status}:${response.statusText}`)
  }
  const body = await response.blob();

  console.log(await parseTorrent(new Buffer(await body.arrayBuffer())));
}

main();