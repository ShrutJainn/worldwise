import { Container } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import "./index.css";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <BrowserRouter>
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfile /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:postId" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "gray.dark",
              color: "gray.light",
            },
          }}
        />
      </Container>
    </BrowserRouter>
  );
}

export default App;
