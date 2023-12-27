import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

function Loading() {
  return <Wrapper>Loading...</Wrapper>;
}

export default React.memo(Loading);
