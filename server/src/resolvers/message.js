import { writeDB } from "../dbController.js";
import { v4 } from "uuid";

/*
parent: parent 객체, 거의 사용안함
args: Query에 필요한 필드에 제공되는 인수
context: 로그인한 사용자, DB access 등의 중요한 정보들
*/

const messageResolver = {
  Query: {
    messages: (parent, args, { db }) => {
      // console.log(parent, args, context);
      return db.messages;
    },
    message: (parent, { id = "" }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      writeDB("messages", db.messages);
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "메세지가 없습니다.";
      if (db.messages[targetIndex].userId !== userId)
        throw "사용자가 다릅니다.";
      const newMsg = { ...db.messages[targetIndex], text };
      db.messages.splice(targetIndex, 1, newMsg);
      writeDB("messages", db.messages);
      return newMsg;
    },
    deleteMessage: (parent, { id, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "메세지가 없습니다.";
      if (db.messages[targetIndex].userId !== userId)
        throw "사용자가 다릅니다.";
      db.messages.splice(targetIndex, 1);
      writeDB("messages", db.messages);
      return id;
    },
  },
};

export default messageResolver;
