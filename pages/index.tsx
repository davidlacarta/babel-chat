import Layout from "../components/Layout";
import Chat from "../components/Chat";
import useSocketIo from "../client/useSocketIo";

export default function Home() {
  const [socket] = useSocketIo();

  return (
    <Layout>
      <Chat socket={socket} />
    </Layout>
  );
}
