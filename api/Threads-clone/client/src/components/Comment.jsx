import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

function Comment({ userAvatar, createdAt, comment, username }) {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={userAvatar} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text>
            </Flex>
          </Flex>
          <Text>{comment}</Text>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
}

export default Comment;
