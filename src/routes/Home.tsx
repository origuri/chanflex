import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import Loading from "../components/Loading";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "../useWindowDemensions";
import { Movie } from "@mui/icons-material";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden; // x축 스크롤바 안보여줌
`;

const Banner = styled.div<{ $bgphoto: string }>`
  height: 100vh; // 화면 가득 차게
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  // 이미지를 흐리게 만들어야 하므로 이미지에 놓는다.
  // 순서 중요 ! 먼저 쓴게 앞쪽 레이어를 차지
  // linear-gradient(위쪽 색, 아래쪽 색) 그라데이션
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgphoto}); // url로 받는 사진이면 앞에 url 붙임
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
  gap: 5px;
  position: absolute;
  width: 100%;
`;

/* background-image: url(${(props) => props.$bgphoto});
background-size: cover;
background-position: center center; */

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  position: relative;
  background-color: white;
  height: 150px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  // box div의 첫번째 div는 왼쪽에서 시작해서 중앙으로 커짐.(애니메이션 scale 걸어놓음)
  &:first-child {
    transform-origin: left center;
  }
  // box div의 마지막 div는 오른쪽에서 시작해서 중앙으로 커짐.(애니메이션 scale 걸어놓음)
  &:last-child {
    transform-origin: right center;
  }
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BoxInfo = styled(motion.div)`
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 12px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)<{ $scrollY: number }>`
  position: absolute;
  background-color: ${(props) => props.theme.black.lighter};
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.$scrollY + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 200px;
  background-position: center center;
  background-size: cover;
`;
const BigTitle = styled.div`
  text-align: center;
  padding: 10px;
  font-size: 28px;
  position: relative;
  top: -70px;
`;

const BigOverview = styled.p`
  padding: 20px;
`;

// variants

const boxVars = {
  normal: {
    scale: 1,
    transition: {
      type: "linear",
    },
  },
  // hover에만 delay를 준 것
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,

    transition: {
      delay: 0.3,
      type: "linear",
    },
  },
};

const boxInfoVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,

      duaration: 0.1,
      type: "tween",
    },
  },
};

const offSet = 6;

function Home() {
  // url 변화를 주기 위한 react hook
  const navigate = useNavigate();
  // movie url을 보기 위한 match
  const bigMovieMatch = useMatch("/movies/:movieId");
  //console.log("d이거 -> ", bigMovieMatch);

  const { scrollY } = useScroll();
  //console.log("스크롤 -> ", scrollY);

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  //console.log(data, isLoading);
  // 슬라이더 방어 코드
  const [leaving, setLeaving] = useState(false);

  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (leaving) return;
    if (!data) return;
    setLeaving(true);
    // 첫번째 영화를 사용 중이기 때문에 -1 함
    const totalmovies = data?.results.length - 1;
    //  console.log("totalmovies.length => ", totalmovies);

    // 같은 의미
    //const limitIndex = Math.ceil(totalmovies / offSet) - 1;
    const limitIndex = Math.floor(totalmovies / offSet);
    // console.log("limitIndex => ", limitIndex);
    setIndex((prev) => (prev === limitIndex ? 0 : prev + 1));
  };

  const toggleLeaving = () => {
    setLeaving(false);
  };

  // 윈도우 resize 추적해주는 hook
  const width = useWindowDimensions();

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  // 박스 모달이 뜨고 다른 곳을 눌렀을 때 url을 바꿔주는 함수
  const onOverlayClicked = () => {
    navigate("/");
  };
  // 모달창이 띄워졌다면, result 배열에서 id가 같은 것을 찾은 것.
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.movieId)
    );
  console.log("이거 확인 -> ", clickedMovie);

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* data?.results[0].backdrop_path가 undefined 속성이 있기 때문에 없을 시에 경우도 적어줘야 함*/}
          <Banner
            $bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            onClick={increaseIndex}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                initial={{ x: width }}
                animate={{ x: 0 }}
                exit={{ x: -width }}
                transition={{ type: "linear", duration: 1 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offSet * index, offSet * index + offSet)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVars}
                      initial="normal"
                      whileHover="hover"
                      key={movie.id}
                      $bgPhoto={makeImagePath(
                        movie.backdrop_path || "",
                        "w500"
                      )}
                    >
                      <BoxInfo variants={boxInfoVars}>
                        <h4>{movie.title}</h4>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  $scrollY={scrollY.get()}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
