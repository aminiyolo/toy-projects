import MsgInput from "./MsgInput";

const MsgItem = ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  startEdit,
  isEditing,
  onDelete,
  myId,
  user,
}) => (
  <li className="messages__item">
    <h3>
      {user.nickname}{" "}
      <sub>
        {new Date(timestamp).toLocaleString("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </sub>
    </h3>
    {isEditing ? (
      <>
        <MsgInput mutate={onUpdate} id={id} text={text} />
      </>
    ) : (
      text
    )}
    {myId === userId && (
      <div className="message__buttons">
        <button onClick={startEdit}>수정하기</button>
        <button onClick={onDelete}>삭제하기</button>
      </div>
    )}
  </li>
);

export default MsgItem;
