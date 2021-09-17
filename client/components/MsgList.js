import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useEffect, useState, useRef } from "react";
import fetcher from "../fetcher.js";
import { useRouter } from "next/router";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";

// const UserIds = ["roy", "jay"];
// const getRandomUserId = () => UserIds[Math.round(Math.random())];

// const OriginalMsgs = Array(50)
//   .fill(0)
//   .map((_, i) => ({
//     id: 50 - i,
//     userId: getRandomUserId(),
//     timestamp: 1234567890123 + (50 - i) * 1000 * 60,
//     text: `${50 - i} mock test`,
//   }));

const MsgList = ({ smsgs, users }) => {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) return;

    // const newMsg = {
    //   id: msgs.length + 1,
    //   userId: getRandomUserId(),
    //   timestamp: Date.now(),
    //   text: `${msgs.length + 1} ${text}`,
    // };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) return;
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const doneEdit = () => setEditingId(null);

  const onDelete = async (id) => {
    const ID = await fetcher("delete", `/messages/${id}?userId=${userId}`);
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === String(ID));
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const getMessages = async () => {
    const newMsgs = await fetcher(
      "get",
      `/messages?cursor=${msgs[msgs.length - 1]?.id || ""}`
    );
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            onDelete={() => onDelete(x.id)}
            myId={userId}
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
