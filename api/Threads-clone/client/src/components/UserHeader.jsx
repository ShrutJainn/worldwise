import {
  Avatar,
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function UserHeader({ user }) {
  const { bio, name, profilePic, username, followers } = user;
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [isLoading, setIsLoading] = useState(false);

  function copyUrl() {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("URL successfully copied");
      })
      .catch((err) => {
        toast.error("There was a problem in copying the URL");
        throw new Error(err.message);
      });
  }

  async function handleFollowUnfollow() {
    if (!currentUser) {
      return toast.error("Please login to follow a user");
    }
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/users/follow/${user._id}`);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      if (following) {
        user.followers.pop();
      } else {
        user.followers.push(currentUser?._id);
      }
      setFollowing(!following);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={name}
              src={profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{bio}</Text>

      {currentUser?._id === user._id && (
        <Button size={"sm"}>
          <Link as={RouterLink} to={"/update"}>
            Update Profile
          </Link>
        </Button>
      )}
      {currentUser?._id !== user._id && (
        <Button
          size={"sm"}
          onClick={handleFollowUnfollow}
          isLoading={isLoading}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>
            {followers.length}{" "}
            {followers.length === 1 ? "follower" : "followers"}
          </Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <MenuList bg={"gray.dark"}>
                <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                  Copy profile link
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          color={"gray.light"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default UserHeader;
