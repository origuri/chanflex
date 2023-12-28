import React, { useEffect, useState } from "react";

// 변하는 resize를 가져오는 함수
function getWindowDimensions() {
  const { innerWidth: width } = window;
  //console.log("이거 확인-> ", width);

  return width;
}
// custom hook
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  // 최초 실행 시
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    // 최초 실행 시에 이벤트를 추가해주는 역할
    window.addEventListener("resize", handleResize);
    // 클린 업
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //console.log("실행되?->", windowDimensions);
  return windowDimensions;
}

export default useWindowDimensions;
