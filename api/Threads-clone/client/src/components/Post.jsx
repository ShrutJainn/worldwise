import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { DeleteIcon } from "@chakra-ui/icons";

import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

function Post({ post }) {
  const navigate = useNavigate();
  // const [liked, setLiked] = useState(false);

  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const { postedBy, text: postTitle, img: postImg, replies } = post;
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await axios.get(`/api/users/profile/${postedBy}`);
        if (data.error) {
          return toast.error(data.error);
        }
        setUser(data);
      } catch (error) {
        toast.error(error);
        setUser(null);
      }
    }
    getUser();
  }, [postedBy]);

  async function handleDeletePost(e) {
    try {
      e.preventDefault();
      //confirm whether user wanted to delete this post
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const { data } = await axios.delete(`/api/posts/delete/${post._id}`);
      if (data.error) {
        toast.error(data.error);
      }
      toast.success("Post deleted successfully");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      toast.error(error);
    }
  }

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={5} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
            size="md"
            name={user?.name}
            src={user?.profilePic}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {replies.length === 0 && <Text align={"center"}>🥱</Text>}
            {/* {replies[0] && (
              <Avatar
                size={"xs"}
                name="John Doe"
                src={replies[0].profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {replies[1] && (
              <Avatar
                size={"xs"}
                name="John Doe"
                src={replies[1].profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {replies[2] && (
              <Avatar
                size={"xs"}
                name="John Doe"
                src={replies[2].profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )} */}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
                fontSize={"sm"}
                fontWeight={"bold"}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user._id && (
                <DeleteIcon onClick={handleDeletePost} size={"md"} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{postTitle}</Text>
          {postImg && (
            <Box
              position={"relative"}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

export default Post;
