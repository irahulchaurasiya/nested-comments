import { useState } from "react";
import Comments from "./components/Comments";
import { v4 as generatedId } from "uuid";
import { comment } from "postcss";

const App = () => {
  const [commentInput, setCommentInput] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [replyInput, setReplyInput] = useState("");
  const [currentReplyId, setCurrentReplyId] = useState(null);

  function handleCommentChange(e) {
    setCommentInput(e.target.value);
  }

  function handleReplyChange(e) {
    setReplyInput(e.target.value);
  }

  function addComment() {
    if (commentInput.trim()) {
      const newComment = { text: commentInput, id: generatedId(), replies: [] };
      setCommentList((prev) => [...prev, newComment]);
      setCommentInput("");
    }
  }

  function addReply(parentId) {
    if (replyInput.trim()) {
      const newReply = { text: replyInput, id: generatedId(), replies: [] };
      const updatedComments = appendReplytoComment(
        commentList,
        parentId,
        newReply
      );
      setCommentList(updatedComments);
      setReplyInput("");
      setCurrentReplyId(null);
    }
  }

  function appendReplytoComment(comments, id, reply) {
    return comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return {
        ...comment,
        replies: appendReplytoComment(comment.replies, id, reply),
      };
    });
  }

  function removeCommentOrReply(id) {
    const updatedComments = filterOutCommentOrReply(commentList, id);
    setCommentList(updatedComments);
  }

  function filterOutCommentOrReply(comments, id) {
    return comments
      .filter((comment) => comment.id !== id)
      .map((comment) => ({
        ...comment,
        replies: filterOutCommentOrReply(comment.replies, id),
      }));
  }

  function toggleReplyInput(id) {
    setCurrentReplyId((prevId) => (prevId === id ? null : id));
  }

  return (
    <div>
      <div className="pt-4 pb-4 text-center font-bold text-2xl">
        Nested Comments
      </div>
      <div className="ml-2">
        <input
          className="border-2 border-black rounded-md"
          placeholder="Add comment..."
          type="text"
          onChange={handleCommentChange}
        />
        <button
          onClick={addComment}
          className="rounded-md ml-2 bg-gray-300 hover:bg-gray-400 border-2 border-black"
        >
          Add
        </button>
        <ul>
          <Comments
            comments={commentList}
            toggleReplyInput={toggleReplyInput}
            removeCommentOrReply={removeCommentOrReply}
            currentReplyId={currentReplyId}
            replyInput={replyInput}
            handleReplyChange={handleReplyChange}
            addReply={addReply}
          />
        </ul>
      </div>
    </div>
  );
};

export default App;
