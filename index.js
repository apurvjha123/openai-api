import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
dotenv.config();
const app = express();
const port = 5000;
app.use(bodyparser.json());
app.use(cors());

const configuration = new Configuration({
  organization: process.env.organization,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/text", async (req, res) => {
  const { msg } = req.body;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${msg}`,
      },
    ],
  });

  res.json({
    ques: msg,
    msg: response.data.choices[0].message.content,
  });
});

app.post("/img", async (req, res) => {
  const arr = [];
  const {prompt}=req.body;
  try {
    const result = await openai.createImage({
      prompt: `${prompt}`,
      n: 2,
      size: "1024x1024",
    });
    result.data.data.map((results) => {
      arr.push(results);
    });
    res.json({
      arr
    })

  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
