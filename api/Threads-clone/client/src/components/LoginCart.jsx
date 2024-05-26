"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authScreenAtom";
import axios from "axios";
import toast from "react-hot-toast";
import userAtom from "../atoms/userAtom";

export default function LoginCart() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);

  async function onSubmit(userInfo) {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/users/login", userInfo);

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
      toast.success("Login successful");
    } catch (err) {
      if (err.response.data.error) {
        toast.error(err.response.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <HStack>
              <Box w={"full"}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" {...register("username")} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging In"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
              >
                Log in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Not a user?{" "}
                <Link
                  onClick={() => setAuthScreenState("signup")}
                  style={{ textDecoration: "underline" }}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
