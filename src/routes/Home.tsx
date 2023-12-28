import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import Loading from "../components/Loading";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden; // x축 스크롤바 안보여줌
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh; // 화면 가득 차게
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  // 이미지를 흐리게 만들어야 하므로 이미지에 놓는다.
  // 순서 중요 ! 먼저 쓴게 앞쪽 레이어를 차지
  // linear-gradient(위쪽 색, 아래쪽 색) 그라데이션
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto}); // url로 받는 사진이면 앞에 url 붙임
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  max-width: 700px;
  width: 100%;
  min-width: 400px;
  margin-bottom: 35px;
`;
const Overview = styled.p`
  font-size: 34px;
  max-width: 600px;
  width: 100%;
  min-width: 300px;
`;

const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 150px;
  color: black;
  font-size: 26px;
`;

// variants

const rowVars = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};
function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data, isLoading);

  const [index, setIndex] = useState(0);
  const increaseIndex = () => setIndex((prev) => prev + 1);

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* data?.results[0].backdrop_path가 undefined 속성이 있기 때문에 없을 시에 경우도 적어줘야 함*/}
          <Banner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
            onClick={increaseIndex}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence>
              <Row
                key={index}
                variants={rowVars}
                initial="hidden"
                animate="visible"
                transition={{ type: "linear", duration: 1 }}
                exit="exit"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>{i}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
