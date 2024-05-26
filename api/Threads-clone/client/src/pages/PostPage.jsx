/* eslint-disable react/no-unescaped-entities */
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Comment from "../components/Comment";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

function PostPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const currentPost = posts[0];

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/users/profile/${username}`);
        if (data.error) {
          return toast.error(data.error);
        }
        setUser(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    async function getPost() {
      setPosts([]);
      try {
        const { data } = await axios.get(`/api/posts/${postId}`);
        if (data.error) return toast.error(data.error);

        setPosts([data]);
      } catch (error) {
        toast.error(error);
      }
    }
    getUser();
    getPost();
  }, [username, postId, setPosts]);

  async function handleDeletePost() {
    try {
      //confirm whether user wanted to delete this post
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const { data } = await axios.delete(
        `/api/posts/delete/${currentPost._id}`
      );
      if (data.error) {
        toast.error(data.error);
      }
      toast.success("Post deleted successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error);
    }
  }

  if (!currentPost || !user) return null;

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        {/* <Flex gap={4} alignItems={"center"}>
          <Text width={36} fontSize={"sm"} color={"gray.light"}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          <BsThreeDots />
        </Flex> */}
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon
              onClick={handleDeletePost}
              size={"md"}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
          position={"relative"}
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      {/* <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.likes.length} likes
        </Text>
      </Flex> */}
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => {
        return (
          <Comment
            key={reply._id}
            comment={reply.text}
            createdAt={reply.createdAt}
            // likes={reply.likes}
            username={reply.username}
            userAvatar={reply.profilePic}
          />
        );
      })}
    </>
  );
}

export default PostPage;
