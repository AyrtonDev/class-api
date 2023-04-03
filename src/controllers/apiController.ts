import { Request, Response } from "express";
import { unlink } from "fs";
import { Sequelize } from "sequelize";
import sharp from "sharp";

import { Phrase } from "../models/Phrase";

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
};

export const random = (req: Request, res: Response) => {
  let nRand: number = Math.floor(Math.random() * 10);

  res.json({
    number: nRand,
  });
};

export const name = (req: Request, res: Response) => {
  let name: string = req.params.name;

  res.json({
    name,
  });
};

export const createPhrase = async (req: Request, res: Response) => {
  let { author, txt } = req.body;

  let newPhrase = await Phrase.create({ author, txt });

  res.status(201);
  res.json({ id: newPhrase.id, message: "phrase was created" });
};

export const listPhrases = async (req: Request, res: Response) => {
  let list = await Phrase.findAll();

  res.json({ list });
};

export const getPhrase = async (req: Request, res: Response) => {
  const { id } = req.params;
  let phrase = await Phrase.findByPk(id);

  if (phrase) {
    res.json({ phrase });
  } else {
    res.status(404);
    res.json({
      message: `The phrase with id ${id} is not found!`,
    });
  }
};

export const putPhrase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, txt } = req.body;

  let phrase = await Phrase.findByPk(id);

  if (phrase) {
    phrase.author = author;
    phrase.txt = txt;

    await phrase.save();

    res.json({
      message: `The phrase with id ${id} was updated!`,
    });
  } else {
    res.status(404);
    res.json({
      message: `The phrase with id ${id} is not found!`,
    });
  }
};

export const deletePhrase = async (req: Request, res: Response) => {
  const { id } = req.params;

  let phrase = await Phrase.findByPk(id);

  if (phrase) {
    phrase.destroy();

    res.json({
      message: `The phrase with id ${id} was deleted!`,
    });
  } else {
    res.status(404);
    res.json({
      message: `The phrase with id ${id} is not found!`,
    });
  }
};

export const randomPhrase = async (req: Request, res: Response) => {
  let phrase = await Phrase.findOne({
    order: [Sequelize.fn("RANDOM")],
  });

  if (phrase) {
    res.json({ phrase });
  } else {
    res.status(404);
    res.json({
      message: "There is no phrase registered",
    });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  // type UploadTypes = {
  //   avatar: Express.Multer.File[];
  //   gallery: Express.Multer.File[];
  // };

  // const files = req.files as UploadTypes;
  console.log("AVATAR", req.file);
  // console.log("GALLERY", files.gallery);

  if (req.file) {
    const filename = `${req.file.filename}.jpg`;

    await sharp(req.file.path)
      .resize(500)
      .toFormat("jpeg")
      .toFile(`./public/media/${filename}`);

    await unlink(req.file.path, (err) => {
      if (err) console.error(err);
      console.log("the file was deleted");
    });

    res.json({
      image: `${filename}`,
    });
  } else {
    res.status(400);
    res.json({ error: "Arquivo inválido." });
  }
};
