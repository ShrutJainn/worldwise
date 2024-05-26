import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

function UserPage() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(`/api/users/profile/${username}`);
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setUser(data);
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    }
    async function getPosts() {
      setFetchingPosts(true);
      try {
        const { data } = await axios.get(`/api/posts/user/${username}`);
        if (data.error) return toast.error(data.error);
        setPosts(data);
      } catch (error) {
        toast.error(error);
      } finally {
        setFetchingPosts(false);
      }
    }
    fetchUser();
    getPosts();
  }, [username, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!posts) return null;

  if (!user && !loading) return <h1>User not found</h1>;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && (
        <h1>User has not posted yet.</h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent="center" my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => {
        return <Post post={post} key={post._id} />;
      })}
    </>
  );
}

export default UserPage;
