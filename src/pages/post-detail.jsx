import React from "react";
import { useParams } from "react-router-dom";
import { postService } from "../services/api";
import usePostStore from "../store/postStore";
import Post from "../components/Post";
import { Icon } from "@iconify/react";
import InteractiveButton from "../components/InteractiveButton";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import Comment from "../components/Comment";

export default function PostDetail() {
  const { id } = useParams();
  const { post, getPost, addComment, getPostComments, comments } =
    usePostStore();
  const [comment, setComment] = React.useState("");
  const [submitLoading, setSubmitLoading] = React.useState(false);

  React.useEffect(() => {
    getPost(id);
    getPostComments(id);
  }, [id]);

  const handleAddComment = async () => {
    if (!comment.length) return;
    setSubmitLoading(true);
    try {
      const response = await postService.addComment(id, comment);
      addComment(id, response.data.comment);
      setComment("");
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  console.log("post", post);
  console.log("comments", comments);
  return (
    <div className="pb-5">
      {post && (
        <>
          <Post post={post} />
          {/* Create Comment Section */}
          <div className="flex items-center space-x-3 pt-3">
            <img
              src="https://placeholder.com/32x32"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex items-center">
              <input
                type="text"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                placeholder="Share something"
                className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex space-x-2 ml-2">
                <InteractiveButton
                  className="!py-2"
                  onClick={handleAddComment}
                  disabled={!comment.length}
                  loading={submitLoading}
                >
                  Send
                </InteractiveButton>
              </div>
            </div>
          </div>
          {/* Comments */}
          <div className="space-y-4 mt-4">
            {comments?.comments
              ?.filter((comment) => !comment.isReply)
              .map((comment) => (
                <Comment
                  key={comment._id}
                  comments={comments.comments}
                  comment={comment}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
