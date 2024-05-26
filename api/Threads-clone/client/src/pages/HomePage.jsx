import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

function HomePage() {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getFeedPosts() {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/posts/feed");
        if (data.error) {
          return toast.error(data.error);
        }
        setPosts(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getFeedPosts();
  }, [setPosts]);

  return (
    <>
      {!isLoading && posts?.length === 0 && (
        <h1>Follow some users to see the feed</h1>
      )}
      {isLoading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts?.map((post) => {
        return <Post key={post._id} post={post} />;
      })}
    </>
  );
}

export default HomePage;
