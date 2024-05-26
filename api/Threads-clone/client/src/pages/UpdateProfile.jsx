"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import useImagePreview from "../hooks/useImagePreview";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateProfile() {
  const { register, handleSubmit, reset } = useForm();
  const [user, setUser] = useRecoilState(userAtom);
  const { imgUrl, handleImageChange } = useImagePreview();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(updatedInfo) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { data } = await axios.put(`/api/users/update/${user._id}`, {
        ...updatedInfo,
        profilePic: imgUrl,
      });
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success("Profile updated successfully");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  const fileRef = useRef(null);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button
                  disabled={isLoading}
                  w="full"
                  onClick={() => fileRef.current.click()}
                >
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              {...register("username")}
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              {...register("name")}
              placeholder="Full name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              {...register("email")}
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              {...register("bio")}
              placeholder="You bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
              disabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              {...register("password")}
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              disabled={isLoading}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
