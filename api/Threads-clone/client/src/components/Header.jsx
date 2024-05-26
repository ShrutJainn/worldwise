import { Flex, Image, useColorMode, Link, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import userAtom from "../atoms/userAtom";
import { FiLogOut } from "react-icons/fi";
import { IoIosChatbubbles } from "react-icons/io";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authScreenAtom";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const logout = useLogout();
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {currentUser && (
        <Link as={RouterLink} to={"/"}>
          <AiFillHome size={24} />
        </Link>
      )}
      {!currentUser && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {currentUser && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/chat`}>
            <IoIosChatbubbles size={24} />
          </Link>
          <Link as={RouterLink} to={`/${currentUser.username}`}>
            <RxAvatar size={20} />
          </Link>
          <Button size={"xm"} onClick={logout}>
            <FiLogOut />
          </Button>
        </Flex>
      )}

      {!currentUser && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
}

export default Header;
