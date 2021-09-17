import { useRef } from "react";

const MsgInput = ({ mutate, id = undefined, text = "" }) => {
  const textRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = "";
    mutate(text, id);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") onSubmit(e);
    else return;
  };

  return (
    <form
      className="messages__input"
      onSubmit={onSubmit}
      onKeyPress={onKeyPress}
    >
      <textarea
        ref={textRef}
        defaultValue={text}
        placeholder="내용을 입력하세요"
      />
      <button type="submit">완료</button>
    </form>
  );
};

export default MsgInput;
