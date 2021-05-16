import Entrance from "../components/entrance";
import Layout from "../components/layout";
import { Wrapper } from "../components/util";

export default function Home() {
  return (
    <Layout home>
      <Wrapper>
        <Entrance />
      </Wrapper>
    </Layout>
  );
}
